const API_URL = '/api'; // Relative path since we serve from same origin
const ADMIN_API_KEY = 'supersecretkey'; // In a real app, this should come from a secure auth flow

let electionsData = [];

async function loadData() {
    try {
        const response = await fetch(`${API_URL}/elections`);
        if (!response.ok) throw new Error('Failed to fetch elections');
        electionsData = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Could not load elections. Is the backend server running?');
    }
}

// Navigation Helper
async function navigateTo(pageId) {
    document.querySelectorAll('.page-view').forEach(p => {
        if (p.classList.contains('active') || p.style.display !== 'none') {
            p.classList.add('hidden');
            p.classList.remove('active');
            p.style.display = 'none';
        }
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
        page.classList.add('active');
        page.style.display = 'flex'; // Or block/flex depending on css, keeping generic for now
        // Restore specific styles if needed? The css uses .page-view.active
        page.removeAttribute('style'); // let css handle it mostly, unless specific overrides
        page.classList.add('active');
    }

    if (pageId === 'electionsList') await renderElectionsList();
    if (pageId === 'adminDashboard') await setupAdminDashboard();
}

// --- Admin Section ---
let tabs = {};
let electionContent, candidateContent, deleteContent;

async function setupAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    if (!dashboard) return;

    tabs = {
        'addElectionTab': document.getElementById('addElectionTab'),
        'addCandidateTab': document.getElementById('addCandidateTab'),
        'deleteTab': document.getElementById('deleteTab')
    };
    candidateContent = document.getElementById('candidateContent');
    electionContent = document.getElementById('electionContent');
    deleteContent = document.getElementById('deleteContent');

    if (tabs['addElectionTab']) setActiveTab('addElectionTab');
    await updateElectionDatalist();
}

function setActiveTab(activeTabId) {
    if (!tabs[activeTabId]) return;

    for (const id in tabs) {
        const tab = tabs[id];
        const contentToShow = id === 'addElectionTab' ? electionContent : id === 'addCandidateTab' ? candidateContent : deleteContent;
        const contentToHide = id === 'addElectionTab' ? electionContent : id === 'addCandidateTab' ? candidateContent : deleteContent;

        if (id === activeTabId) {
            tab.classList.add('active');
            contentToShow.classList.remove('hidden');
        } else {
            tab.classList.remove('active');
            contentToHide.classList.add('hidden');
        }
    }

    if (activeTabId === 'addCandidateTab') updateElectionDatalist();
    if (activeTabId === 'deleteTab') populateDeleteOptions();
    closeMessageBox();
}

async function updateElectionDatalist() {
    await loadData();
    const datalist = document.getElementById('election-names');
    if (!datalist) return;
    datalist.innerHTML = '';
    electionsData.forEach(e => {
        const option = document.createElement('option');
        option.value = e.title;
        datalist.appendChild(option);
    });
}

// Admin Forms Listeners
const electionForm = document.getElementById('electionForm');
if (electionForm) {
    electionForm.addEventListener('submit', async e => {
        e.preventDefault();
        const title = document.getElementById('electionTitle').value.trim();
        const description = document.getElementById('description').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        if (!title) return alert('Title required.');

        try {
            const response = await fetch(`${API_URL}/admin/elections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': ADMIN_API_KEY },
                body: JSON.stringify({ title, description, startDate, endDate })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to add election');

            e.target.reset();
            alert('Election added!');
            await updateElectionDatalist();
        } catch (err) {
            alert(err.message);
        }
    });
}

const candidateForm = document.getElementById('candidateForm');
if (candidateForm) {
    candidateForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('candidateName').value.trim();
        const party = document.getElementById('party').value.trim();
        const bio = document.getElementById('biography').value.trim();
        const electionTitle = document.getElementById('election').value.trim();
        const election = electionsData.find(ev => ev.title === electionTitle);
        if (!election) return alert('Election not found.');

        try {
            const response = await fetch(`${API_URL}/admin/elections/${election.id}/candidates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': ADMIN_API_KEY },
                body: JSON.stringify({ name, party, bio })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to add candidate');

            e.target.reset();
            alert('Candidate added!');
        } catch (err) {
            alert(err.message);
        }
    });
}

// Delete Tab Logic
async function populateDeleteOptions() {
    await loadData();
    const electionSelect = document.getElementById('deleteElectionSelect');
    const candidateSelect = document.getElementById('deleteCandidateSelect');
    if (!electionSelect || !candidateSelect) return;

    electionSelect.innerHTML = ''; candidateSelect.innerHTML = '<option value="">-- Select candidate after choosing election --</option>';

    electionsData.forEach(e => {
        const option = document.createElement('option'); option.value = e.id; option.textContent = e.title; electionSelect.appendChild(option);
    });

    electionSelect.onchange = () => {
        const electionId = electionSelect.value;
        candidateSelect.innerHTML = '<option value="">-- Delete whole election or select candidate --</option>';
        const election = electionsData.find(e => e.id === electionId);
        if (!election || !Array.isArray(election.candidates)) return;
        election.candidates.forEach(c => {
            const option = document.createElement('option'); option.value = c.id; option.textContent = c.name; candidateSelect.appendChild(option);
        });
    };
}

async function handleDelete() {
    const electionSelect = document.getElementById('deleteElectionSelect');
    const candidateSelect = document.getElementById('deleteCandidateSelect');
    if (!electionSelect) return;

    const electionId = electionSelect.value;
    const candidateId = candidateSelect ? candidateSelect.value : null;

    if (!electionId) return showMessageBox("Error", "Please select an election to delete.");

    try {
        let response;
        if (candidateId) {
            response = await fetch(`${API_URL}/admin/elections/${electionId}/candidates/${candidateId}`, {
                method: 'DELETE',
                headers: { 'x-api-key': ADMIN_API_KEY }
            });
            if (response.ok) showMessageBox("Deleted", `Candidate removed.`);

        } else {
            response = await fetch(`${API_URL}/admin/elections/${electionId}`, {
                method: 'DELETE',
                headers: { 'x-api-key': ADMIN_API_KEY }
            });
            if (response.ok) showMessageBox("Deleted", `Election removed.`);
        }

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Delete failed');
        }

        await populateDeleteOptions();
        // If we are on user page this might not exist, but handleDelete is admin only.
    } catch (err) {
        showMessageBox("Error", err.message);
    }
}

function showMessageBox(title, text) {
    const mb = document.getElementById('messageBox');
    if (mb) {
        document.getElementById('messageTitle').textContent = title;
        document.getElementById('messageText').textContent = text;
        mb.classList.remove('hidden');
    } else {
        alert(`${title}: ${text}`);
    }
}
function closeMessageBox() {
    const mb = document.getElementById('messageBox');
    if (mb) mb.classList.add('hidden');
}

// --- User Section ---
// Render Elections List
async function renderElectionsList() {
    const grid = document.getElementById('elections-grid');
    if (!grid) return;

    await loadData();
    grid.innerHTML = '';
    electionsData.forEach(e => {
        const card = document.createElement('div');
        card.className = 'candidate-card card cursor-pointer';
        card.innerHTML = `<h2 class="card-title">${e.title}</h2>
<p class="card-desc">${e.description}</p>
<p class="card-meta">Start: ${e.startDate}</p>
<p class="card-meta mb-4">End: ${e.endDate}</p>
<button onclick="startVoting('${e.id}')" class="btn btn-primary btn-sm">Vote Now</button>`;
        grid.appendChild(card);
    });
}

// Voting Page
async function startVoting(electionId) {
    await loadData();
    const election = electionsData.find(e => e.id === electionId);
    if (!election) return alert('Election not found');

    const titleEl = document.getElementById('votingPageTitle');
    if (titleEl) titleEl.textContent = election.title;

    const grid = document.getElementById('candidate-grid');
    if (grid) {
        grid.innerHTML = '';
        election.candidates.forEach(c => {
            const card = document.createElement('div');
            card.className = 'candidate-card card cursor-pointer';
            card.innerHTML = `<h2 class="card-title">${c.name}</h2>
    <p class="card-meta mb-1">Party: ${c.party}</p>
    <p class="card-desc" style="font-size: 0.875rem;">${c.bio}</p>
    <button onclick="submitVote('${electionId}','${c.id}')" class="btn btn-primary btn-sm mt-4">Vote</button>`;
            grid.appendChild(card);
        });
    }

    navigateTo('votingPage');
}

async function submitVote(electionId, candidateId) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.classList.remove('hidden', 'status-success', 'status-error');
        statusMessage.textContent = 'Submitting your vote...';
    }

    // Check if user has already voted for this election
    const votedElections = JSON.parse(localStorage.getItem('votedElections') || '{}');
    if (votedElections[electionId]) {
        if (statusMessage) {
            statusMessage.classList.add('status-error');
            statusMessage.textContent = 'You have already voted in this election.';
        } else {
            alert('You have already voted in this election.');
        }
        return;
    }

    try {
        const response = await fetch(`${API_URL}/elections/${electionId}/candidates/${candidateId}/vote`, {
            method: 'POST'
        });

        if (response.ok) {
            // Mark as voted locally just for UI feedback
            votedElections[electionId] = candidateId;
            localStorage.setItem('votedElections', JSON.stringify(votedElections));

            if (statusMessage) {
                statusMessage.classList.add('status-success');
                statusMessage.textContent = 'Your vote has been successfully submitted. Thank you for voting!';
            } else {
                alert('Your vote has been successfully submitted.');
            }
        } else {
            throw new Error('Vote submission failed');
        }
    } catch (error) {
        if (statusMessage) {
            statusMessage.classList.add('status-error');
            statusMessage.textContent = 'There was an error submitting your vote. Please try again.';
        } else {
            alert('Error submitting vote.');
        }
    }
}

// Initialization Logic
document.addEventListener('DOMContentLoaded', async () => {
    // Check which page we are on
    if (document.getElementById('adminDashboard')) {
        await setupAdminDashboard();
    } else if (document.getElementById('electionsList')) {
        await renderElectionsList();
    }
});
