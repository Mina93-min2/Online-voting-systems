const ElectionModel = require('../models/electionModelDB');
const UserModel = require('../models/userModel');

const ADMIN_API_KEY = 'supersecretkey';

const ElectionController = {
    // Middleware for Admin Auth
    requireAdmin: (req, res, next) => {
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== ADMIN_API_KEY) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        next();
    },

    getElections: async (req, res) => {
        try {
            const elections = await ElectionModel.getAll();
            res.json(elections);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getElectionById: async (req, res) => {
        try {
            const election = await ElectionModel.getById(req.params.id);
            if (!election) return res.status(404).json({ error: 'Election not found' });
            res.json(election);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createElection: async (req, res) => {
        try {
            const { title, description, startDate, endDate, userId } = req.body;
            if (!title || !description || !startDate || !endDate) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Use provided userId or get admin user
            let adminId = userId;
            if (!adminId) {
                const admin = await UserModel.getByEmail('admin');
                if (!admin) {
                    return res.status(400).json({ error: 'Admin user not found' });
                }
                adminId = admin.id;
            }

            const election = await ElectionModel.create({
                title,
                description,
                startDate,
                endDate,
                createdBy: adminId
            });
            res.json({ success: true, election });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteElection: async (req, res) => {
        try {
            await ElectionModel.delete(req.params.id);
            res.json({ success: true, message: 'Election deleted' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    addCandidate: async (req, res) => {
        try {
            const { name, party, bio } = req.body;
            if (!name || !party || !bio) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const candidate = await ElectionModel.addCandidate(req.params.id, { name, party, bio });
            res.json({ success: true, candidate });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteCandidate: async (req, res) => {
        try {
            await ElectionModel.removeCandidate(req.params.candidateId);
            res.json({ success: true, message: 'Candidate deleted' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    castVote: async (req, res) => {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'userId required' });
            }
            
            console.log(`Vote attempt: userId=${userId}, electionId=${req.params.id}, candidateId=${req.params.candidateId}`);
            
            const result = await ElectionModel.vote(req.params.id, req.params.candidateId, userId);
            res.json({ success: true, message: 'Vote recorded', result });
        } catch (error) {
            console.error('Vote error:', error);
            res.status(400).json({ error: error.message || 'Failed to submit vote' });
        }
    },

    // Check if a user has already voted in an election
    getUserVoteStatus: async (req, res) => {
        try {
            const { id: electionId, userId } = req.params;
            
            if (!electionId || !userId) {
                return res.status(400).json({ error: 'electionId and userId required' });
            }
            
            const hasVoted = await ElectionModel.userVoted(userId, electionId);
            res.json({ hasVoted, userId, electionId });
        } catch (error) {
            console.error('Error checking vote status:', error);
            res.status(400).json({ error: error.message || 'Failed to check vote status' });
        }
    }
};

module.exports = ElectionController;
