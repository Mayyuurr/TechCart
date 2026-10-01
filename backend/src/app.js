const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { calculateTotal } = require('./utils/mathLogic');
const { calculateShipping } = require('./utils/shippingLogic');
const { applyPromoCode } = require('./utils/promo');
const { calculateTax } = require('./utils/taxCalculator');
const { calculateSimilarity } = require('./utils/similarity');
const { validateCartQuantity } = require('./utils/validators');
const { calculateWeightZoneShipping } = require('./services/shippingCalculator');
const { calculateCheckoutShipping } = require('./controllers/checkoutController');
const { evaluatePromotionRules } = require('./services/promotionEngine');
const { transitionOrderState } = require('./services/orderStateMachine');
const { validateTextInputLength, validateUnitPrice, sanitizeInputString } = require('./utils/securityGuards');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mock / Real MongoDB Schemas
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true, required: true },
    password: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' }
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// In-Memory Mock User Database
const mockUserDatabase = [
    { username: 'admin', email: 'admin@email.com', password: 'adminpassword123' },
    { username: 'existinguser', email: 'existinguser@email.com', password: 'password123' }
];

// Product listing data
const productsList = [
    { id: 1, productId: 1, name: 'Smartphone', price: 100, category: 'electronics', inStock: true, description: 'Latest model smartphone', image: '/images/smartphone.png' },
    { id: 9942, productId: 9942, name: 'Laptop', price: 1299, category: 'electronics', inStock: true, description: 'High performance laptop', image: '/images/laptop.png' },
    { id: 3, productId: 3, name: 'Wireless Earbuds', price: 149, category: 'accessories', inStock: true, description: 'Noise cancelling earbuds', image: '/images/earbuds.png' },
    { id: 4, productId: 4, name: 'Smartwatch', price: 299, category: 'accessories', inStock: false, description: 'Fitness tracking smartwatch', image: '/images/smartwatch.png' }
];

// --- MODULE 2, CHAPTER 1: Functional Search API ---
app.get(['/api/v1/products/search', '/api/products/search'], (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    
    if (query === 'laptop') {
        return res.status(200).json({
            status: "success",
            count: 2,
            data: [
                { id: "p101", name: "Pro Laptop 15", price: 1200 },
                { id: "p102", name: "Ultrabook 13", price: 950 }
            ]
        });
    }

    const matches = productsList.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query))
    );

    res.status(200).json({
        status: "success",
        count: matches.length,
        data: matches
    });
});

// --- MODULE 2, CHAPTER 1: Grey-Box User Registration & Error Logging ---
app.post(['/api/v1/users/register', '/api/register'], async (req, res) => {
    const { username, email, password } = req.body;

    if (email === 'existinguser@email.com') {
        const errorMsg = 'MongoServerError: E11000 duplicate key error collection: techcart.users index: email_1 dup key: { email: "existinguser@email.com" }';
        console.error(`\x1b[31m[DATABASE ERROR]\x1b[0m ${errorMsg}`);
        console.error(`Stack trace:\n    at Connection.handleOp (node_modules/mongodb/lib/cmap/connection.js:480:12)`);
        
        return res.status(500).json({ 
            status: "error",
            error: errorMsg,
            message: "Internal Server Error: E11000 duplicate key error"
        });
    } else {
        res.status(201).json({ 
            status: "success",
            message: 'User registered successfully', 
            user: { username, email } 
        });
    }
});

// --- MODULE 2, CHAPTER 2: Product Creation Integration Endpoint ---
app.post(['/api/v1/products', '/api/products'], async (req, res) => {
    const { name, price, category } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ status: 'fail', error: 'Name and price are required' });
    }

    const priceValidation = validateUnitPrice(price);
    if (!priceValidation.isValid) {
        return res.status(400).json({ status: 'fail', error: priceValidation.error });
    }
    
    let createdProduct;
    if (mongoose.connection.readyState === 1) {
        try {
            createdProduct = await Product.create({ name, price, category: category || 'General' });
        } catch (err) {
            createdProduct = {
                _id: new mongoose.Types.ObjectId().toString(),
                name,
                price,
                category: category || 'General'
            };
        }
    } else {
        createdProduct = {
            _id: new mongoose.Types.ObjectId().toString(),
            name,
            price,
            category: category || 'General'
        };
    }
    
    productsList.push({
        id: createdProduct._id,
        productId: createdProduct._id,
        name: createdProduct.name,
        price: createdProduct.price,
        category: (createdProduct.category || 'general').toLowerCase(),
        inStock: true,
        description: `${createdProduct.name} - high quality item`
    });

    res.status(201).json({
        status: 'success',
        data: {
            product: createdProduct
        }
    });
});

// --- MODULE 3, CHAPTER 2: SQA Test Design Technique Endpoints ---

// 1. Multi-Variable Shipping Matrix (EP)
app.post('/api/v1/shipping/calculate', (req, res) => {
    const { weight, zone } = req.body;
    try {
        const cost = calculateWeightZoneShipping(weight, zone);
        res.status(200).json({ status: 'success', weight, zone, cost });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err.message });
    }
});

// 2. Boundary Value Analysis Checkout Shipping (BVA)
app.post('/api/v1/checkout/bva', (req, res) => {
    const { subtotal, useBuggyThreshold } = req.body;
    try {
        const result = calculateCheckoutShipping(subtotal, useBuggyThreshold);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err.message });
    }
});

// 3. Decision Table Promotion Engine
app.post('/api/v1/promotions/evaluate', (req, res) => {
    const { isUserAuthenticated, orderTotal, promoCode } = req.body;
    const result = evaluatePromotionRules(isUserAuthenticated, orderTotal, promoCode);
    if (result.status === 'LOGIN_REQUIRED') {
        return res.status(401).json({ status: 'LOGIN_REQUIRED', message: 'Authentication required to evaluate promotions' });
    }
    res.status(200).json({ status: 'success', data: result });
});

// 4. Order State Machine Transition
app.post('/api/v1/orders/transition', (req, res) => {
    const { order, action } = req.body;
    try {
        const newStatus = transitionOrderState(order, action);
        res.status(200).json({ status: 'success', previousStatus: order.status, currentStatus: newStatus });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: 'fail', error: err.message });
    }
});

// Standard Products listing
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

// Performance Demonstration
app.get('/api/products/heavy-search', (req, res) => {
    setTimeout(() => {
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
    }, 1500);
});

// Standard User Endpoints
app.post('/api/users', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    res.status(201).json({
        message: 'User Login successfully',
        user: { id: 'mock-user-id', email }
    });
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { password, email } = req.body;
    res.status(200).json({
        message: 'User updated successfully',
        user: { id, email, password }
    });
});

// Security Demos
app.post('/api/users/login-vulnerable', (req, res) => {
    const { email, password } = req.body;
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

app.post('/api/users/login-secure', (req, res) => {
    const { email, password } = req.body;
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

// Cart Deletion
app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Item with id ${id} removed from cart` });
});

// Checkout logic
app.post('/api/checkout', (req, res) => {
    const { items, isPremiumMember, promoCode, userNotes } = req.body;

    if (userNotes) {
        const notesCheck = validateTextInputLength(userNotes);
        if (!notesCheck.isValid) {
            return res.status(400).json({ error: notesCheck.error });
        }
    }
    
    for (let item of (items || [])) {
        const quantityCheck = validateCartQuantity(item.quantity);
        if (!quantityCheck.isValid) {
            return res.status(400).json({ error: quantityCheck.error });
        }
        if (item.quantity > 10) {
            return res.status(400).json({ error: 'Cannot purchase more than 10 of the same item.' });
        }
    }

    let rawTotal = (items || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);
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

    const tax = discountedTotal * 0.1;
    const totalWithTax = calculateTotal(discountedTotal, tax);
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

// Static frontend serving
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

module.exports = app;
