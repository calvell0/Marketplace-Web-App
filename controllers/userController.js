const User = require("../models/user");
const mongoose = require("mongoose");
const Item = require("../models/item");
const Offer = require("../models/offer");
const { validationResult } = require("express-validator");


exports.getUserLogin = (req, res, next) => {
    res.render("login");
};

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });
        return res.redirect("/users/login");
    }

    const { email, password } = req.body;


    if (!email || !password) {
        req.flash("error", "Please enter all fields");
        return res.redirect("/users/login");
    }

    User.findOne({ email: { $regex: email, $options: "i"} }, "firstName lastName _id email password")
        .then(user =>  {
            if (!user) {
                req.flash("error", "Invalid credentials");
                return res.redirect("/users/login");
            }
            user.comparePasswords(password).then(result => {
                if (!result) {
                    req.flash("error", "Invalid credentials");
                    return res.redirect("/users/login");
                }
                delete user.password;
                req.session.user = user;
                req.flash("success", "Login successful");
                res.redirect("/users/profile");
            });


        }).catch(err => next(err));


}



exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/");

}

exports.getUserRegistration = (req, res, next) => {
    res.render("register");
}

exports.new = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });
        return res.redirect("back");
    }

    const user = new User(req.body);
    if (user.email) user.email = user.email.toLowerCase();

    user._id = new mongoose.Types.ObjectId();
    user.save()
        .then(() => {
            req.flash("success", "Registration successful");
            res.redirect("/users/login");
        })
        .catch(err => {
            console.log(err);
            req.flash("error", "Registration failed");
            res.redirect("/users/register");
        });
}

exports.profile = (req, res, next) => {
    const { _id } = req.session.user;

    Promise.all([User.findById(_id), Item.find({ seller: _id }), Offer.find({ buyer: _id }).populate("item")])
        .then(([user, items, offers]) => {
            res.render("profile", { user, items, offers });
        }).catch(err => next(err));
}
