const express = require("express");
const Item = require("../models/item");
const User = require("../models/user");
const Offer = require("../models/offer");
const mongoose = require("mongoose");
const multer = require("multer");
const { validationResult } = require("express-validator");


const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./resources/images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "-" + Date.now());
    }
});
exports.upload = multer({ storage: storage });


const isValidId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
}


exports.items = (req, res, next) => {
    let filter = {};
    if (req.query.search) filter = {
        $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            { details: { $regex: req.query.search, $options: "i" } }
        ]
    }

    Item.find(filter).then(items => {
        res.render("items", { items: items });
    })
        .catch(err => {
            error(res, err, 500);
        });
}

exports.new = (req, res, next) => {
    res.render("new");
}

exports.singleItem = (req, res, next) => {

    const id = new mongoose.Types.ObjectId(req.params.itemId);

    Item.findOne({ _id: id }).then(item => {
        if (!item) {
            error(res, "Item not found", 404);
            return;
        }
        console.info(item);
        User.findOne({ _id: item.seller }, "firstName lastName _id").then(seller => {
            res.render("item", { item: item, seller: seller, user: res.locals.user });
        }).catch(err => next(err));
    })
        .catch(err => {
            error(res, err, 500);
        });
}

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });
        console.log(req.body);
        return res.redirect("back");
    }

    const item = new Item(req.body);
    console.info(req.body);
    if (req.file) {
        item.image = "\\" + req.file.path;
    } else {
        item.image = "/resources/images/default.jpg";
    }
    item.seller = new mongoose.Types.ObjectId(req.session.user._id);
    item._id = new mongoose.Types.ObjectId();
    item.save()
        .then(() => {
            req.flash("success", "Item listed successfully");
            res.redirect("/items");
        })
        .catch(err => {
            req.flash("error", "Error creating item");
            res.redirect("back");
            return next(err);
        });


}

exports.edit = (req, res, next) => {


    if (!isValidId(req.params.itemId)) {
        error(res, "Invalid ID", 400);
        return;
    }
    const id = new mongoose.Types.ObjectId(req.params.itemId);

    Item.findOne({ _id: id }).then(item => {
        if (!item) {
            console.log("Item not found");
            error(res, "Item not found", 404);
            return;
        }
        console.info(item);

        res.render("edit", { item: item });
    })
        .catch(err => {
            error(res, err, 500);
        });

}

exports.update = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });
        return res.redirect("back");
    }

    const id = new mongoose.Types.ObjectId(req.params.itemId);
    const item = req.body;

    if (req.file && req.file.path){
        item.image = "\\" + req.file.path;
    } else {
        delete item.image;
    }

    Item.findOneAndUpdate(id, item).then(() => {
        res.redirect(`/items/${ id }`);
    })
        .catch(err => {
            req.flash("error", "Error updating item");
        });
}


exports.delete = (req, res, next) => {
    const id = new mongoose.Types.ObjectId(req.params.itemId);

    Promise.all([
        Item.findByIdAndDelete(id),
        Offer.deleteMany({ item: id })
    ])
        .then(() => {
            req.flash("success", "Item deleted");
            res.redirect("/items");
        }).catch(err => next(err));

}

const error = (res, err, status) => {
    res.status(status).render("error", { error: err })
}