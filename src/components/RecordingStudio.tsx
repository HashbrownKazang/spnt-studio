"use client";

import React, { useRef, useState, useEffect } from "react";

export default function RecordingStudio() {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gain, setGain] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup gain node and analyser when stream changes
  useEffect(() => {
    if (stream) {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      gainNodeRef.current = gainNode;
      analyserRef.current = analyser;
      sourceRef.current = source;

      drawWaveform();

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        audioContext.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  // Update gain when slider changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = gain;
    }
  }, [gain]);

  // Timer logic
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording, isPaused]);

  // Start recording
  const startRecording = async () => {
    if (isRecording) return;
    setTimer(0);
    setAudioChunks([]);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(userStream);

      const recorder = new MediaRecorder(userStream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      alert("Error accessing microphone: " + (err as Error).message);
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
    } else if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  // Draw waveform
  const drawWaveform = () => {
    const canvas = document.getElementById("waveform-canvas") as HTMLCanvasElement;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4f46e5";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Podcast Recorder</h2>
        {/* Waveform analyzer visualization */}
        <div className="mb-4">
          <canvas id="waveform-canvas" width={600} height={100} className="bg-gray-900 rounded" />
        </div>
        {/* Controls */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={isRecording}
            onClick={startRecording}
          >
            Record
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            disabled={!isRecording}
            onClick={pauseRecording}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            disabled={!isRecording}
            onClick={stopRecording}
          >
            Stop
          </button>
          <span className="ml-4 font-mono text-lg">{formatTime(timer)}</span>
        </div>
        {/* Gain slider */}
        <div className="mb-4">
          <label className="mr-2">Gain:</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={gain}
            onChange={e => setGain(Number(e.target.value))}
            className="w-48"
            disabled={!isRecording}
          />
          <span className="ml-2">{gain.toFixed(2)}x</span>
        </div>
        {/* Preset audio clips */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Preset Clips</h3>
          <div className="flex space-x-2">
            {/* TODO: List preset clips, play/insert/record new */}
            <button className="px-3 py-1 bg-blue-500 text-white rounded">Intro</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">Ad</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">Outro</button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded">+ New Clip</button>
          </div>
        </div>
        {/* Playback of recorded audio */}
        {audioUrl && (
          <div className="mb-4">
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
        {/* TODO: On stop, show metadata form and handle upload */}
      </div>
    </div>
  );
}

// Helper to format seconds as mm:ss
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
