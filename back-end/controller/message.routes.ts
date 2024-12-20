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
import messageService from '../service/message.service';
import {MessageCreateInput} from "../types";
import jwtUtils from "../util/jwt";

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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);

        const messages = await messageService.authGetAllPublicChatMessages(authUser);

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/private-chat/{username}:
 *   get:
 *     summary: Get a list of all messages in a private chat.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the other user in the chat.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
messageRouter.get('/private-chat/:username', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);

        const messages = await messageService.authGetAllPrivateChatMessages(authUser, req.params.username);

        res.status(200).json(messages);
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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);

        const message = await messageService.authGetMessageById(authUser, parseInt(req.params.id));

        res.status(200).json(message);
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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);
        const messageInput: MessageCreateInput = req.body;

        const message = messageService.authCreateMessage(authUser, messageInput);

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/private-chat/{username}:
 *   post:
 *     summary: Add a new message to a private chat.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the other user in the chat.
 *         schema:
 *           type: string
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
messageRouter.post('/private-chat/:username', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);
        const messageInput: MessageCreateInput = req.body;

        const message = messageService.authCreatePrivateChatMessage(authUser, req.params.username, messageInput);

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message by ID.
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
 *         description: The message was successfully deleted.
 */
messageRouter.delete('/:id', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);

        await messageService.authDeleteMessageById(authUser, parseInt(req.params.id));

        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export { messageRouter };