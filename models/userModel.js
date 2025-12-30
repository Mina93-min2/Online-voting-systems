// models/userModel.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Validate national ID: Must be exactly 12 digits and cannot start with 0
const validateNationalId = (nationalId) => {
    const nationalIdRegex = /^[1-9]\d{11}$/;
    return nationalIdRegex.test(nationalId);
};

const UserModel = {
    // Get all users
    getAll: async () => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users');
            return rows;
        } finally {
            connection.release();
        }
    },

    // Get user by ID
    getById: async (id) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    },

    // Get user by email
    getByEmail: async (email) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    },

    // Create new user
    create: async (userData) => {
        const connection = await pool.getConnection();
        try {
            const id = uuidv4();
            const { email, password, fullName, nationalId, role } = userData;
            
            // Validate national ID: must be exactly 12 digits
            if (!validateNationalId(nationalId)) {
                throw new Error('invalid national id');
            }

            // Hash password with bcrypt (salt rounds = 10)
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await connection.query(
                'INSERT INTO users (id, email, password, full_name, national_id, role) VALUES (?, ?, ?, ?, ?, ?)',
                [id, email, hashedPassword, fullName, nationalId, role || 'user']
            );
            
            return await UserModel.getById(id);
        } finally {
            connection.release();
        }
    },

    // Update user
    update: async (id, userData) => {
        const connection = await pool.getConnection();
        try {
            const { email, password, fullName, nationalId, role } = userData;
            
            await connection.query(
                'UPDATE users SET email = ?, password = ?, full_name = ?, national_id = ?, role = ? WHERE id = ?',
                [email, password, fullName, nationalId, role, id]
            );
            
            return await UserModel.getById(id);
        } finally {
            connection.release();
        }
    },

    // Delete user
    delete: async (id) => {
        const connection = await pool.getConnection();
        try {
            const user = await UserModel.getById(id);
            await connection.query('DELETE FROM users WHERE id = ?', [id]);
            return user;
        } finally {
            connection.release();
        }
    },

    // Validate national ID
    validateNationalId: validateNationalId,

    // Get user by national ID
    getByNationalId: async (nationalId) => {
        if (!validateNationalId(nationalId)) {
            return null;
        }
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE national_id = ?', [nationalId]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }
};

module.exports = UserModel;
