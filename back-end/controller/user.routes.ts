/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: JohnDoe
 *         role:
 *           type: string
 *           description: The role of the user.
 *           example: user
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: password
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: The messages sent by the user.
 *         chat:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Chat'
 *           description: The chats the user is a part of.
 */

import express, {Request, Response, NextFunction} from 'express';
import userService from '../service/user.service';
import {User} from "../model/user";

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const users : User[] = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
userRouter.get('/:username', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const username : string = req.params.username;
        const user : User | undefined = await userService.getUserByUsername(username);
        if (!user) {
            res.status(404).json({message: `User ${username} not found`});
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

export { userRouter };