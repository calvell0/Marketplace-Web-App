const express = require("express");
const controller = require("../controllers/offerController");
const { validateItemId, validateOfferId } = require("../middlewares/validation");
const { isLoggedIn, isNotSeller, isSeller } = require("../middlewares/auth");
const { body } = require("express-validator");
const router = express.Router({mergeParams: true});

router.get("/", isLoggedIn, isSeller, controller.offers);

router.post("/new", [
    body("amount", "Amount must be a number greater than 0").isNumeric().if(num => num > 0),
], isLoggedIn, isNotSeller, controller.create);

router.post("/:offerId/accept", isLoggedIn, isSeller, validateOfferId, controller.accept);


module.exports = router;