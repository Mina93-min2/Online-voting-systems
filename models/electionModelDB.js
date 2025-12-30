// models/electionModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const ElectionModel = {
    // Get all elections
    getAll: async () => {
        const connection = await pool.getConnection();
        try {
            const [elections] = await connection.query('SELECT * FROM elections');
            connection.release();
            
            // Get candidates for each election with separate connections
            const electionsWithCandidates = await Promise.all(
                elections.map(async (election) => {
                    const conn = await pool.getConnection();
                    try {
                        const [candidates] = await conn.query(
                            'SELECT * FROM candidates WHERE election_id = ?',
                            [election.id]
                        );
                        return {
                            ...election,
                            candidates: candidates
                        };
                    } finally {
                        conn.release();
                    }
                })
            );
            
            return electionsWithCandidates;
        } finally {
            connection.release();
        }
    },

    // Get election by ID with candidates
    getById: async (id) => {
        const connection = await pool.getConnection();
        try {
            const [elections] = await connection.query('SELECT * FROM elections WHERE id = ?', [id]);
            if (elections.length === 0) return null;

            const [candidates] = await connection.query('SELECT * FROM candidates WHERE election_id = ?', [id]);
            
            return {
                ...elections[0],
                candidates: candidates
            };
        } finally {
            connection.release();
        }
    },

    // Create new election
    create: async (electionData) => {
        const connection = await pool.getConnection();
        try {
            const id = uuidv4();
            const { title, description, startDate, endDate, createdBy } = electionData;

            await connection.query(
                'INSERT INTO elections (id, title, description, start_date, end_date, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, title, description, startDate, endDate, createdBy, 'pending']
            );

            return await ElectionModel.getById(id);
        } finally {
            connection.release();
        }
    },

    // Update election
    update: async (id, electionData) => {
        const connection = await pool.getConnection();
        try {
            const { title, description, startDate, endDate, status } = electionData;

            await connection.query(
                'UPDATE elections SET title = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
                [title, description, startDate, endDate, status, id]
            );

            return await ElectionModel.getById(id);
        } finally {
            connection.release();
        }
    },

    // Delete election
    delete: async (id) => {
        const connection = await pool.getConnection();
        try {
            const election = await ElectionModel.getById(id);
            await connection.query('DELETE FROM elections WHERE id = ?', [id]);
            return election;
        } finally {
            connection.release();
        }
    },

    // ===== CANDIDATE METHODS =====

    // Add candidate to election
    addCandidate: async (electionId, candidateData) => {
        const connection = await pool.getConnection();
        try {
            const id = uuidv4();
            const { name, party, bio } = candidateData;

            await connection.query(
                'INSERT INTO candidates (id, election_id, name, party, bio) VALUES (?, ?, ?, ?, ?)',
                [id, electionId, name, party, bio]
            );

            return await ElectionModel.getCandidateById(id);
        } finally {
            connection.release();
        }
    },

    // Get candidate by ID
    getCandidateById: async (candidateId) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM candidates WHERE id = ?', [candidateId]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    },

    // Remove candidate
    removeCandidate: async (electionId, candidateId) => {
        const connection = await pool.getConnection();
        try {
            const candidate = await ElectionModel.getCandidateById(candidateId);
            await connection.query('DELETE FROM candidates WHERE id = ? AND election_id = ?', [candidateId, electionId]);
            return candidate;
        } finally {
            connection.release();
        }
    },

    // ===== VOTE METHODS =====

    // Cast a vote
    vote: async (electionId, candidateId, userId) => {
        const connection = await pool.getConnection();
        try {
            const voteId = uuidv4();

            // Insert vote
            await connection.query(
                'INSERT INTO votes (id, user_id, election_id, candidate_id) VALUES (?, ?, ?, ?)',
                [voteId, userId, electionId, candidateId]
            );

            // Update candidate vote count
            await connection.query(
                'UPDATE candidates SET votes = votes + 1 WHERE id = ?',
                [candidateId]
            );

            return await ElectionModel.getCandidateById(candidateId);
        } finally {
            connection.release();
        }
    },

    // Check if user already voted in an election
    userVoted: async (userId, electionId) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM votes WHERE user_id = ? AND election_id = ?',
                [userId, electionId]
            );
            return rows.length > 0;
        } finally {
            connection.release();
        }
    },

    // Get user's vote in an election
    getUserVote: async (userId, electionId) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM votes WHERE user_id = ? AND election_id = ?',
                [userId, electionId]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    },

    // Get election results
    getResults: async (electionId) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT c.*, COUNT(v.id) as total_votes 
                 FROM candidates c
                 LEFT JOIN votes v ON c.id = v.candidate_id
                 WHERE c.election_id = ?
                 GROUP BY c.id
                 ORDER BY total_votes DESC`,
                [electionId]
            );
            return rows;
        } finally {
            connection.release();
        }
    },

    // Get total votes in election
    getTotalVotes: async (electionId) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(*) as total FROM votes WHERE election_id = ?',
                [electionId]
            );
            return rows[0].total;
        } finally {
            connection.release();
        }
    }
};

module.exports = ElectionModel;
