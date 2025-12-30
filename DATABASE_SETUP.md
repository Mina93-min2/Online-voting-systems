# Database Integration Setup Guide

## Overview
This guide walks you through setting up MySQL for the Secure Blue Voting System.

## Prerequisites
- **MySQL Server** (5.7 or higher, preferably 8.0)
- **Node.js** (v14 or higher)
- **npm** (installed with Node.js)

---

## Step 1: Install MySQL Server

### Windows
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. During installation, set:
   - **MySQL Server Port**: 3306 (default)
   - **MySQL Root Password**: Remember this!
4. Complete the installation

### Alternative: Using MySQL via Docker (Optional)
```bash
docker run --name voting_mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

---

## Step 2: Create Database and User

### Option A: Using MySQL Workbench (GUI)
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Execute the SQL script: [database/schema.sql](database/schema.sql)

### Option B: Using Command Line

#### 1. Connect to MySQL
```bash
mysql -u root -p
# Enter your root password
```

#### 2. Create database
```sql
CREATE DATABASE secure_voting_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. Create application user (optional but recommended)
```sql
CREATE USER 'voting_user'@'localhost' IDENTIFIED BY 'voting_password_123';
GRANT ALL PRIVILEGES ON secure_voting_db.* TO 'voting_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 4. Import the schema
```bash
mysql -u root -p secure_voting_db < database/schema.sql
```

---

## Step 3: Setup Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root              # or voting_user
DB_PASSWORD=             # your password
DB_NAME=secure_voting_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## Step 4: Install Node Dependencies

```bash
npm install
```

This will install all required packages including `mysql2`.

---

## Step 5: Verify Database Connection

Create a test file `test-db.js` in the root directory:

```javascript
// test-db.js
const pool = require('./config/database');

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✓ Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
    }
    process.exit();
}

testConnection();
```

Run the test:
```bash
node test-db.js
```

Expected output:
```
✓ Database connected successfully!
```

---

## Step 6: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will start at: `http://localhost:5000`

---

## Database Structure

The schema creates 5 main tables:

### 1. **users** - User accounts
- Stores login credentials, roles (admin/user), and user info
- Primary Key: `id` (UUID)

### 2. **elections** - Election information
- Stores election details (title, dates, status)
- Primary Key: `id` (UUID)
- Foreign Key: `created_by` (references users)

### 3. **candidates** - Election candidates
- Stores candidate info (name, party, bio, vote count)
- Primary Key: `id` (UUID)
- Foreign Key: `election_id` (references elections)

### 4. **votes** - Individual votes (audit trail)
- Records each vote cast with timestamp
- Primary Key: `id` (UUID)
- Foreign Keys: `user_id`, `election_id`, `candidate_id`
- **Unique Constraint**: One vote per user per election

### 5. **audit_logs** - System activity logs
- Records all system actions for security
- Primary Key: `id` (UUID)
- Foreign Key: `user_id` (references users)

See [ERD.md](ERD.md) for detailed Entity Relationship Diagram.

---

## Migrating from JSON to Database

### Automatic Migration Script

If you want to migrate existing data from JSON files:

```javascript
// migrate-to-db.js
const fs = require('fs');
const ElectionModel = require('./models/electionModelDB');
const UserModel = require('./models/userModel');

async function migrate() {
    try {
        // Migrate users
        const usersData = JSON.parse(fs.readFileSync('users.json'));
        for (const user of usersData.users) {
            await UserModel.create(user);
        }
        console.log('✓ Users migrated');

        // Migrate elections and candidates
        const electionsData = JSON.parse(fs.readFileSync('data.json'));
        for (const election of electionsData.elections) {
            const newElection = await ElectionModel.create(election);
            for (const candidate of election.candidates) {
                await ElectionModel.addCandidate(newElection.id, candidate);
            }
        }
        console.log('✓ Elections and candidates migrated');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
```

---

## Troubleshooting

### Connection Error: "ECONNREFUSED 127.0.0.1:3306"
- MySQL is not running
- Solution: Start MySQL service
  ```bash
  # Windows
  net start MySQL80  # or your MySQL version
  
  # Mac
  brew services start mysql
  ```

### Error: "Access denied for user 'root'@'localhost'"
- Incorrect password in `.env`
- Solution: Verify your MySQL root password

### Error: "Unknown database 'secure_voting_db'"
- Database not created
- Solution: Run `schema.sql` as shown in Step 2

### "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
- Incorrect MySQL version or configuration
- Solution: Check MySQL version with `mysql --version`

---

## Using the Models

### Example: Create an election
```javascript
const ElectionModel = require('./models/electionModelDB');

const newElection = await ElectionModel.create({
    title: 'Presidential 2025',
    description: 'National presidential election',
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    createdBy: 'user-id-here'
});
```

### Example: Cast a vote
```javascript
const vote = await ElectionModel.vote(
    'election-id',
    'candidate-id',
    'user-id'
);
```

### Example: Get election results
```javascript
const results = await ElectionModel.getResults('election-id');
console.log(results); // Returns candidates with vote counts
```

---

## Database Backup

### Backup the database:
```bash
mysqldump -u root -p secure_voting_db > backup.sql
```

### Restore from backup:
```bash
mysql -u root -p secure_voting_db < backup.sql
```

---

## Performance Tips

1. **Indexes**: Schema includes indexes on frequently queried columns
2. **Connection Pooling**: Uses mysql2 connection pool (max 10 connections)
3. **Prepared Statements**: All queries use parameterized statements (prevents SQL injection)

---

## Security Notes

✓ All database queries use prepared statements
✓ Unique constraint prevents duplicate voting
✓ Foreign key constraints ensure data integrity
✓ Audit logs track all system actions
✓ Password hashing should be implemented (use bcrypt)

---

## Next Steps

1. Update server.js to require the `.env` file:
   ```javascript
   require('dotenv').config();
   ```

2. Update existing routes to use the new database models

3. Implement password hashing using bcrypt:
   ```bash
   npm install bcrypt
   ```

4. Add middleware for error handling and logging

---

## Contact & Support

For issues with MySQL setup, visit: https://dev.mysql.com/doc/
