/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The chat ID.
 *           format: int64
 *         type:
 *           type: string
 *           description: The type of the chat.
 *           example: public
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: The messages in the chat.
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: The users in the chat.
 */