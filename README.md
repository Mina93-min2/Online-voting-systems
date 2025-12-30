# 🗳️ Secure Blue Voting System

A modern, secure online voting system built with Node.js and Express, featuring user authentication, real-time voting, and an intuitive admin dashboard. This system uses MySQL for robust data management with complete audit logging.

## ✨ Features

- 🔐 **User Authentication** - Secure login and sign-up system with role-based access
- 📝 **Voter Registration** - Users can register with National ID verification
- 🗳️ **Electronic Voting** - Cast votes for candidates in multiple elections
- 👨‍💼 **Admin Dashboard** - Manage elections, candidates, and view results
- 🎨 **Beautiful UI** - Modern, animated interface with interactive mouse effects
- 📊 **Real-time Results** - View voting results as they come in
- 🗄️ **MySQL Database** - Professional database with complete schema and audit logging
- 🔒 **Advanced Security** - Bcrypt password hashing, CORS, Helmet security headers

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MySQL Server** 5.7 or higher ([Download](https://www.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/))

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Mina93-min2/Online-voting-systems.git
cd Online-voting-systems
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- **express** - Web framework
- **mysql2** - MySQL database driver
- **bcrypt** - Password hashing
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **dotenv** - Environment variables
- **uuid** - Unique identifiers
- **nodemon** (dev) - Auto-restart development server

#### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=voting_system
DB_PORT=3306
NODE_ENV=development
PORT=5000
```

#### 4. Set Up the Database

Create the MySQL database and tables:

```bash
# Connect to MySQL
mysql -u root -p

# Inside MySQL console, run:
CREATE DATABASE voting_system;
USE voting_system;
SOURCE database/schema.sql;
EXIT;
```

**Alternative:** Run the schema directly:

```bash
mysql -u root -p voting_system < database/schema.sql
```

#### 5. Start the Server

**Development Mode** (with auto-restart):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

#### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🔑 Default Credentials

### Admin Account
- **Username/Email:** admin@example.com
- **Password:** admin123
- **Role:** Administrator

### Test User Account
- **Username/Email:** user@example.com
- **Password:** user123
- **Role:** Voter

> ⚠️ **Important:** Change default credentials in production!

---

## 📁 Project Structure

```
secure-blue-voting-backend/
├── config/
│   └── database.js                    # MySQL connection configuration
├── controllers/
│   └── electionController.js          # Business logic for elections
├── models/
│   ├── userModel.js                   # User management
│   ├── electionModelDB.js             # Election operations
│   └── auditModel.js                  # Audit logging
├── routes/
│   └── electionRoutes.js              # API endpoints
├── views/
│   ├── index.html                     # Home page
│   ├── admin.html                     # Admin dashboard
│   └── user.html                      # User voting page
├── public/
│   ├── css/
│   │   └── style.css                  # Styling
│   └── js/
│       └── app.js                     # Client-side logic
├── database/
│   └── schema.sql                     # Database schema
├── server.js                          # Main server file
├── package.json                       # Dependencies
├── .env.example                       # Environment template
└── README.md                          # This file
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MySQL** | Relational database |
| **bcrypt** | Password hashing |
| **Helmet** | Security headers |
| **CORS** | Cross-origin requests |
| **HTML5/CSS3** | Frontend |
| **Vanilla JavaScript** | Client-side scripting |

---

## 📖 Usage Guide

### For Voters

1. **Sign Up / Register**
   - Click "Sign Up" on the home page
   - Enter your full name, email, and National ID
   - Create a password
   - Verify your email (if enabled)

2. **Login**
   - Use your email and password
   - You'll be redirected to the voting dashboard

3. **Vote**
   - Browse available elections
   - Select an election
   - Choose your preferred candidate
   - Confirm your vote
   - Your vote is recorded securely

4. **View Results**
   - Check election results in real-time
   - See vote counts and percentages

### For Administrators

1. **Login**
   - Use admin email and password
   - Access the admin dashboard

2. **Manage Elections**
   - Create new elections
   - Set election title, description, and dates
   - Activate/deactivate elections

3. **Manage Candidates**
   - Add candidates to elections
   - Edit candidate information
   - Remove candidates if needed

4. **Monitor Results**
   - View live voting statistics
   - Export results if needed
   - Access audit logs for security review

5. **System Management**
   - Manage user accounts
   - Reset user passwords
   - View system audit logs
   - Monitor database health

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ Role-based access control (Admin/User)
- ✅ Bcrypt password hashing (salted)
- ✅ Session management
- ✅ Email verification support

### API Security
- ✅ Helmet.js for HTTP security headers
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ HTTPS ready

### Data Protection
- ✅ Encrypted password storage
- ✅ Secure database connections
- ✅ Audit logging for all critical operations
- ✅ National ID verification
- ✅ Vote encryption support

### Best Practices
- ✅ Environment variables for sensitive data
- ✅ No hardcoded credentials
- ✅ Regular security updates
- ✅ Error handling without exposing details

---

## 🗄️ Database Schema

The system includes 5 main tables:

### 1. Users Table
- Stores user account information
- Fields: id, email, password, full_name, national_id, role, created_at, updated_at

### 2. Elections Table
- Manages election events
- Fields: id, title, description, start_date, end_date, status, created_at, updated_at

### 3. Candidates Table
- Stores candidate information
- Fields: id, election_id, name, description, votes, created_at, updated_at

### 4. Votes Table
- Records individual votes (audit trail)
- Fields: id, user_id, election_id, candidate_id, created_at

### 5. Audit Logs Table
- Security and activity logging
- Fields: id, action, user_id, details, timestamp

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed information.

---

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify .env credentials
cat .env
```

### Port Already in Use
```bash
# Change port in .env file
PORT=5001
```

### Dependencies Issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied on Reset
```bash
# Run with appropriate permissions
sudo node reset-admin.js
```

---

## 📚 Additional Documentation

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database installation and configuration
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick code examples and API reference
- [ERD.md](ERD.md) - Entity Relationship Diagram details
- [DATABASE_INTEGRATION_SUMMARY.md](DATABASE_INTEGRATION_SUMMARY.md) - Integration overview

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Created with ❤️ for secure online voting

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

## ⚠️ Disclaimer

This is an educational project. For production use in real elections, please consult with election officials and security experts to ensure compliance with local laws and security standards.
- CORS protection
- Input validation
- National ID registration requirement

## 📝 API Endpoints

- `POST /api/login` - User authentication
- `POST /api/signup` - User registration
- `GET /api/elections` - Get all elections
- `POST /api/elections` - Create new election (Admin)
- `POST /api/vote` - Cast a vote
- `DELETE /api/elections/:id` - Delete election (Admin)

## 🌐 Deployment

This application can be deployed to:
- Render
- Railway
- Heroku
- Vercel
- Any Node.js hosting platform

## 📄 License

MIT License

## 👥 Author

Mina93-min2

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ for secure and transparent elections
