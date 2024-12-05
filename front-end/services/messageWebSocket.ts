import {Message} from "@/types";

class MessageWebSocket {
    private static instance: WebSocket | null = null;

    static getInstance(messages: Message[], setMessages: (value: (((prevState: Message[]) => Message[]) | Message[])) => void): WebSocket {
        if (MessageWebSocket.instance === null) {
            const API_URL : string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const wsProtocol : "wss" | "ws" = API_URL.startsWith("https") ? "wss" : "ws";

            MessageWebSocket.instance = new WebSocket(`${API_URL.replace(/^https?/, wsProtocol)}/ws`);

            MessageWebSocket.instance.onopen = () => {
                console.log('Connected to WebSocket.');
            }
            MessageWebSocket.instance.onclose = () => {
                console.log('Disconnected from WebSocket.');
            }
            MessageWebSocket.instance.onmessage = (event) => {
                const message = JSON.parse(event.data);

                // Wait 0.1 seconds in case of multiple messages
                setTimeout(() => {
                    // Prevent duplicate messages
                    if (messages.length > 0 && messages[messages.length - 1].id === message.id) {
                        return;
                    }

                    setMessages((prevMessages : Message[]) => [...prevMessages, message]);
                }, 100);
            };
        }
        return MessageWebSocket.instance;
    }

    static destroyInstance() {
        if (this.instance) {
            this.instance.close();
            this.instance = null;
        }
    }
}

export default MessageWebSocket;