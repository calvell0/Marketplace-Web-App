const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const itemSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    title: {
        type: String,
        maxLength: [50, "Title must be at most 50 characters long"],
        required: [true, "Title is a required field"]
    },
    details:
        {
            type: String,
            minLength: [5, "Details must be at least 5 characters long"],
            maxLength: [2000, "Details must be at most 2000 characters long"],
            required: [true, "Details is a required field"]
        },
    image: { type: String, required: [true, "Image is a required field"] },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Seller is a required field"]
    },
    condition:
        {
            type: String,
            enum: ["new", "like-new", "used", "refurbished", "parts-only"],
        required: [true, "Condition is a required field"]
        },
    price:
        {
            type: Number,
            min: [0.01, "Price must be a positive number"],
            required: [true, "Price is a required field"]
        },
    totalOffers: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    highestOffer: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);


