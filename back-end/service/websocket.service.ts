import { WebSocket } from 'ws';
import {Message} from "../types";
import {prepareMessage} from "../util/dtoConverters";

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

    broadcast(messageJsonString: string): void {
        const message : Message = JSON.parse(messageJsonString);
        prepareMessage(message);
        const messageString = JSON.stringify(message);

        for (const client of this.clients) {
            if (client.readyState === 1) {
                client.send(messageString);
            }
        }
    }
}

const websocketService = new WebsocketService();
export default websocketService;