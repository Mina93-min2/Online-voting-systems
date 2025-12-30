const pool = require('./config/database');
const { v4: uuidv4 } = require('uuid');

async function addPhysicsElection() {
    const connection = await pool.getConnection();
    try {
        // Get admin user
        const [adminUsers] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin']);
        if (adminUsers.length === 0) {
            console.error('✗ Admin user not found');
            process.exit(1);
        }
        const adminId = adminUsers[0].id;

        // Create election
        const electionId = uuidv4();
        await connection.query(
            'INSERT INTO elections (id, title, description, start_date, end_date, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                electionId,
                'Best Physics Department',
                'Vote for the best Physics Department in Egyptian universities',
                '2025-01-01',
                '2025-12-31',
                adminId,
                'active'
            ]
        );

        // Add candidates
        const candidates = [
            { name: 'Cairo University Physics Department', party: 'Cairo University', bio: 'Oldest and most established physics department in Egypt with renowned faculty' },
            { name: 'Ain Shams University Physics', party: 'Ain Shams University', bio: 'Leading physics research institution with strong experimental labs' },
            { name: 'Alexandria University Physics', party: 'Alexandria University', bio: 'Coastal university with modern physics facilities and marine research' },
            { name: 'American University in Cairo', party: 'AUC', bio: 'International standards physics program with advanced equipment' },
            { name: 'German University in Cairo', party: 'GUC', bio: 'German-style physics education with state-of-the-art laboratories' },
            { name: 'Egyptian Chinese University Physics', party: 'ECU', bio: 'Modern physics department with Asian-African collaboration' }
        ];

        for (const candidate of candidates) {
            const candidateId = uuidv4();
            await connection.query(
                'INSERT INTO candidates (id, election_id, name, party, bio, votes) VALUES (?, ?, ?, ?, ?, ?)',
                [candidateId, electionId, candidate.name, candidate.party, candidate.bio, 0]
            );
        }

        console.log('✓ Physics Department Election created successfully!');
        console.log(`Election ID: ${electionId}`);
        console.log('✓ Added 6 candidates:');
        candidates.forEach((c, i) => console.log(`  ${i + 1}. ${c.name} (${c.party})`));
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        connection.release();
    }
}

addPhysicsElection();
