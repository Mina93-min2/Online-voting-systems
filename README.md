# 🗳️ Secure Blue Voting System

A modern, secure online voting system built with Node.js and Express, featuring user authentication, real-time voting, and an intuitive admin dashboard.

## ✨ Features

- 🔐 **User Authentication** - Secure login and sign-up system with role-based access
- 📝 **Voter Registration** - Users can register with National ID verification
- 🗳️ **Electronic Voting** - Cast votes for candidates in multiple elections
- 👨‍💼 **Admin Dashboard** - Manage elections, candidates, and view results
- 🎨 **Beautiful UI** - Modern, animated interface with interactive mouse effects
- 📊 **Real-time Results** - View voting results as they come in
- 💾 **File-based Storage** - Simple JSON-based data storage

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mina93-min2/Online-voting-systems.git
cd Online-voting-systems
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## 🔑 Default Credentials

### Admin Account
- **Username:** admin
- **Password:** admin
- **Role:** Admin

### User Account
- **Username:** user
- **Password:** user
- **Role:** Voter

## 📁 Project Structure

```
├── controllers/          # Business logic controllers
├── models/              # Data models
├── routes/              # API routes
├── views/               # HTML pages
├── public/              # Static files (CSS, JS)
│   ├── css/            # Stylesheets
│   └── js/             # Client-side JavaScript
├── data.json           # Elections data
├── users.json          # User accounts
└── server.js           # Main server file
```

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Security:** Helmet, CORS
- **Storage:** JSON file-based storage
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Icons:** Font Awesome

## 🎯 Usage

### For Voters
1. Sign up with your details and National ID
2. Login with your credentials
3. Browse available elections
4. Cast your vote for your preferred candidate
5. View election results

### For Administrators
1. Login with admin credentials
2. Create new elections
3. Add candidates to elections
4. Manage election dates
5. View and monitor voting results
6. Delete elections if needed

## 🔒 Security Features

- Role-based access control (Admin/User)
- Helmet.js for HTTP security headers
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
