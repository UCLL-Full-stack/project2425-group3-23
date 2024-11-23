import { WebSocket } from 'ws';

class WebsocketService {
    private readonly clients: Set<WebSocket> = new Set();

    constructor() {
        this.clients = new Set();
    }

    public addClient(client : WebSocket): void {
        this.clients.add(client);
    }

    public removeClient(client : WebSocket): void {
        this.clients.delete(client);
    }

    broadcast(message: string): void {
        for (const client of this.clients) {
            if (client.readyState === 1) {
                client.send(message);
            }
        }
    }
}

const websocketService = new WebsocketService();
export default websocketService;