import {Message, User} from '../types';

const API_URL = 'http://localhost:3000'; // Sofie...

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
        if (!content) {
            throw new Error('Content is required');
        }
        if (!senderUsername) {
            throw new Error('Sender is required');
        }

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

export const getUser = async (username: string): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export const addFriend = async (username: string, friendUsername: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/friend-requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderUsername: username,
                receiverUsername: friendUsername,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to add friend');
        }
    } catch (error) {
        console.error('Error adding friend:', error);
        throw error;
    }
}

export const removeFriend = async (username: string, friendUsername: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friends/${friendUsername}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to remove friend');
        }
    } catch (error) {
        console.error('Error removing friend:', error);
        throw error;
    }
}