// models/auditModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const AuditModel = {
    // Log an action
    log: async (auditData) => {
        const connection = await pool.getConnection();
        try {
            const id = uuidv4();
            const { userId, action, entityType, entityId, oldValue, newValue } = auditData;

            await connection.query(
                'INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    userId || null,
                    action,
                    entityType,
                    entityId,
                    oldValue ? JSON.stringify(oldValue) : null,
                    newValue ? JSON.stringify(newValue) : null
                ]
            );

            return await AuditModel.getById(id);
        } finally {
            connection.release();
        }
    },

    // Get audit log by ID
    getById: async (id) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM audit_logs WHERE id = ?', [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    },

    // Get all audit logs with pagination
    getAll: async (page = 1, limit = 50) => {
        const connection = await pool.getConnection();
        try {
            const offset = (page - 1) * limit;
            const [rows] = await connection.query(
                'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            return rows;
        } finally {
            connection.release();
        }
    },

    // Get logs for a specific user
    getUserLogs: async (userId, page = 1, limit = 50) => {
        const connection = await pool.getConnection();
        try {
            const offset = (page - 1) * limit;
            const [rows] = await connection.query(
                'SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [userId, limit, offset]
            );
            return rows;
        } finally {
            connection.release();
        }
    },

    // Get logs for a specific entity
    getEntityLogs: async (entityType, entityId, page = 1, limit = 50) => {
        const connection = await pool.getConnection();
        try {
            const offset = (page - 1) * limit;
            const [rows] = await connection.query(
                'SELECT * FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [entityType, entityId, limit, offset]
            );
            return rows;
        } finally {
            connection.release();
        }
    }
};

module.exports = AuditModel;
