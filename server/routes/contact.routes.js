const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const { getContacts, createContactController, updateContactController, deleteContactController } = require("../controllers/contact.controller");

router.get("/contacts", verifyToken, getContacts);
router.post("/contacts", verifyToken, createContactController);
router.put("/contacts/:id", verifyToken, updateContactController);
router.delete("/contacts/:id", verifyToken, deleteContactController);

module.exports = router;