const express = require("express");
const controller = require("../controllers/itemController");
const router = express.Router();
const upload = controller.upload;
const offerRoutes = require("./offerRoutes");
const { isLoggedIn, isSeller } = require("../middlewares/auth");
const { validateItemId }= require("../middlewares/validation");
const { body } = require("express-validator");



router.use("/:itemId/offers/", validateItemId, offerRoutes);

router.get("/", controller.items);

router.get("/new", isLoggedIn, controller.new);

router.get("/:itemId", validateItemId, controller.singleItem);

router.post("/new", isLoggedIn, upload.single("image"),  [
    body("title", "Title cannot be empty").isLength({min: 1}).trim().escape(),
    body("details", "Description must be at least 10 characters").isLength({min: 10}).trim().escape(),
    body("price", "Price must be a number more than 0").isNumeric(),
    body("condition", "Condition must be provided").isIn(["new", "like-new", "used", "refurbished", "parts-only"]).trim().escape()
], controller.create);

router.get("/:itemId/edit", validateItemId, isLoggedIn, isSeller, controller.edit);


router.post("/:itemId/edit", validateItemId, isLoggedIn, isSeller, [
    body("title").optional().trim().escape(),
    body("details").optional().trim().escape(),
    body("price").optional().isNumeric().if(num => parseInt(num) > 0),
    body("condition").optional().isIn(["new", "like-new", "used", "refurbished", "parts-only"]).trim().escape()
], upload.single("image"), controller.update);

router.delete("/:itemId", validateItemId, isLoggedIn, isSeller, controller.delete);



module.exports = router;
