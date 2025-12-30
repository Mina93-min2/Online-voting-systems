// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const electionRoutes = require('./routes/electionRoutes');
const UserModel = require('./models/userModel');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false
}));

// API Routes
app.use('/api', electionRoutes);

// Sign-up Route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, fullName, nationalId, role } = req.body;

        if (!email || !password || !fullName || !nationalId || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate password length (minimum 8 digits)
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Validate national ID: must be exactly 12 digits and cannot start with 0
        if (!UserModel.validateNationalId(nationalId)) {
            return res.status(400).json({ error: 'invalid national id' });
        }

        // Check if user already exists by email
        const existingUser = await UserModel.getByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Check if national ID already exists (one user per national ID)
        const existingNationalId = await UserModel.getByNationalId(nationalId);
        if (existingNationalId) {
            return res.status(409).json({ error: 'This national ID is already registered' });
        }

        // Create new user
        const user = await UserModel.create({ email, password, fullName, nationalId, role });
        res.json({ success: true, message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await UserModel.getByEmail(email);
        if (user && user.role === role) {
            // Compare password with hash
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const redirect = user.role === 'admin' ? '/admin' : '/user';
                return res.json({ success: true, redirect, userId: user.id });
            }
        }

        res.status(401).json({ error: 'Invalid credentials or role' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Static files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes for Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
