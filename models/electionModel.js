const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

function readData() {
    if (!fs.existsSync(DATA_FILE)) return { elections: [] };
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const ElectionModel = {
    getAll: () => {
        const data = readData();
        return data.elections;
    },

    getById: (id) => {
        const data = readData();
        return data.elections.find(e => e.id === id);
    },

    create: (election) => {
        const data = readData();
        if (data.elections.some(e => e.id === election.id)) {
            throw new Error('Election already exists');
        }
        data.elections.push(election);
        writeData(data);
        return election;
    },

    delete: (id) => {
        const data = readData();
        const index = data.elections.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Election not found');
        const removed = data.elections.splice(index, 1);
        writeData(data);
        return removed[0];
    },

    // Candidate methods structured within ElectionModel for simplicity in this file-based DB
    addCandidate: (electionId, candidate) => {
        const data = readData();
        const election = data.elections.find(e => e.id === electionId);
        if (!election) throw new Error('Election not found');

        if (election.candidates.some(c => c.id === candidate.id)) {
            throw new Error('Candidate already exists');
        }
        election.candidates.push(candidate);
        writeData(data);
        return candidate;
    },

    removeCandidate: (electionId, candidateId) => {
        const data = readData();
        const election = data.elections.find(e => e.id === electionId);
        if (!election) throw new Error('Election not found');

        const index = election.candidates.findIndex(c => c.id === candidateId);
        if (index === -1) throw new Error('Candidate not found');

        const removed = election.candidates.splice(index, 1);
        writeData(data);
        return removed[0];
    },

    vote: (electionId, candidateId) => {
        const data = readData();
        const election = data.elections.find(e => e.id === electionId);
        if (!election) throw new Error('Election not found');

        const candidate = election.candidates.find(c => c.id === candidateId);
        if (!candidate) throw new Error('Candidate not found');

        if (!candidate.votes) candidate.votes = 0;
        candidate.votes += 1;

        writeData(data);
        return candidate.votes;
    }
};

module.exports = ElectionModel;
