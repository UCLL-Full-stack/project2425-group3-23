import {FriendRequest, Message, User, Response} from '../types';

const API_URL = 'http://localhost:3000'; // Sofie...

export const getMessages = async (): Promise<Message[]> => {
    try {
        const response = await fetch(`${API_URL}/messages`);
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

export const getUser = async (username: string): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}`);
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export const sendFriendRequest = async (username: string, friendUsername: string): Promise<void> => {
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
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        console.error('Error adding friend:', error);
        throw error;
    }
}

export const getFriendRequests = async (username: string): Promise<FriendRequest[]> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friend-requests`);
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        throw error;
    }
}

export const acceptFriendRequest = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/friend-requests/${id}/accept`, {
            method: 'PUT',
        });
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error;
    }
}

export const declineFriendRequest = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/friend-requests/${id}/decline`, {
            method: 'PUT',
        });
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        console.error('Error declining friend request:', error);
        throw error;
    }
}

export const getFriends = async (username: string): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friends`);
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
    }
}

export const removeFriend = async (username: string, friendUsername: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friends/${friendUsername}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorResponse: Response = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        console.error('Error removing friend:', error);
        throw error;
    }
}