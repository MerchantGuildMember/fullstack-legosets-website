const mongoose = require(`mongoose`)

let productsSchema = new mongoose.Schema(
    {
        image: {type: String, required: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        description: {type: String, required: false},
        stock: {type: Number, required: true},
        brand: {type: String, required: true},
        ratingCount: {type: Number, required: false},
    },
    {
        collection: `products`
    }
)

module.exports = mongoose.model('products', productsSchema)