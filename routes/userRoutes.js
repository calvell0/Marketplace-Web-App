const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const upload = userController.upload;
const { validateItemId } = require("../middlewares/validation")
const { isGuest, isLoggedIn } = require("../middlewares/auth");
const { body } = require("express-validator");

router.get("/login", isGuest, userController.getUserLogin);

router.get("/register", isGuest, userController.getUserRegistration);

router.post("/login", [
        body("email", "Must be an email address").isEmail().trim().escape().normalizeEmail(),
        body("password", "Password must be at least 8 characters and at most 64").isLength({ min: 8, max: 64 }),
], isGuest, userController.login);

router.post("/register", [
        body("email", "Must be an email address").isEmail().trim().escape().normalizeEmail(),
        body("password", "Password must be at least 8 characters and at most 64").isLength({ min: 8, max: 64 }),
    ],
    isGuest, userController.new);

router.get("/profile", isLoggedIn, userController.profile);

router.get("/logout", isLoggedIn, userController.logout);

module.exports = router;