const pool = require('./config/database');
const bcrypt = require('bcrypt');

async function resetAdminPassword() {
    const connection = await pool.getConnection();
    try {
        const hashedPassword = await bcrypt.hash('admin1234', 10);
        
        const [result] = await connection.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, 'admin']
        );
        
        console.log('✓ Admin password updated successfully!');
        console.log('Email: admin');
        console.log('Password: admin1234');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        connection.release();
    }
}

resetAdminPassword();
