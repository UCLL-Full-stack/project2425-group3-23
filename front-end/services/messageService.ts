import {FriendRequest, Message, User, Response} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getPublicMessages = async (
    token?: string
): Promise<Message[]> => {
    try {
        const response = await fetch(`${API_URL}/messages/public-chat`, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
        const data: Message[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};


export const createPublicMessage = async (
    content: string,
    senderUsername: string,
    token: string
): Promise<Message> => {
    try {
        if (!content) {
            throw new Error('Content is required');
        }
        if (!senderUsername) {
            throw new Error('Sender is required');
        }

        const response = await fetch(`${API_URL}/messages/public-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content,
                deleted: false,
                sender: { username: senderUsername } as User,
            }),
        });

        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }

        const data: Message = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
};

export const getPrivateMessages = async (senderUsername : string, chatPartnerUsername : string, token : string): Promise<Message[]> => {
    try {
        if (!senderUsername) {
            throw new Error('Sender is required');
        }
        if (!chatPartnerUsername) {
            throw new Error('Chat partner is required');
        }
        if (!token) {
            throw new Error('Token is required');
        }

        const response = await fetch(`${API_URL}/messages/private-chat/${chatPartnerUsername}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }

        const data: Message[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const createPrivateMessage = async (content: string, senderUsername: string, receiverUsername: string, token: string): Promise<Message> => {
    try {
        if (!content) {
            throw new Error('Content is required');
        }
        if (!senderUsername) {
            throw new Error('Sender is required');
        }
        if (!receiverUsername) {
            throw new Error('Receiver is required');
        }
        if (!token) {
            throw new Error('Token is required');
        }

        const response = await fetch(`${API_URL}/messages/private-chat/${receiverUsername}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content,
                deleted: false,
                sender: { username: senderUsername } as User,
            }),
        });

        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }

        const data: Message = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
}

export const deleteMessage = async (id: number, token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}