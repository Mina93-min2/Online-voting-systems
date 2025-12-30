# Quick Reference - Database Integration

## 📁 Files Created

### Configuration & Setup
- **`config/database.js`** - MySQL connection pool configuration
- **`database/schema.sql`** - Complete database schema with all tables
- **`.env.example`** - Environment variables template
- **`DATABASE_SETUP.md`** - Detailed setup and installation guide
- **`ERD.md`** - Entity Relationship Diagram documentation
- **`ERD.svg`** - Visual ERD diagram

### Models (Database Layer)
- **`models/userModel.js`** - User management (CRUD operations)
- **`models/electionModelDB.js`** - Elections, candidates, and voting logic
- **`models/auditModel.js`** - Audit logging functionality

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This adds:
- `mysql2/promise` - MySQL connection library
- `dotenv` - Environment variable management

### 2. Create Database
```bash
# Use MySQL Workbench or command line
mysql -u root -p
CREATE DATABASE secure_voting_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Import Schema
```bash
mysql -u root -p secure_voting_db < database/schema.sql
```

### 4. Setup Environment
```bash
# Copy and edit .env file
copy .env.example .env
# Edit .env with your MySQL credentials
```

### 5. Start Server
```bash
npm start
```

---

## 📊 Database Schema Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| **users** | User accounts & authentication | Parent to elections, votes, audit_logs |
| **elections** | Election metadata | Parent to candidates, votes |
| **candidates** | Candidate information | Parent to votes |
| **votes** | Individual vote records | Child to users, elections, candidates |
| **audit_logs** | System activity tracking | Child to users |

---

## 💾 Using the Models

### User Model
```javascript
const UserModel = require('./models/userModel');

// Get all users
const users = await UserModel.getAll();

// Get user by email
const user = await UserModel.getByEmail('user@example.com');

// Create new user
const newUser = await UserModel.create({
    email: 'test@example.com',
    password: 'hashed_password',
    fullName: 'John Doe',
    nationalId: '12345678',
    role: 'user'
});

// Update user
await UserModel.update(userId, updatedData);

// Delete user
await UserModel.delete(userId);
```

### Election Model
```javascript
const ElectionModel = require('./models/electionModelDB');

// Get all elections
const elections = await ElectionModel.getAll();

// Get election with candidates
const election = await ElectionModel.getById(electionId);

// Create election
const newElection = await ElectionModel.create({
    title: 'Presidential 2025',
    description: 'National election',
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    createdBy: userId
});

// Add candidate
await ElectionModel.addCandidate(electionId, {
    name: 'John Smith',
    party: 'Democratic',
    bio: 'Candidate bio'
});

// Cast vote
await ElectionModel.vote(electionId, candidateId, userId);

// Check if user voted
const hasVoted = await ElectionModel.userVoted(userId, electionId);

// Get election results
const results = await ElectionModel.getResults(electionId);

// Get total votes
const total = await ElectionModel.getTotalVotes(electionId);
```

### Audit Model
```javascript
const AuditModel = require('./models/auditModel');

// Log an action
await AuditModel.log({
    userId: userId,
    action: 'VOTE_CAST',
    entityType: 'ELECTION',
    entityId: electionId,
    oldValue: null,
    newValue: { candidateId: candidateId }
});

// Get all logs
const logs = await AuditModel.getAll(page, limit);

// Get user's logs
const userLogs = await AuditModel.getUserLogs(userId, page, limit);

// Get logs for entity
const entityLogs = await AuditModel.getEntityLogs(entityType, entityId, page, limit);
```

---

## 🔒 Security Features

✅ **Prepared Statements** - All queries prevent SQL injection
✅ **Unique Constraints** - Prevents duplicate voting (user_id, election_id)
✅ **Foreign Keys** - Ensures data integrity with cascading deletes
✅ **Audit Logging** - Tracks all system activities
✅ **Timestamps** - All records tracked with created_at/updated_at

---

## 📈 Query Examples

### Get voting statistics for an election
```sql
SELECT c.id, c.name, c.party, COUNT(v.id) as vote_count
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
WHERE c.election_id = ?
GROUP BY c.id
ORDER BY vote_count DESC;
```

### Get user's voting history
```sql
SELECT e.title, c.name, v.created_at
FROM votes v
JOIN elections e ON v.election_id = e.id
JOIN candidates c ON v.candidate_id = c.id
WHERE v.user_id = ?
ORDER BY v.created_at DESC;
```

### Get active elections
```sql
SELECT * FROM elections 
WHERE status = 'active' 
AND CURDATE() BETWEEN start_date AND end_date
ORDER BY end_date ASC;
```

### Get audit trail for user
```sql
SELECT * FROM audit_logs 
WHERE user_id = ? 
ORDER BY created_at DESC 
LIMIT 100;
```

---

## 📋 Table Schemas at a Glance

### USERS
```
id (UUID, PK)
email (VARCHAR, UNIQUE)
password (VARCHAR)
full_name (VARCHAR)
national_id (VARCHAR, UNIQUE)
role (ENUM: user|admin)
created_at, updated_at (TIMESTAMP)
```

### ELECTIONS
```
id (UUID, PK)
created_by (UUID, FK→users)
title (VARCHAR)
description (TEXT)
start_date, end_date (DATE)
status (ENUM: pending|active|closed)
created_at, updated_at (TIMESTAMP)
```

### CANDIDATES
```
id (UUID, PK)
election_id (UUID, FK→elections)
name (VARCHAR)
party (VARCHAR)
bio (TEXT)
votes (INT)
created_at, updated_at (TIMESTAMP)
```

### VOTES
```
id (UUID, PK)
user_id (UUID, FK→users)
election_id (UUID, FK→elections)
candidate_id (UUID, FK→candidates)
created_at (TIMESTAMP)
UNIQUE(user_id, election_id)
```

### AUDIT_LOGS
```
id (UUID, PK)
user_id (UUID, FK→users, nullable)
action (VARCHAR)
entity_type (VARCHAR)
entity_id (VARCHAR)
old_value (JSON)
new_value (JSON)
created_at (TIMESTAMP)
```

---

## 🔧 Common Tasks

### Initialize Empty Database
```bash
mysql -u root -p secure_voting_db < database/schema.sql
```

### Backup Database
```bash
mysqldump -u root -p secure_voting_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup
```bash
mysql -u root -p secure_voting_db < backup_20250101_120000.sql
```

### Test Database Connection
```bash
node test-db.js
```

### Reset All Data (Development)
```bash
mysql -u root -p secure_voting_db -e "DROP ALL TABLES; SOURCE database/schema.sql;"
```

---

## ⚙️ Configuration Variables

```env
# Database
DB_HOST=localhost          # MySQL server host
DB_USER=root              # MySQL username
DB_PASSWORD=              # MySQL password
DB_NAME=secure_voting_db  # Database name
DB_PORT=3306              # MySQL port

# Server
PORT=5000                 # Express server port
NODE_ENV=development      # Environment: development|production
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused (3306) | Ensure MySQL is running: `net start MySQL80` (Windows) |
| Database doesn't exist | Run: `mysql -u root -p < database/schema.sql` |
| Access denied for user | Check DB_USER and DB_PASSWORD in .env |
| Table doesn't exist | Run schema.sql: `mysql -u root -p secure_voting_db < database/schema.sql` |
| Connection pool exhausted | Check for unclosed connections, ensure `connection.release()` is called |

---

## 📚 Further Reading

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 Package](https://www.npmjs.com/package/mysql2)
- [Database Setup Guide](DATABASE_SETUP.md)
- [ERD Documentation](ERD.md)

---

## ✅ Next Steps

1. **Password Security**: Add bcrypt for password hashing
   ```bash
   npm install bcrypt
   ```

2. **Input Validation**: Add validation middleware
   ```bash
   npm install express-validator
   ```

3. **Error Handling**: Implement global error handler

4. **API Documentation**: Generate Swagger/OpenAPI docs

5. **Testing**: Add unit and integration tests
   ```bash
   npm install --save-dev jest supertest
   ```
