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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);

        const friendRequests = await FriendRequestService.authGetFriendRequests(authUser);

        res.status(200).json(friendRequests);
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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);
        const id = parseInt(req.params.id);

        const friendRequest = await FriendRequestService.authGetFriendRequestById(authUser, id);

        res.status(200).json(friendRequest);
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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);
        const { receiverUsername } = req.body;

        await FriendRequestService.authSendFriendRequest(authUser, receiverUsername);

        res.sendStatus(201);
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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);
        const id = parseInt(req.params.id);

        await FriendRequestService.authAcceptFriendRequest(authUser, id);

        res.sendStatus(200);
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
        const authUser = jwtUtils.getUsernameAndRoleFromRequest(req);
        const id = parseInt(req.params.id);

        await FriendRequestService.authDeclineFriendRequest(authUser, id);

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

export { friendRequestRouter };