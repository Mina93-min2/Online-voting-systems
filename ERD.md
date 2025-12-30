# Entity Relationship Diagram (ERD)
## Secure Blue Voting System

### Database Overview
This document describes the database schema for the Secure Blue Voting System.

---

## Entities and Relationships

### 1. **USERS** Table
Stores user account information including admin and regular voters.

```
┌─────────────────────────────┐
│           USERS             │
├─────────────────────────────┤
│ PK │ id (UUID)              │
│    │ email (VARCHAR, UNIQUE)│
│    │ password (VARCHAR)     │
│    │ full_name (VARCHAR)    │
│    │ national_id (VARCHAR)  │
│    │ role (ENUM)            │
│    │ created_at (TIMESTAMP) │
│    │ updated_at (TIMESTAMP) │
└─────────────────────────────┘
```

**Attributes:**
- `id`: Unique identifier (UUID v4)
- `email`: User's email address (unique)
- `password`: Hashed password
- `full_name`: User's full name
- `national_id`: National ID (for verification, optional)
- `role`: 'user' or 'admin' 
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

---

### 2. **ELECTIONS** Table
Stores election information and metadata.

```
┌──────────────────────────────┐
│       ELECTIONS              │
├──────────────────────────────┤
│ PK │ id (UUID)               │
│ FK │ created_by (UUID)       │
│    │ title (VARCHAR)         │
│    │ description (TEXT)      │
│    │ start_date (DATE)       │
│    │ end_date (DATE)         │
│    │ status (ENUM)           │
│    │ created_at (TIMESTAMP)  │
│    │ updated_at (TIMESTAMP)  │
└──────────────────────────────┘
```

**Attributes:**
- `id`: Unique identifier (UUID v4)
- `created_by`: Foreign key to USERS (Admin who created the election)
- `title`: Election title
- `description`: Detailed description
- `start_date`: Election start date
- `end_date`: Election end date
- `status`: 'pending', 'active', or 'closed'
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**
- One-to-Many with CANDIDATES (1 election → many candidates)
- One-to-Many with VOTES (1 election → many votes)
- Many-to-One with USERS (created_by)

---

### 3. **CANDIDATES** Table
Stores candidate information for each election.

```
┌────────────────────────────────┐
│       CANDIDATES               │
├────────────────────────────────┤
│ PK │ id (UUID)                 │
│ FK │ election_id (UUID)        │
│    │ name (VARCHAR)            │
│    │ party (VARCHAR)           │
│    │ bio (TEXT)                │
│    │ votes (INT)               │
│    │ created_at (TIMESTAMP)    │
│    │ updated_at (TIMESTAMP)    │
└────────────────────────────────┘
```

**Attributes:**
- `id`: Unique identifier (UUID v4)
- `election_id`: Foreign key to ELECTIONS
- `name`: Candidate's name
- `party`: Party affiliation
- `bio`: Candidate biography
- `votes`: Vote count (aggregated for quick access)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**
- Many-to-One with ELECTIONS
- One-to-Many with VOTES (1 candidate → many votes)

---

### 4. **VOTES** Table
Tracks individual votes cast by users (audit trail).

```
┌──────────────────────────────────┐
│          VOTES                   │
├──────────────────────────────────┤
│ PK │ id (UUID)                   │
│ FK │ user_id (UUID)              │
│ FK │ election_id (UUID)          │
│ FK │ candidate_id (UUID)         │
│    │ created_at (TIMESTAMP)      │
│ UQ │ (user_id, election_id)      │
└──────────────────────────────────┘
```

**Attributes:**
- `id`: Unique identifier (UUID v4)
- `user_id`: Foreign key to USERS (who voted)
- `election_id`: Foreign key to ELECTIONS (which election)
- `candidate_id`: Foreign key to CANDIDATES (who they voted for)
- `created_at`: Vote timestamp
- **Unique Constraint**: One vote per user per election (prevents duplicate voting)

**Relationships:**
- Many-to-One with USERS
- Many-to-One with ELECTIONS
- Many-to-One with CANDIDATES

---

### 5. **AUDIT_LOGS** Table
Maintains audit trail of all system actions for security and accountability.

```
┌────────────────────────────────┐
│      AUDIT_LOGS                │
├────────────────────────────────┤
│ PK │ id (UUID)                 │
│ FK │ user_id (UUID, Nullable)  │
│    │ action (VARCHAR)          │
│    │ entity_type (VARCHAR)     │
│    │ entity_id (VARCHAR)       │
│    │ old_value (JSON)          │
│    │ new_value (JSON)          │
│    │ created_at (TIMESTAMP)    │
└────────────────────────────────┘
```

**Attributes:**
- `id`: Unique identifier (UUID v4)
- `user_id`: Foreign key to USERS (who performed the action, nullable for system actions)
- `action`: Type of action (CREATE, UPDATE, DELETE, VOTE, etc.)
- `entity_type`: Type of entity (ELECTION, CANDIDATE, USER, etc.)
- `entity_id`: ID of the affected entity
- `old_value`: Previous state (JSON)
- `new_value`: New state (JSON)
- `created_at`: Action timestamp

**Relationships:**
- Many-to-One with USERS

---

## Complete ERD Diagram

```
                                    ┌─────────────────────┐
                                    │       USERS         │
                                    ├─────────────────────┤
                                    │ id (PK, UUID)       │
                                    │ email (UNIQUE)      │
                                    │ password            │
                                    │ full_name           │
                                    │ national_id         │
                                    │ role (ENUM)         │
                                    │ created_at          │
                                    │ updated_at          │
                                    └─────────────────────┘
                                            ▲ │
                           ┌────────────────┘ │
                           │                  │
                           │1                 │M (created_by)
                           │              (1:M)
                    ┌──────┴──────────────────┴───────────┐
                    │         ELECTIONS                  │
                    ├──────────────────────────────────┤
                    │ id (PK, UUID)                    │
                    │ created_by (FK) ────────→ USERS │
                    │ title                            │
                    │ description                      │
                    │ start_date                       │
                    │ end_date                         │
                    │ status (ENUM)                    │
                    │ created_at                       │
                    │ updated_at                       │
                    └──────────────────────────────────┘
                             │
                    ┌────────┴────────────┬──────────────────┐
                    │                     │                  │
                   1│M                   1│M                │M
                (1:M)                  (1:M)              (1:M)
                    │                     │                  │
                    ▼                     ▼                  ▼
            ┌─────────────────┐  ┌─────────────────┐   ┌──────────────┐
            │  CANDIDATES     │  │    VOTES        │   │AUDIT_LOGS    │
            ├─────────────────┤  ├─────────────────┤   ├──────────────┤
            │ id (PK, UUID)   │  │ id (PK, UUID)   │   │ id (PK)      │
            │ election_id (FK)├──→ election_id (FK)│   │ user_id (FK) │
            │ name            │  │ user_id (FK)────┼──→ action       │
            │ party           │  │ candidate_id(FK)├──→ entity_type  │
            │ bio             │  │ created_at      │   │ entity_id    │
            │ votes           │  │ UQ:(user_id,    │   │ old_value    │
            │ created_at      │  │    election_id) │   │ new_value    │
            │ updated_at      │  └─────────────────┘   │ created_at   │
            └─────────────────┘                         └──────────────┘
                     ▲
                     │1M
                     └─ (1 candidate : M votes)
```

---

## Data Flow & Relationships Summary

| From Entity | To Entity | Type | Relationship | Constraint |
|---|---|---|---|---|
| USERS | ELECTIONS | 1:M | User creates elections | Foreign Key (created_by) |
| USERS | VOTES | 1:M | User casts votes | Foreign Key (user_id) |
| USERS | AUDIT_LOGS | 1:M | User performs actions | Foreign Key (user_id, optional) |
| ELECTIONS | CANDIDATES | 1:M | Election has candidates | Foreign Key (election_id) |
| ELECTIONS | VOTES | 1:M | Election receives votes | Foreign Key (election_id) |
| CANDIDATES | VOTES | 1:M | Candidate receives votes | Foreign Key (candidate_id) |
| USERS | CANDIDATES | - | Indirect (via VOTES) | N/A |

---

## Key Features

### Constraints & Integrity
1. **Primary Keys**: UUID v4 for all entities
2. **Foreign Keys**: Enforce referential integrity with CASCADE DELETE
3. **Unique Constraints**: 
   - User email (one email per user)
   - National ID (one per user)
   - User-Election combination in VOTES (prevents duplicate voting)

### Indexes for Performance
- `idx_elections_status` - Quick election status queries
- `idx_candidates_election` - Fast candidate lookup by election
- `idx_votes_user` - User voting history
- `idx_votes_election` - Election results
- `idx_audit_user` - User activity tracking
- `idx_audit_entity` - Entity change tracking

### Security Features
1. **Audit Logging**: All actions recorded with timestamps
2. **Duplicate Vote Prevention**: Unique constraint on (user_id, election_id)
3. **Data Integrity**: Foreign key constraints with cascading deletes
4. **Timestamps**: created_at and updated_at for tracking changes

---

## Database Design Decisions

### Why this schema?
1. **Normalization**: Follows 3NF to minimize data redundancy
2. **Scalability**: Can handle thousands of elections and millions of votes
3. **Security**: Audit trail for accountability
4. **Performance**: Indexes on frequently queried columns
5. **Flexibility**: JSON fields in audit logs for capturing any data changes

### Performance Considerations
- Vote counting aggregates to CANDIDATES.votes for O(1) retrieval
- Indexes on foreign keys for faster JOINs
- Composite unique index on (user_id, election_id) prevents duplicate voting efficiently
