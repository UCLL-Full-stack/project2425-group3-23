/**
 * @swagger
 * components:
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

const friendRequestRouter = express.Router();

/**
 * @swagger
 * /friend-requests:
 *   get:
 *     summary: Retrieve a list of friend requests.
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
        const friendRequests = await FriendRequestService.getAllFriendRequests();

        const data : FriendRequest[] = friendRequests as unknown as FriendRequest[];
        data.map((friendRequest: FriendRequest) => {
            prepareFriendRequest(friendRequest);
        });

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /friend-requests/{id}:
 *   get:
 *     summary: Retrieve a friend request by ID.
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
        const id = parseInt(req.params.id);
        const friendRequest = await FriendRequestService.getFriendRequestById(id);
        if (!friendRequest) {
            throw new Error(`Friend request ${id} not found`);
        }

        const data : FriendRequest = friendRequest as unknown as FriendRequest;
        prepareFriendRequest(data);

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
 *     description: Send a friend request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderUsername:
 *                 type: string
 *                 description: The username of the sender.
 *                 example: JohnDoe
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
        const senderUsername = req.body.senderUsername;
        const receiverUsername = req.body.receiverUsername;
        await FriendRequestService.sendFriendRequest(senderUsername, receiverUsername);

        res.status(201).send('Friend request sent.');
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /friend-requests/{id}/accept:
 *   put:
 *     summary: Accept a friend request.
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
        const id = parseInt(req.params.id);
        await FriendRequestService.acceptFriendRequest(id);

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
        const id = parseInt(req.params.id);
        await FriendRequestService.declineFriendRequest(id);

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

export { friendRequestRouter };