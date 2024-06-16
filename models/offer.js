const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
        _id: { type: Schema.Types.ObjectId },
        item: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: [ true, "Item is a required field" ]
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [ true, "Buyer is a required field" ]
        },
        amount: {
            type: Number,
            min: [ 0.01, "Price must be a positive number" ],
            required: [ true, "Price is a required field" ]
        },
        status: {
            type: String,
            enum: [ "pending", "accepted", "rejected" ],
            default: "pending"
        }
    }, { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
