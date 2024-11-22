/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
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
 *           $ref: '#/components/schemas/User'
 *           description: The user who sent the message.
 *         chat:
 *           type: object
 *           $ref: '#/components/schemas/Chat'
 *           description: The chat the message is part of.
 */

import express, {Request, Response, NextFunction} from 'express';
import {Message} from "../model/message";
import messageService from '../service/message.service';
import {MessageCreateInput} from "../types";

const messageRouter = express.Router();

/**
 * @swagger
 * /messages:
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
messageRouter.get('/', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const messages: Message[] = await messageService.getAllMessages();
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
        const id: number = parseInt(req.params.id);
        const message: Message | undefined = await messageService.getMessageById(id);
        if (!message) {
            res.status(404).json({message: 'Message not found.'});
        }

        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Add a new message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: The message was successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
messageRouter.post('/', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const messageInput : MessageCreateInput = req.body;
        const message : Message = await messageService.createMessage(messageInput);
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
});

export { messageRouter };