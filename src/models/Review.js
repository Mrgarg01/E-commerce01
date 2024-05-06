const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 1
    },
    comment: {
        type: String,
        maxLength: 200,
    }
}, {versionKey: false, timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;