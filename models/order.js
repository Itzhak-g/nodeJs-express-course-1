const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({      // *** order schema *** //
    products: [
        {
            product: {type: Object, required: true},   //
            quantity: {type: Number, required: true}
        }
    ],
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

// exporting a module based on 'order schema' model:
module.exports = mongoose.model('Order', orderSchema);