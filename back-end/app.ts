import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {messageRouter} from "./controller/message.routes";
import {userRouter} from "./controller/user.routes";
import expressWs from "express-ws";
import WebsocketService from "./service/websocket.service";
import {friendRequestRouter} from "./controller/friendRequest.routes";
import {expressjwt} from "express-jwt";

const app = expressWs(express()).app;
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Message server-to-client WebSocket functionality
app.ws('/ws', (ws) => {
    WebsocketService.addClient(ws);

    ws.on('close', () => {
        WebsocketService.removeClient(ws);
    });
});

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/ws',
            '/api-docs',
            /^\/api-docs\/.*/,
            '/users/login',
            '/users/register',
            '/status',
            { url: '/messages/public-chat', methods: ['GET'] }
        ]
    }
));

app.use('/messages', messageRouter);
app.use('/users', userRouter);
app.use('/friend-requests', friendRequestRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ChatApp API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
