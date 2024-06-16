const validator = require("express-validator");


exports.validateItemId = (req, res, next) => {
    const id = req.params?.itemId;

    if (!id || !idIsValid(id)){
       let err = new Error("Invalid id");
       err.status = 400;
       return next(err);
    }
    return next();
}

exports.validateOfferId = (req, res, next) => {
    const id = req.params?.offerId;

    if (!id || !idIsValid(id)){
       let err = new Error("Invalid id");
       err.status = 400;
       return next(err);
    } else return next();

}

exports.validateCondition = (req, res, next) => {
    const condition = req.body?.condition;

    if (!condition || !validator.isIn(condition, ["new", "like-new", "used", "refurbished", "parts-only"])){
       let err = new Error("Invalid condition");
       err.status = 400;
       return next(err);
    }
    return next();

}

const idIsValid = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
}