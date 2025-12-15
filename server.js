// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const electionRoutes = require('./routes/electionRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false // Disabled for this demo to allow inline scripts/styles if needed
}));

// API Routes
app.use('/api', electionRoutes);

// Helper functions for user management
const getUsersFilePath = () => path.join(__dirname, 'users.json');

const readUsers = () => {
    try {
        const data = fs.readFileSync(getUsersFilePath(), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [] };
    }
};

const writeUsers = (usersData) => {
    fs.writeFileSync(getUsersFilePath(), JSON.stringify(usersData, null, 2));
};

// Sign-up Route
app.post('/api/signup', (req, res) => {
    const { email, password, fullName, nationalId, role } = req.body;

    if (!email || !password || !fullName || !nationalId || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const usersData = readUsers();

    // Check if user already exists
    const userExists = usersData.users.find(u => u.email === email);
    if (userExists) {
        return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = {
        id: uuidv4(),
        email,
        password, // In production, hash this password!
        fullName,
        nationalId,
        role
    };

    usersData.users.push(newUser);
    writeUsers(usersData);

    res.json({ success: true, message: 'User registered successfully' });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;

    const usersData = readUsers();
    const user = usersData.users.find(
        u => u.email === email && u.password === password && u.role === role
    );

    if (user) {
        const redirect = user.role === 'admin' ? '/admin' : '/user';
        return res.json({ success: true, redirect });
    }

    res.status(401).json({ error: 'Invalid credentials or role' });
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
