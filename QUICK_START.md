# Quick Start Guide - Secure Blue Voting System

Get the Secure Blue Voting System up and running in 5 minutes!

---

## ⚡ Super Quick Start (5 minutes)

### 1. Prerequisites (Already Installed?)

```bash
# Check Node.js
node --version  # Should be v14+

# Check npm
npm --version   # Should be v6+

# Check MySQL
mysql --version # Should be v5.7+
```

Not installed? [Full Installation Guide](INSTALLATION.md)

### 2. Clone & Install

```bash
git clone https://github.com/Mina93-min2/Online-voting-systems.git
cd Online-voting-systems
npm install
```

### 3. Setup Database

```bash
# Copy environment file
cp .env.example .env

# Update .env with your MySQL credentials
# Then import the database schema
mysql -u root -p voting_system < database/schema.sql

# Initialize admin account
node reset-admin.js
```

### 4. Start Server

```bash
npm run dev
```

### 5. Open Browser

```
http://localhost:5000
```

**Done! ✅** Login with:
- Email: `admin@example.com`
- Password: `admin123`

---

## 🎯 What Can You Do?

### As Admin
- ✅ Create elections
- ✅ Add candidates
- ✅ View results
- ✅ Manage voters

### As Voter
- ✅ Sign up
- ✅ Vote in elections
- ✅ View results

---

## 📚 Need More Help?

| Task | Reference |
|------|-----------|
| **Detailed Setup** | [INSTALLATION.md](INSTALLATION.md) |
| **How to Use** | [USAGE.md](USAGE.md) |
| **Database Info** | [DATABASE_SETUP.md](DATABASE_SETUP.md) |
| **API Reference** | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| **Project Overview** | [README.md](README.md) |

---

## 🚨 Common Issues?

### MySQL Connection Failed
```bash
# Make sure MySQL is running
mysql -u root -p -e "SELECT 1"
```

### Port Already in Use
Edit `.env`:
```env
PORT=5001  # Change to different port
```

### Database Schema Failed
```bash
# Create database first
mysql -u root -p
CREATE DATABASE voting_system;
EXIT;

# Then import
mysql -u root -p voting_system < database/schema.sql
```

### npm install Failed
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Next Steps

1. **Create an election** in the admin dashboard
2. **Add some candidates**
3. **Sign up as a voter**
4. **Cast a test vote**
5. **View results**

---

## 🔗 Links

- 📖 [Full Documentation](README.md)
- 🔧 [Installation Guide](INSTALLATION.md)
- 📝 [Usage Guide](USAGE.md)
- 💾 [Database Guide](DATABASE_SETUP.md)
- 🔌 [API Reference](QUICK_REFERENCE.md)

---

**Version:** 1.0.0  
**License:** MIT  
**GitHub:** [Online-voting-systems](https://github.com/Mina93-min2/Online-voting-systems)
