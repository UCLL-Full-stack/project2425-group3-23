import { Message, User } from '../types';

const API_URL = 'http://localhost:3000'; 

export const getMessages = async (): Promise<Message[]> => {
    try {
        const response = await fetch(`${API_URL}/messages`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const data: Message[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};


export const createMessage = async (
    content: string,
    senderUsername: string
): Promise<Message> => {
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                deleted: false,
                sender: { username: senderUsername } as User,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create message');
        }

        const data: Message = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
};