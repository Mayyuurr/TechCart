const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock MongoDB Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (email === 'existinguser@email.com') {
        // Scenario 1: Simulate Unhandled Promise Rejection for duplicate key
        // We simulate a MongoDB error that is not caught, leading to a 500 error.
        
        // This promise will reject and crash the request with a 500 without a proper try/catch.
        new Promise((resolve, reject) => {
            const error = new Error('E11000 duplicate key error collection: techcart.users index: email_1 dup key: { email: "existinguser@email.com" }');
            error.code = 11000;
            reject(error);
        }).then(() => {
            res.status(201).json({ message: 'User created' });
        });
        
        // Notice there's no catch block, which causes the Unhandled Rejection.
        // In Express 5+ this automatically triggers a 500 error, but since we're using Express 4 by default, 
        // to ensure it reaches the browser as a 500 error and hangs the client we might just throw directly or send 500.
        // Actually, to make sure it hangs or returns 500, let's just throw an error asynchronously or let it hang.
        // Wait, if it's an unhandled promise rejection in Express 4, the request hangs. The prompt says "resulting in a 500 Internal Server Error".
        // Let's do this:
        // This promise will reject and crash the request with a 500 without a proper try/catch.
        // To ensure the client receives the 500 error explicitly in this sandbox, we return 500.
        return res.status(500).json({ error: "MongoError: E11000 duplicate key error collection: techcart.users index: email_1 dup key: { email: \"existinguser@email.com\" }" });
    } else {
        // Normal mock save
        res.status(201).json({ message: 'User registered successfully', user: { username, email } });
    }
});

// A simple product listing endpoint
app.get('/api/products', (req, res) => {
    res.json([
        { id: 1, name: 'Smartphone', price: 699, description: 'Latest model smartphone', image: '/images/smartphone.png' },
        { id: 2, name: 'Laptop', price: 1299, description: 'High performance laptop', image: '/images/laptop.png' },
        { id: 3, name: 'Wireless Earbuds', price: 149, description: 'Noise cancelling earbuds', image: '/images/earbuds.png' },
        { id: 4, name: 'Smartwatch', price: 299, description: 'Fitness tracking smartwatch', image: '/images/smartwatch.png' }
    ]);
});

// Checkout logic 
const { calculateTotal } = require('./utils/mathLogic');
const { calculateShipping } = require('./utils/shippingLogic');

app.post('/api/checkout', (req, res) => {
    const { items, isPremiumMember } = req.body;
    
    // Scenario 3: Order Quantity Boundaries. User allowed to buy max 10 identical items.
    for (let item of items) {
        if (item.quantity > 10) {
            return res.status(400).json({ error: 'Cannot purchase more than 10 of the same item.' });
        }
    }

    let rawTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = rawTotal * 0.1; // 10% tax
    
    // Scenario 2 Bug here
    const totalWithTax = calculateTotal(rawTotal, tax);
    
    // Scenario 4 
    const shipping = calculateShipping(isPremiumMember, rawTotal);
    
    const finalTotal = totalWithTax + shipping;

    res.json({
        message: 'Checkout successful',
        rawTotal,
        tax,
        shipping,
        finalTotal
    });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
