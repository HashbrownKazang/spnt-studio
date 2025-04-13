interface Env {
    CONNECTIONS: DurableObjectNamespace;
  }
  
  export class ConnectionsStore {
    state: DurableObjectState;
    connections: WebSocket[];
    
    constructor(state: DurableObjectState) {
      this.state = state;
      this.connections = [];
    }
  
    async fetch(request: Request) {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
  
      const { 0: client, 1: server } = new WebSocketPair();
      await this.handleSession(server);
  
      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }
  
    async handleSession(webSocket: WebSocket) {
      webSocket.accept();
      this.connections.push(webSocket);
  
      // Send current listener count to the new connection
      const message = JSON.stringify({
        type: 'listener_count',
        count: this.connections.length
      });
      webSocket.send(message);
  
      // Broadcast new listener joined
      this.broadcast({
        type: 'listener_join',
        count: this.connections.length
      });
  
      webSocket.addEventListener('message', async (msg) => {
        try {
          const data = JSON.parse(msg.data as string);
          // Broadcast message to all connections
          this.broadcast(data);
        } catch (err) {
          webSocket.send(JSON.stringify({
            type: 'error',
            error: 'Invalid message format'
          }));
        }
      });
  
      // Handle connection close
      webSocket.addEventListener('close', () => {
        this.connections = this.connections.filter(conn => conn !== webSocket);
        this.broadcast({
          type: 'listener_leave',
          count: this.connections.length
        });
      });
    }
  
    broadcast(message: any) {
      const msgString = JSON.stringify(message);
      this.connections.forEach(connection => {
        try {
          connection.send(msgString);
        } catch (err) {
          // Connection probably closed
        }
      });
    }
  }
  
  export default {
    async fetch(request: Request, env: Env) {
      const url = new URL(request.url);
      const id = env.CONNECTIONS.idFromName('default');
      const stub = env.CONNECTIONS.get(id);
      return stub.fetch(request);
    }
  };