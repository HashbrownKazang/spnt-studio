import { auth } from "@clerk/nextjs/server";
import RecordingInterface from "@/components/RecordingInterface";

export default async function RecordPage() {
  const { userId } = await auth();

  if (userId) {
    return <RecordingInterface />;
  } else {
    return <p>Please sign in to access the recording interface.</p>;
  }
}
