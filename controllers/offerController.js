const Offer = require("../models/offer");
const Item = require("../models/item");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");


exports.offers = (req, res, next) => {
    const itemId = req.params.itemId;
    Offer.find({item: itemId}).populate("buyer").populate("item")
        .then(offers => {
            if (!offers){
                let err = new Error("No offers found for this item");
                err.status = 404;
                return next(err);
            }
            const item = (offers.length) ? offers[0].item : offers.item;
            res.render("offers/offers", { offers, item });
        })
        .catch(err => {
            return next(err);
        });

}

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });
        return res.redirect("back");
    }

    const itemId = new mongoose.Types.ObjectId(req.params.itemId);
    const offer = new Offer(req.body);
    offer._id = new mongoose.Types.ObjectId;
    offer.item = itemId;
    offer.buyer = req.session.user._id;

    Promise.all([
        Item.findOneAndUpdate(itemId, { $inc: { totalOffers: 1 }, $max: { highestOffer: offer.amount } }),
        offer.save()
    ]).then(([ item, offer ]) => {
        req.flash("success", "Offer created");
        return res.redirect(`/items/${itemId}`);
    }).catch(err => {
        return next(err);
    });
}

exports.accept = (req, res, next) => {
    console.log(req.params);
    const itemId = new mongoose.Types.ObjectId(req.params.itemId);
    const offerId = new mongoose.Types.ObjectId(req.params.offerId);


    Promise.all([
        Item.findByIdAndUpdate(itemId, { active: false }),
        Offer.findByIdAndUpdate(offerId, { status: "accepted" }),
        Offer.updateMany({ item: itemId, _id: { $ne: offerId }}, { status: "rejected" })
    ]).then(() => {
        req.flash("success", "Offer accepted");
        return res.redirect(`/items/${itemId}/offers`);
    })
        .catch(err => {
            return next(err);
        });
}
