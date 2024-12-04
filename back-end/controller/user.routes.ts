/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       description: A user of the chat application.
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: JohnDoe
 *         role:
 *           type: string
 *           description: The role of the user.
 *           example: user
 *         chats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Chat'
 *           description: The chats the user is a part of.
 *         friends:
 *           type: array
 *           description: The user's friends.
 *           items:
 *             $ref: '#/components/schemas/Friend'
 *     Friend:
 *       type: object
 *       description: A friend of the user.
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the friend.
 *           example: JaneDoe
 *     AuthenticationResponse:
 *       type: object
 *       description: The response to an authentication request.
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token.
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: JohnDoe
 *         role:
 *           type: string
 *           description: The role of the user.
 *           example: user
 *     AuthenticationInput:
 *       type: object
 *       description: The input for a login request.
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: JohnDoe
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: Password01
 */

import express, {Request, Response, NextFunction} from 'express';
import userService from '../service/user.service';
import {User, FriendRequest} from '../types';
import {prepareFriend, prepareFriendRequest, prepareUser} from '../util/dtoConverters';
import accountService from "../service/account.service";

const userRouter = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationInput'
 *     responses:
 *       200:
 *         description: The user was authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 */
userRouter.post('/login', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { username, password } = req.body;
        const authenticationResponse = await accountService.authenticate({username, password});
        res.status(200).json(authenticationResponse);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationInput'
 *     responses:
 *       201:
 *         description: The user was registered successfully
 */
userRouter.post('/register', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { username, password } = req.body;

        await accountService.register({username, password});
        res.status(201).end();
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     security:
 *       - bearerAuth: []
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
        const users = await userService.getAllUsers();

        const data : User[] = users as unknown as User[];
        data.map((user: User) => {
            prepareUser(user);
        });

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get a user by username
 *     security:
 *       - bearerAuth: []
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
        const user = await userService.getUserByUsername(username);
        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        const data : User = user as unknown as User;
        prepareUser(data);

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}/friends:
 *   get:
 *     summary: Get a user's friends
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the user to retrieve friends for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user's friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Friend'
 *       404:
 *         description: The user was not found
 */
userRouter.get('/:username/friends', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const username : string = req.params.username;
        const user = await userService.getUserByUsername(username);

        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        const friends = await userService.getFriends(username);

        const data = friends as unknown as User[];
        data.map((user: User) => {
            prepareFriend(user);
        });

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}/friends/{friendUsername}:
 *   delete:
 *     summary: Remove a friend from a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the user to remove a friend from.
 *         schema:
 *           type: string
 *       - in: path
 *         name: friendUsername
 *         required: true
 *         description: The username of the friend to remove.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The friend was removed successfully
 *       404:
 *         description: The user or friend was not found
 */
userRouter.delete('/:username/friends/:friendUsername', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const username: string = req.params.username;
        const friendUsername: string = req.params.friendUsername;
        await userService.removeFriend({username, friendUsername});
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}/friendRequests:
 *   get:
 *     summary: Get a user's friend requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the user to retrieve friend requests for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user's friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequest'
 *       404:
 *         description: The user was not found
 */
userRouter.get('/:username/friend-requests', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const username : string = req.params.username;
        const friendRequests = await userService.getFriendRequests({username});

        if (!friendRequests) {
            throw new Error(`User ${username} not found`);
        }

        const data = friendRequests as unknown as FriendRequest[];
        data.map((friendRequest: FriendRequest) => {
            prepareFriendRequest(friendRequest);
        });

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

export { userRouter };