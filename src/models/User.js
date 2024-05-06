const { Schema, model, default: mongoose } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const cartSchema = new Schema({
    _id: false,
    name: String,
    price: Number,
    productId: mongoose.Schema.Types.ObjectId,
    qty: {
        type: Number,
        default: 1
    },
    imageUrl: String
});

const userSchema = new Schema({
    // username, hash and salt are injected by passport local mongoose.
    email: {
        type: String
    },
    role: {
        type: String,
        enum: ['seller','buyer', 'admin']
    },
    cart: [cartSchema]
},{versionKey: false, timestamps: true});

userSchema.plugin(passportLocalMongoose);

const User = model('User', userSchema);

module.exports = User;

