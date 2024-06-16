const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { hash } = require("bcrypt");

const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    email: {
        type: String, required: [true, "Email is a required field"],
        maxLength: [50, "Email must be at most 50 characters long"],
        unique: [true, "This email is taken"]
    },
    firstName: {
        type: String, required: [true, "First name is a required field"],
        maxLength: [50, "First name must be at most 50 characters long"],
    },
    lastName: {
        type: String, required: [true, "Last name is a required field"],
        maxLength: [50, "Last name must be at most 50 characters long"],
    },
    password: { type: String, required: [true, "Password is a required field"] }
}, {
    methods: {
        comparePasswords(password) {
            return bcrypt.compare(password, this.password);
        }
    }
});

userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
});

userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});



module.exports = mongoose.model("User", userSchema);

