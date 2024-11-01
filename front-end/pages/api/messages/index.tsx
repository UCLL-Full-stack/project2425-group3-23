
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const BACKEND_URL = 'http://localhost:8080'; // Replace with your backend URL

    if (req.method === 'GET') {
        try {
            const response = await fetch(`${BACKEND_URL}/messages`); // Fetch from the backend API
            if (!response.ok) throw new Error('Failed to fetch messages from backend');

            const messages = await response.json();
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Error fetching messages' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
