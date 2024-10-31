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
 */

import express from 'express';

const userRouter = express.Router();

export { userRouter };