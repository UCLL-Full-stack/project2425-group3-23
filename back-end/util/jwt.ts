import jwt from 'jsonwebtoken';
import {Request} from "express";

const generateJwtToken = (username : string, role : string ): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'cat_chat_app' };
    const secret : string = process.env.JWT_SECRET as string;

    try {
        return jwt.sign({ username, role }, secret, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see sever log for details.');
    }
}

const getUsernameAndRoleFromRequest = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.decode(token);
        if (!decodedToken) {
            throw new Error('Invalid token');
        }
        return decodedToken as { username: string, role: string };
    } else {
        return { username: 'guest', role: 'guest' };
    }
}

export default {
    generateJwtToken,
    getUsernameAndRoleFromRequest
};