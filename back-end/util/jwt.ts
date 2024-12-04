import jwt from 'jsonwebtoken';

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

export default generateJwtToken;