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

// In-Memory Mock User Database
const mockUserDatabase = [
    { username: 'admin', email: 'admin@email.com', password: 'adminpassword123' },
    { username: 'existinguser', email: 'existinguser@email.com', password: 'password123' }
];

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
const productsList = [
    { id: 1, productId: 1, name: 'Smartphone', price: 699, category: 'electronics', inStock: true, description: 'Latest model smartphone', image: '/images/smartphone.png' },
    { id: 9942, productId: 9942, name: 'Laptop', price: 1299, category: 'electronics', inStock: true, description: 'High performance laptop', image: '/images/laptop.png' },
    { id: 3, productId: 3, name: 'Wireless Earbuds', price: 149, category: 'accessories', inStock: true, description: 'Noise cancelling earbuds', image: '/images/earbuds.png' },
    { id: 4, productId: 4, name: 'Smartwatch', price: 299, category: 'accessories', inStock: false, description: 'Fitness tracking smartwatch', image: '/images/smartwatch.png' }
];

app.get('/api/products', (req, res) => {
    const { category } = req.query;
    let filteredProducts = productsList;
    if (category) {
        filteredProducts = productsList.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = productsList.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// SIMULATED BOTTLENECK ENDPOINT FOR PERFORMANCE DEMO
app.get('/api/products/heavy-search', (req, res) => {
    // We use setTimeout to mimic a slow, unoptimized database lookup
    setTimeout(() => {
        // Mock data to return once the "heavy query" finishes
        const mockHeavyResults = [
            { id: 101, name: "Premium Mechanical Keyboard", price: 129.99, category: "Accessories" },
            { id: 102, name: "Ultra-Wide Gaming Monitor", price: 349.99, category: "Electronics" },
            { id: 103, name: "Wireless Ergonomic Mouse", price: 59.99, category: "Accessories" }
        ];

        res.status(200).json({
            status: "Success",
            results: mockHeavyResults.length,
            data: mockHeavyResults
        });
    }, 1500); // 1.5-second artificial delay
});


// User Registration API
app.post('/api/users', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    res.status(201).json({
        message: 'User created successfully',
        user: {
            id: 'mock-user-id',
            email
        }
    });
});

// Update User API
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { password, email } = req.body;
    res.status(200).json({
        message: 'User updated successfully',
        user: {
            id,
            email,
            password
        }
    });
});

// 1. INTENTIONALLY VULNERABLE LOGIN ROUTE (For Security Demo)
app.post('/api/users/login-vulnerable', (req, res) => {
    const { email, password } = req.body;

    // Simulate MongoDB's object operator processing in your mock database.
    // If the attacker sends {"$gt": ""}, it evaluates to "always true".
    const user = mockUserDatabase.find(u => {
        const emailMatch = (typeof email === 'object' && email['$gt'] !== undefined) 
            ? u.email > email['$gt'] 
            : u.email === email;

        const passwordMatch = (typeof password === 'object' && password['$gt'] !== undefined) 
            ? u.password > password['$gt'] 
            : u.password === password;

        return emailMatch && passwordMatch;
    });

    if (user) {
        return res.status(200).json({
            success: true,
            message: "Exploit Successful! Bypassed Auth.",
            token: "mock-jwt-admin-token"
        });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// 2. SECURED LOGIN ROUTE (The Fix)
app.post('/api/users/login-secure', (req, res) => {
    const { email, password } = req.body;

    // DEFENSIVE REMEDIATION: Strict type verification
    // Force inputs to be strings. If they are objects, reject them immediately.
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            success: false,
            message: "Security Alert: Invalid input type detected! Rejected."
        });
    }

    const user = mockUserDatabase.find(u => u.email === email && u.password === password);

    if (user) {
        return res.status(200).json({ success: true, message: "Logged in securely!" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Shopping Cart API
app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        message: `Item with id ${id} removed from cart`
    });
});

// Checkout logic 
const { calculateTotal } = require('./utils/mathLogic');
const { calculateShipping } = require('./utils/shippingLogic');
const { applyPromoCode } = require('./utils/promo');

app.post('/api/checkout', (req, res) => {
    const { items, isPremiumMember, promoCode } = req.body;
    
    // Scenario 3: Order Quantity Boundaries. User allowed to buy max 10 identical items.
    for (let item of items) {
        if (item.quantity > 10) {
            return res.status(400).json({ error: 'Cannot purchase more than 10 of the same item.' });
        }
    }

    let rawTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let discountedTotal = rawTotal;
    let discount = 0;
    if (promoCode) {
        try {
            discountedTotal = applyPromoCode(rawTotal, promoCode);
            discount = rawTotal - discountedTotal;
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    const tax = discountedTotal * 0.1; // 10% tax
    
    // Scenario 2 Bug here
    const totalWithTax = calculateTotal(discountedTotal, tax);
    
    // Scenario 4 
    const shipping = calculateShipping(isPremiumMember, discountedTotal);
    
    const finalTotal = totalWithTax + shipping;

    res.json({
        message: 'Checkout successful',
        rawTotal,
        discount,
        tax,
        shipping,
        finalTotal
    });
});

const path = require('path');
// Serve static files from the compiled frontend directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Fallback to index.html for any frontend SPA routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
