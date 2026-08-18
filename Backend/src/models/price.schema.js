import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: [ "USD", "EUR", "INR", "JPY", "PKR" ],
        default: "USD"
    }
}, {
    _id: false,
    _v: false
});

export default priceSchema;