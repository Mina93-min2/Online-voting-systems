const ElectionModel = require('../models/electionModel');

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

    getElections: (req, res) => {
        try {
            const elections = ElectionModel.getAll();
            res.json(elections);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getElectionById: (req, res) => {
        try {
            const election = ElectionModel.getById(req.params.id);
            if (!election) return res.status(404).json({ error: 'Election not found' });
            res.json(election);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createElection: (req, res) => {
        try {
            const { title, description, startDate, endDate } = req.body;
            if (!title || !description || !startDate || !endDate) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const newElection = { id, title, description, startDate, endDate, candidates: [] };

            ElectionModel.create(newElection);
            res.json({ success: true, election: newElection });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteElection: (req, res) => {
        try {
            const removed = ElectionModel.delete(req.params.id);
            res.json({ success: true, removed });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    addCandidate: (req, res) => {
        try {
            const { name, party, bio } = req.body;
            if (!name || !party || !bio) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const candidateId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const newCandidate = { id: candidateId, name, party, bio };

            ElectionModel.addCandidate(req.params.id, newCandidate);
            res.json({ success: true, candidate: newCandidate });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteCandidate: (req, res) => {
        try {
            const removed = ElectionModel.removeCandidate(req.params.electionId, req.params.candidateId);
            res.json({ success: true, removed });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    castVote: (req, res) => {
        try {
            const votes = ElectionModel.vote(req.params.id, req.params.candidateId);
            res.json({ success: true, message: 'Vote recorded', votes });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};

module.exports = ElectionController;
