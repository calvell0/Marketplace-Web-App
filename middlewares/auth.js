const User = require('../models/user');
const Item = require('../models/item');
const flash = require('connect-flash');

exports.isGuest = (req, res, next) => {
    if (req.session.user) {
        req.flash("error", "You are already logged in");
        return res.redirect("/users/profile");
    }
    return next();
}

exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.flash("error", "You are not logged in");
        return res.redirect("/users/login");
    }
    return next();
}

exports.isSeller = (req, res, next) => {
    const id = req.params.itemId;

    Item.findById(id, "seller").then(item => {
        if (!item) {
            const error = new Error("Item not found");
            error.status = 400;
            return next(error);
        }
        if (item.seller.toString() !== req.session.user._id.toString()) {
            const error = new Error("You are not authorized to perform this action");
            error.status = 401;
            return next(error);
        }
        next();
    }).catch(err => {
        next(err);
    });
}

exports.isNotSeller = (req, res, next) => {
    const id = req.params.itemId;

    Item.findById(id, "seller").then(item => {
        if (!item) {
            const error = new Error("Item not found");
            error.status = 400;
            return next(error);
        }
        if (item.seller.toString() === req.session.user._id.toString()) {
            const error = new Error("You cannot make an offer on your own item");
            error.status = 401;
            return next(error);
        }
        next();
    }).catch(err => {
        next(err);
    });
}