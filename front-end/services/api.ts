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

export const getUser = async (username: string, token: string): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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

export const sendFriendRequest = async (username: string, friendUsername: string, token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/friend-requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

export const getFriendRequests = async (username: string, token: string): Promise<FriendRequest[]> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friend-requests`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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

export const acceptFriendRequest = async (id: number, token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/friend-requests/${id}/accept`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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

export const declineFriendRequest = async (id: number, token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/friend-requests/${id}/decline`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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

export const getFriends = async (username: string, token: string): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friends`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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

export const removeFriend = async (username: string, friendUsername: string, token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/users/${username}/friends/${friendUsername}`, {
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
        console.error('Error removing friend:', error);
        throw error;
    }
}

export async function banUser(username: string, token: string): Promise<void> {
    const response = await fetch(`/api/users/ban`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ username }), 
    });

    if (!response.ok) {
        throw new Error('Failed to ban user');
    }
}
