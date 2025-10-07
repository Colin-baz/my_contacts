const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const { contactValidation } = require("../middlewares/validate.middleware");
const { getContacts, createContactController, updateContactController, deleteContactController } = require("../controllers/contact.controller");

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: CRUD routes for contacts
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts for the user logged in
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All contacts
 *       401:
 *         description: Unauthorized
 */
router.get("/contacts", verifyToken, getContacts);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Doe
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               phone:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/contacts", verifyToken, contactValidation, createContactController);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.put("/contacts/:id", verifyToken, contactValidation, updateContactController);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.delete("/contacts/:id", verifyToken, deleteContactController);

module.exports = router;