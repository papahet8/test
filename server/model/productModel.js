const mongoose = require('mongoose');
const Product = new mongoose.Schema({
    product_id: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: String,
        trim: true,
        required: true
    },
    taluka: {
        type: String,
        trim: true,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    place: {
        type: String,
        trim: true,
        required: true
    },
    jhilla: {
        type: String,
        trim: true,
        required: true
    },
    qnty: {
        type: Number,
        required: true
    },
    product_name: {
        type: String,
        trim: true,
        required: true
    },
    contact_no: {
        type: String,
        trim: true,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    }
},{
    collection: "products",
    timestamps: true,
});

module.exports = mongoose.model("Product", Product);