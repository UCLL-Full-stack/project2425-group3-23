/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     FriendRequest:
 *       type: object
 *       description: A friend request.
 *       properties:
 *         id:
 *           type: number
 *           description: The ID of the friend request.
 *           example: 0
 *         status:
 *           type: string
 *           description: The status of the friend request.
 *           example: pending
 *         sender:
 *           type: object
 *           description: The user who sent the friend request.
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the sender.
 *               example: JohnDoe
 *         receiver:
 *           type: object
 *           description: The user who received the friend request.
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the receiver.
 *               example: JaneDoe
 */

import express, { Request, Response, NextFunction } from 'express';
import FriendRequestService from "../service/friendRequest.service";
import {FriendRequest} from "../types";
import {prepareFriendRequest} from "../util/dtoConverters";
import jwtUtils from "../util/jwt";
import {UnauthorizedError} from "express-jwt";

const friendRequestRouter = express.Router();

/**
 * @swagger
 * /friend-requests:
 *   get:
 *     summary: Retrieve a list of friend requests.
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of friend requests.
 *     responses:
 *       200:
 *         description: A list of friend requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequest'
 */
friendRequestRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role == 'admin') {
            // Admins can see all friend requests
            const friendRequests = await FriendRequestService.getAllFriendRequests();

            const data: FriendRequest[] = friendRequests as unknown as FriendRequest[];
            data.map((friendRequest: FriendRequest) => {
                prepareFriendRequest(friendRequest);
            });

            res.status(200).json(data);
        } else if (role == 'user') {
            // User can see only their friend requests
            const friendRequests = await FriendRequestService.getAllFriendRequests();
            const userFriendRequests = friendRequests.filter((friendRequest) => {
                return friendRequest.getSender()?.getUsername() === username || friendRequest.getReceiver()?.getUsername() === username;
            });

            const data: FriendRequest[] = userFriendRequests as unknown as FriendRequest[];
            data.map((friendRequest: FriendRequest) => {
                prepareFriendRequest(friendRequest);
            });

            res.status(200).json(data);
        } else {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /friend-requests/{id}:
 *   get:
 *     summary: Retrieve a friend request by ID.
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a friend request by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the friend request to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A friend request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendRequest'
 *       404:
 *         description: Friend request not found.
 */
friendRequestRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username: authUsername, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role == 'admin') {
            // Admins can see all friend requests
            const id = parseInt(req.params.id);
            const friendRequest = await FriendRequestService.getFriendRequestById(id);
            if (!friendRequest) {
                throw new Error(`Friend request ${id} not found`);
            }

            const data: FriendRequest = friendRequest as unknown as FriendRequest;
            prepareFriendRequest(data);

            res.status(200).json(friendRequest);
        } else if (role == 'user') {
            // User can see only their friend requests
            const id = parseInt(req.params.id);
            const friendRequest = await FriendRequestService.getFriendRequestById(id);
            if (!friendRequest) {
                throw new Error(`Friend request ${id} not found`);
            }
            if (!(friendRequest.getSender()?.getUsername() === authUsername || friendRequest.getReceiver()?.getUsername() === authUsername)) {
                throw new UnauthorizedError('credentials_bad_scheme', {message: 'You did not send or receive this friend request.'});
            }

            const data: FriendRequest = friendRequest as unknown as FriendRequest;
            prepareFriendRequest(data);

            res.status(200).json(friendRequest);
        } else {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /friend-requests:
 *   post:
 *     summary: Send a friend request.
 *     security:
 *       - bearerAuth: []
 *     description: Send a friend request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverUsername:
 *                 type: string
 *                 description: The username of the receiver.
 *                 example: JaneDoe
 *     responses:
 *       201:
 *         description: Friend request sent.
 *       400:
 *         description: Bad request.
 */
friendRequestRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username: authUsername, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role == 'admin' || role == 'user') {
            // Users and admins can send friend requests
            const senderUsername = authUsername;
            const receiverUsername = req.body.receiverUsername;

            await FriendRequestService.sendFriendRequest(senderUsername, receiverUsername);

            res.sendStatus(201);
        } else {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /friend-requests/{id}/accept:
 *   put:
 *     summary: Accept a friend request.
 *     security:
 *       - bearerAuth: []
 *     description: Accept a friend request.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the friend request to accept.
 *     responses:
 *       200:
 *         description: Friend request accepted.
 *       404:
 *         description: Friend request not found.
 */
friendRequestRouter.put('/:id/accept', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username: authUsername, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role == 'admin' || role == 'user') {
            // Users and admins can accept received friend requests
            const id = parseInt(req.params.id);

            const friendRequest = await FriendRequestService.getFriendRequestById(id);
            if (!friendRequest) {
                throw new Error(`Friend request ${id} not found`);
            }
            if (friendRequest.getReceiver()?.getUsername() !== authUsername) {
                throw new UnauthorizedError('credentials_bad_scheme', { message: 'You did not receive this friend request.' });
            }

            await FriendRequestService.acceptFriendRequest(id);

            res.sendStatus(200);
        } else {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /friend-requests/{id}/decline:
 *   put:
 *     summary: Decline a friend request.
 *     security:
 *       - bearerAuth: []
 *     description: Decline a friend request.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the friend request to reject.
 *     responses:
 *       200:
 *         description: Friend request declined.
 *       404:
 *         description: Friend request not found.
 */
friendRequestRouter.put('/:id/decline', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Users and admins can decline received friend requests
        const { username: authUsername, role } = jwtUtils.getUsernameAndRoleFromRequest(req);
        if (role == 'admin' || role == 'user') {
            const id = parseInt(req.params.id);

            const friendRequest = await FriendRequestService.getFriendRequestById(id);
            if (!friendRequest) {
                throw new Error(`Friend request ${id} not found`);
            }

            if (friendRequest.getReceiver()?.getUsername() !== authUsername) {
                throw new UnauthorizedError('credentials_bad_scheme', { message: 'You did not receive this friend request.' });
            }

            await FriendRequestService.declineFriendRequest(id);

            res.sendStatus(200);
        } else {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }
    } catch (error) {
        next(error);
    }
});

export { friendRequestRouter };