const express = require('express');
const router = express.Router();
const controller = require('../controllers/electionController');

// Public
router.get('/elections', controller.getElections);
router.get('/elections/:id', controller.getElectionById);
router.post('/elections/:id/candidates/:candidateId/vote', controller.castVote);

// Admin
router.post('/admin/elections', controller.requireAdmin, controller.createElection);
router.delete('/admin/elections/:id', controller.requireAdmin, controller.deleteElection);
router.post('/admin/elections/:id/candidates', controller.requireAdmin, controller.addCandidate);
router.delete('/admin/elections/:electionId/candidates/:candidateId', controller.requireAdmin, controller.deleteCandidate);

module.exports = router;
