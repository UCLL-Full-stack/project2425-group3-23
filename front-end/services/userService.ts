import {FriendRequest, Response, User} from "@types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    try {
        await fetch(`${API_URL}/users/${username}/ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({username}),
        });
    } catch (error) {
        console.error('Error banning user:', error);
        throw error;
    }
}

const UserService = {
    getUser,
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    removeFriend,
    banUser,
};

export default UserService;