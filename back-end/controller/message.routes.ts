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
 */

import express from 'express';
import {Message} from "../model/message";
import messageService from '../service/message.service';

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
messageRouter.get('/', (req, res) => {
    const messages : Message[] = messageService.getAllMessages();
    res.status(200).json(messages);
});

export { messageRouter };