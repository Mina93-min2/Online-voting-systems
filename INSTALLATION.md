# Installation Guide - Secure Blue Voting System

Complete step-by-step guide to install and run the Secure Blue Voting System.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-Installation Checklist](#pre-installation-checklist)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [Starting the Server](#starting-the-server)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

| Component | Requirement | Recommended |
|-----------|-----------|------------|
| **OS** | Windows 10+, macOS 10.14+, Linux | Windows 11 / macOS 12+ / Ubuntu 20.04+ |
| **RAM** | 4 GB | 8 GB |
| **Disk Space** | 500 MB | 2 GB |
| **Node.js** | v14.0.0+ | v16.0.0+ or v18.0.0+ |
| **MySQL** | 5.7+ | 8.0+ |
| **npm** | v6.0.0+ | v7.0.0+ or v8.0.0+ |

### Network Requirements

- Internet connection for initial npm install
- Ability to use localhost ports 3306 (MySQL) and 5000 (Node.js)
- Firewall configured to allow local connections

---

## Pre-Installation Checklist

### Step 1: Verify Node.js Installation

Open Command Prompt/Terminal and check Node.js version:

```bash
node --version
npm --version
```

**Expected output:** v14.0.0 or higher

If not installed, download from [https://nodejs.org/](https://nodejs.org/)

### Step 2: Verify MySQL Installation

```bash
mysql --version
```

**Expected output:** mysql Ver 8.0.x or 5.7.x

If not installed, download from [https://www.mysql.com/downloads/mysql/](https://www.mysql.com/downloads/mysql/)

### Step 3: Verify Git Installation

```bash
git --version
```

If not installed, download from [https://git-scm.com/](https://git-scm.com/)

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd your-projects-folder

# Clone the repository
git clone https://github.com/Mina93-min2/Online-voting-systems.git

# Enter the project directory
cd Online-voting-systems
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. The process may take 2-5 minutes.

**Packages installed:**
- express (web framework)
- mysql2 (database driver)
- bcrypt (password hashing)
- cors (cross-origin support)
- helmet (security headers)
- dotenv (environment variables)
- uuid (ID generation)
- nodemon (development tool)

### Step 3: Verify Installation

```bash
npm list
```

Should show a tree of installed packages without errors.

---

## Database Setup

### Step 1: Start MySQL Server

#### On Windows:
```bash
# If installed as service, it should auto-start
# To verify:
mysql -u root -p -e "SELECT 1"
```

#### On macOS:
```bash
# Using Homebrew
brew services start mysql

# Verify
mysql -u root -e "SELECT 1"
```

#### On Linux:
```bash
# Using systemctl
sudo systemctl start mysql

# Verify
sudo mysql -e "SELECT 1"
```

### Step 2: Create Database User (Recommended)

Create a dedicated user for the application (instead of using root):

```bash
# Connect to MySQL as root
mysql -u root -p

# Execute these commands in MySQL console:
```

```sql
-- Create database
CREATE DATABASE voting_system;

-- Create user with password
CREATE USER 'voting_app'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON voting_system.* TO 'voting_app'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 3: Import Database Schema

```bash
# Import the schema file
mysql -u voting_app -p voting_system < database/schema.sql

# Enter password: your_secure_password_here
```

**Verify tables were created:**

```bash
mysql -u voting_app -p voting_system -e "SHOW TABLES;"
```

Should display:
```
+------------------------+
| Tables_in_voting_system |
+------------------------+
| audit_logs             |
| candidates             |
| elections              |
| users                  |
| votes                  |
+------------------------+
```

### Step 4: Initialize Default Admin User

Run the admin initialization script:

```bash
# On Windows
node reset-admin.js

# On macOS/Linux
node reset-admin.js
```

**Expected output:**
```
✅ Admin account reset successfully
Default credentials:
  Email: admin@example.com
  Password: admin123
```

---

## Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 2: Edit .env File

Open `.env` with your text editor and configure:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=voting_app
DB_PASSWORD=your_secure_password_here
DB_NAME=voting_system
DB_PORT=3306

# Server Configuration
NODE_ENV=development
PORT=5000

# Session Secret (generate random string)
SESSION_SECRET=your_random_secret_key_here

# Optional: Email Configuration (for future features)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASSWORD=your_app_password
```

### Step 3: Secure Your Credentials

**Important:** Never commit `.env` to version control!

The `.env` file is already in `.gitignore`, but verify:

```bash
cat .gitignore | grep env
```

Should show `.env` in the list.

---

## Starting the Server

### Development Mode (with Auto-Reload)

```bash
npm run dev
```

**Output should show:**
```
Server running on http://localhost:5000
Database connected successfully
```

Press `Ctrl+C` to stop the server.

### Production Mode

```bash
npm start
```

---

## Verification

### Step 1: Access the Web Interface

Open browser and navigate to:

```
http://localhost:5000
```

You should see the Secure Blue Voting System home page.

### Step 2: Test Admin Login

1. Click "Login"
2. Enter credentials:
   - **Email:** admin@example.com
   - **Password:** admin123
3. You should be redirected to the admin dashboard

### Step 3: Test User Registration

1. Click "Sign Up"
2. Enter:
   - Full Name: Test User
   - Email: testuser@example.com
   - National ID: 12345678
   - Password: testpass123
3. Click "Sign Up"
4. Login with new credentials

### Step 4: Test Voting (if elections exist)

1. Login as user
2. Browse elections
3. Cast a test vote
4. Verify vote is recorded

---

## Troubleshooting

### Issue 1: MySQL Connection Error

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**

```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# If failed, start MySQL
# Windows: Services > MySQL
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```

### Issue 2: Port Already in Use

**Error Message:**
```
listen EADDRINUSE :::5000
```

**Solution:**

**Option 1:** Change port in `.env`
```env
PORT=5001
```

**Option 2:** Kill process using port
```bash
# Windows (PowerShell as Admin)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 3: npm install Fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# If still fails, try:
npm install --legacy-peer-deps
```

### Issue 4: Database Schema Import Failed

**Error:**
```
ERROR 1064 (42000)
```

**Solution:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# If not, create it
mysql -u root -p voting_system < database/schema.sql

# Or manually create:
mysql -u root -p
CREATE DATABASE voting_system;
USE voting_system;
SOURCE database/schema.sql;
EXIT;
```

### Issue 5: Wrong MySQL Credentials

**Solution:**

1. Verify credentials in `.env`
2. Test connection:
```bash
mysql -u voting_app -p voting_system -e "SELECT 1"
```

3. If password forgotten, reset:
```bash
mysql -u root -p
ALTER USER 'voting_app'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### Issue 6: bcrypt Installation Issues (Windows)

**Error:**
```
gyp ERR! build error
```

**Solution:**

```bash
# Install build tools
npm install --global node-gyp
npm install --global windows-build-tools

# Reinstall bcrypt
npm install bcrypt --save
```

---

## Next Steps

1. **Review Documentation:**
   - [README.md](README.md) - Project overview
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - API reference
   - [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database details

2. **Customize Application:**
   - Edit `views/index.html` for styling
   - Modify `public/css/style.css` for branding
   - Update `public/js/app.js` for custom functionality

3. **Deploy to Production:**
   - Choose hosting provider (Heroku, AWS, DigitalOcean, etc.)
   - Configure environment variables
   - Set up SSL/HTTPS
   - Configure database backups

4. **Security Hardening:**
   - Change all default credentials
   - Enable email verification
   - Configure HTTPS
   - Set up database backups
   - Review audit logs regularly

---

## Support

If you encounter issues not covered here:

1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs in console
3. Check `.env` configuration
4. Verify database connection
5. Open an issue on GitHub

---

## Version History

- **v1.0.0** (Current) - MySQL database integration
- **v0.9.0** - Initial release with file-based storage

---

## Need Help?

For additional support:
- GitHub Issues: [Project Issues](https://github.com/Mina93-min2/Online-voting-systems/issues)
- Documentation: See related `.md` files in project root
- Contact: Create an issue with detailed error information
