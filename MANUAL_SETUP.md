# 📋 Manual Database Setup Guide

Since MySQL connection via Node.js has timeout issues, let's create the database manually using MySQL command.

## Step 1: Find MySQL Command Line

You installed MySQL at: `E:\Tools\mysql`

But we need to find where the actual MySQL executable is. Let me check...

## Step 2: Alternative - Use .env and Skip Schema Import

For now, let's:

1. Copy `.env.example` to `.env`
2. Edit `.env` with:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=MyPassword123
DB_NAME=secure_voting_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
```

3. Try to start the server - it might work even without the schema imported

Let me help you with this instead.
