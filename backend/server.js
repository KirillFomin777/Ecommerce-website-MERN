const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number
});

const Product = mongoose.model('Product', ProductSchema);

// Create a new product
app.post('/products', async (req, res) => {
    const { name, description, price, stock } = req.body;
    const product = new Product({ name, description, price, stock });
    await product.save();
    res.json({ message: "Product created successfully" });
});

// Get all products
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Payment Integration (Stripe)
const stripe = require('stripe')('your_stripe_api_key');
app.post('/checkout', async (req, res) => {
    const { token, amount } = req.body;
    try {
        const charge = await stripe.charges.create({
            amount,
            currency: 'usd',
            description: 'E-commerce Payment',
            source: token.id
        });
        res.json({ message: 'Payment successful', charge });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
