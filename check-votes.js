require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'MyPassword123',
            database: 'secure_voting_db'
        });

        const [votes] = await connection.query(`
            SELECT u.email, e.title as election, c.name as candidate
            FROM votes v
            JOIN users u ON v.user_id = u.id
            JOIN elections e ON v.election_id = e.id
            JOIN candidates c ON v.candidate_id = c.id
        `);
        
        console.log('=== VOTES IN DATABASE ===');
        votes.forEach(v => console.log(`  ${v.email} → ${v.candidate} in "${v.election}"`));

        const [elections] = await connection.query('SELECT id, title FROM elections ORDER BY created_at DESC');
        console.log('\n=== ALL ELECTIONS ===');
        elections.forEach(e => console.log(`  [${e.id.substring(0,8)}...] ${e.title}`));

        await connection.end();
        process.exit(0);
    } catch(err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
