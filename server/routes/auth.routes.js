const express = require("express");
const router = express.Router();

const { registerValidation, loginValidation } = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");

const { register, login, users } = require("../controllers/auth.controller");

router.post("/register", registerValidation, register); 
router.post("/login", loginValidation, login);         
router.get("/users", verifyToken, users);         

module.exports = router;
