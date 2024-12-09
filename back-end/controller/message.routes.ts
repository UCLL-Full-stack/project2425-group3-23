/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Message:
 *       type: object
 *       description: A message in a chat sent by a user.
 *       properties:
 *         id:
 *           type: number
 *           description: The message ID.
 *           format: int64
 *         content:
 *           type: string
 *           description: The message content.
 *           example: Hello, world!
 *         deleted:
 *           type: boolean
 *           description: Whether the message is deleted.
 *           example: false
 *         sender:
 *           type: object
 *           description: The user who sent the message.
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the sender.
 *               example: JohnDoe
 *         chat:
 *           type: object
 *           $ref: '#/components/schemas/Chat'
 *           description: The chat the message is part of.
 */

import express, {Request, Response, NextFunction} from 'express';
import {Message} from '../types';
import {prepareMessage} from '../util/dtoConverters';
import messageService from '../service/message.service';
import {MessageCreateInput} from "../types";
import jwtUtils from "../util/jwt";
import userService from "../service/user.service";
import {UnauthorizedError} from "express-jwt";

const messageRouter = express.Router();

/**
 * @swagger
 * /messages/public-chat:
 *   get:
 *     summary: Get a list of all messages.
 *     responses:
 *       200:
 *         description: A list of messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Message'
 */
messageRouter.get('/public-chat', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const messages = await messageService.getAllPublicChatMessages();

        const data : Message[] = messages as unknown as Message[];
        data.map((message: Message) => {
            prepareMessage(message);
        });

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get a message by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The message ID.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
messageRouter.get('/:id', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { username: authUsername, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role === 'admin') {
            const id: number = parseInt(req.params.id);
            const message = await messageService.getMessageById(id);
            if (!message) {
                throw new Error('Message not found.');
            }

            const data: Message = message as unknown as Message;
            prepareMessage(data);

            res.status(200).json(data);
        } else if (role === 'user') {
            const authUser = await userService.getUserByUsername(authUsername);
            if (!authUser) {
                throw new Error('User not found.');
            }

            const id: number = parseInt(req.params.id);
            const message = await messageService.getMessageById(id);
            if (!message) {
                throw new Error('Message not found.');
            }

            if (!authUser.getChats().map(chat => chat.getId()).includes(message.getChat()?.getId())) {
                throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
            }

            const data: Message = message as unknown as Message;
            prepareMessage(data);

            res.status(200).json(data);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/public-chat:
 *   post:
 *     summary: Add a new message.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The message content.
 *                 example: Hello, world!
 *               sender:
 *                 type: object
 *                 description: The user who sent the message.
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: The username of the sender.
 *                     example: JohnDoe
 *     responses:
 *       200:
 *         description: The message was successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
messageRouter.post('/public-chat', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { username : authUsername, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role === 'admin' || role === 'user') {
            let messageInput: MessageCreateInput = req.body;
            messageInput.sender = { username: authUsername }
            const message = await messageService.createMessage(messageInput);

            const data: Message = message as unknown as Message;
            prepareMessage(data);

            res.status(200).json(data);
        } else {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }
    } catch (error) {
        next(error);
    }
});

export { messageRouter };