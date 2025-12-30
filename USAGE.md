# Usage Guide - Secure Blue Voting System

Complete guide to using the Secure Blue Voting System as an administrator and voter.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles & Permissions](#user-roles--permissions)
3. [For Voters](#for-voters)
4. [For Administrators](#for-administrators)
5. [Common Tasks](#common-tasks)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)

---

## Getting Started

### Accessing the Application

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:5000
   ```

3. **You should see the home page** with two buttons:
   - Login
   - Sign Up

### Default Admin Credentials

- **Email:** admin@example.com
- **Password:** admin123

> ⚠️ **IMPORTANT:** Change these credentials immediately in production!

---

## User Roles & Permissions

### Admin Role

**Permissions:**
- ✅ Create and manage elections
- ✅ Add and remove candidates
- ✅ Set election dates and status
- ✅ View voting results in real-time
- ✅ Access audit logs
- ✅ Manage user accounts
- ✅ Reset user passwords
- ✅ View system statistics

**Dashboard Access:** Admin Dashboard at `/admin`

### Voter Role

**Permissions:**
- ✅ Register and create account
- ✅ Login to the system
- ✅ View active elections
- ✅ Vote in elections (one vote per election)
- ✅ View election results
- ✅ Update profile information

**Dashboard Access:** User Dashboard at `/user`

### Guest (Unauthenticated)

**Permissions:**
- ✅ View home page
- ✅ Register new account
- ✅ Login
- ❌ Access admin features
- ❌ Vote in elections

---

## For Voters

### 1. Creating an Account (Sign Up)

**Step-by-step:**

1. Go to `http://localhost:5000`
2. Click **"Sign Up"** button
3. Fill in the form:
   - **Full Name:** Your complete name (e.g., "John Smith")
   - **Email:** Valid email address (e.g., "john@example.com")
   - **National ID:** Your identification number (e.g., "12345678")
   - **Password:** Strong password (min 8 characters, mix of letters, numbers, symbols)
   - **Confirm Password:** Re-enter your password
4. Click **"Sign Up"**
5. Wait for confirmation message
6. You can now login with your credentials

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&*)

### 2. Logging In

**Step-by-step:**

1. Go to `http://localhost:5000`
2. Click **"Login"** button
3. Enter your credentials:
   - **Email:** Your registered email
   - **Password:** Your password
4. Click **"Sign In"**
5. You'll be taken to the voter dashboard

**If login fails:**
- Verify your email and password are correct
- Ensure CAPS LOCK is off
- Check if your account has been created
- Contact administrator if account issues persist

### 3. Viewing Elections

**On the voter dashboard:**

1. You'll see a list of **active elections**
2. Each election shows:
   - Election title
   - Description
   - Start and end dates
   - Number of candidates
   - Your voting status (voted/not voted)

**Filter elections:**
- Click on an election to view details
- See all candidates for that election
- Check election timeline

### 4. Casting a Vote

**Step-by-step:**

1. From the voter dashboard, select an election
2. View all candidates
3. Click on your preferred candidate
4. Review your selection
5. Click **"Confirm Vote"**
6. Read the confirmation message: *"Your vote has been recorded securely"*

**Important:**
- ⚠️ **You can only vote ONCE per election**
- ⚠️ **You CANNOT change your vote** after voting
- ✅ Your vote is secure and anonymous (except for audit logs)
- ✅ Vote timestamp is recorded for security

### 5. Viewing Results

**Step-by-step:**

1. Go to the voter dashboard
2. Click on any election (voted or not voted)
3. Scroll down to **"Results"** section
4. View statistics:
   - Vote count per candidate
   - Percentage of votes
   - Total votes cast
   - Real-time updates

**Results visibility:**
- Results are available for all elections
- Results update in real-time as votes are cast
- Historical results are archived

### 6. Updating Your Profile

**Step-by-step:**

1. Click **"Profile"** or your name in the dashboard
2. View your account information:
   - Full Name
   - Email
   - National ID
   - Account creation date
3. Edit fields (if allowed)
4. Click **"Save Changes"**
5. Verify changes took effect

**Editable Fields:**
- Full Name
- Password (requires current password)

**Non-Editable Fields:**
- Email (contact admin to change)
- National ID (for security)

---

## For Administrators

### 1. Admin Dashboard Overview

**Access:** Login with admin credentials, then go to `/admin`

**Dashboard sections:**

1. **Elections Management** - Create, edit, delete elections
2. **Candidates Management** - Add, edit, remove candidates
3. **Results & Analytics** - View voting statistics
4. **User Management** - Manage voter accounts
5. **Audit Logs** - View system activity and security logs
6. **System Status** - Database and server health

### 2. Creating an Election

**Step-by-step:**

1. Go to **Admin Dashboard** → **Elections**
2. Click **"Create New Election"** button
3. Fill in the election details:
   - **Election Title:** (e.g., "2024 Presidential Election")
   - **Description:** (e.g., "Vote for your preferred candidate")
   - **Start Date & Time:** When voting opens
   - **End Date & Time:** When voting closes
   - **Election Type:** (e.g., "Presidential", "Local", etc.)
4. Click **"Create Election"**
5. Election is now created and ready for candidates

**Election Status:**
- **Draft** - Not yet open for voting
- **Active** - Open for voting
- **Closed** - Voting has ended
- **Archived** - Historical election

### 3. Managing Candidates

#### Adding Candidates

**Step-by-step:**

1. Go to **Admin Dashboard** → **Elections**
2. Select an election
3. Click **"Add Candidate"** button
4. Fill in candidate details:
   - **Name:** Candidate full name
   - **Party:** Political party/affiliation
   - **Description:** Brief bio or platform
   - **Photo URL:** (optional)
5. Click **"Add Candidate"**
6. Candidate appears in the election

#### Editing Candidates

1. Select the election
2. Click **"Edit"** next to candidate name
3. Modify details
4. Click **"Save"**

#### Removing Candidates

1. Select the election
2. Click **"Delete"** next to candidate
3. Confirm deletion
4. Candidate is removed (votes are preserved for audit purposes)

### 4. Managing Election Dates & Status

**Step-by-step:**

1. Go to **Admin Dashboard** → **Elections**
2. Click on election name
3. Click **"Edit"**
4. Modify:
   - **Start Date:** Change when voting begins
   - **End Date:** Change when voting ends
   - **Status:** Set to Active/Closed/Draft
5. Click **"Save Changes"**
6. Changes take effect immediately

**Timeline Rules:**
- Start date must be before end date
- Cannot close election before start date
- Active elections show in voter dashboard
- Closed elections show results only

### 5. Viewing Results & Analytics

**Step-by-step:**

1. Go to **Admin Dashboard** → **Results**
2. Select election from list
3. View comprehensive statistics:
   - **Total Votes:** Number of votes cast
   - **Voter Turnout:** Percentage of registered voters
   - **Vote Distribution:** Votes per candidate
   - **Charts & Graphs:** Visual representation

**Real-time Monitoring:**
- Results update as votes are cast
- Refresh page for latest data
- Export results as CSV/PDF (if available)

**Analytics Available:**
- Votes per candidate
- Vote percentages
- Voting timeline
- Voter demographics (if collected)

### 6. User Management

#### Viewing Users

**Step-by-step:**

1. Go to **Admin Dashboard** → **Users**
2. View list of all registered voters:
   - Name
   - Email
   - National ID
   - Registration date
   - Account status

#### Resetting User Password

**Step-by-step:**

1. Go to **Admin Dashboard** → **Users**
2. Find the user in the list
3. Click **"Reset Password"**
4. System generates temporary password
5. Share password with user securely
6. User can login and change password

#### Disabling/Enabling Accounts

**Step-by-step:**

1. Go to **Admin Dashboard** → **Users**
2. Click **"Disable"** or **"Enable"** next to user
3. Disabled users cannot login
4. Disabled accounts keep their votes (audit trail)

#### Deleting User Accounts

⚠️ **Caution:** Only delete if absolutely necessary

1. Go to **Admin Dashboard** → **Users**
2. Click **"Delete"** next to user
3. Confirm deletion
4. **Note:** Votes from deleted users are preserved for audit purposes

### 7. Accessing Audit Logs

**Step-by-step:**

1. Go to **Admin Dashboard** → **Audit Logs**
2. View all system activities:
   - User logins
   - Vote recordings
   - Admin actions
   - System errors
3. Filter by:
   - Date range
   - Action type
   - User
   - Status

**Log Information:**
- Timestamp (exact time)
- User who performed action
- Action type
- Details of action
- IP address (if tracked)
- Status (success/failure)

**Security Applications:**
- Detect suspicious activity
- Track data modifications
- Audit compliance
- Forensic investigation
- Security review

---

## Common Tasks

### Task 1: Set Up a Complete Election

**Scenario:** Create and run a presidential election

**Steps:**

1. **Create Election**
   - Title: "2024 Presidential Election"
   - Start: Tomorrow at 9:00 AM
   - End: Next day at 5:00 PM

2. **Add Candidates**
   - Candidate 1: John Smith (Party A)
   - Candidate 2: Jane Doe (Party B)
   - Candidate 3: Bob Johnson (Party C)

3. **Activate Election**
   - Set status to "Active" at start time
   - Voters can now vote

4. **Monitor Progress**
   - Watch real-time results
   - Check audit logs for suspicious activity

5. **Close Election**
   - At end time, set status to "Closed"
   - Voters cannot vote anymore

6. **Announce Results**
   - View final results
   - Export results report
   - Archive election

### Task 2: Manage a Large Number of Voters

**Scenario:** Handle elections with thousands of voters

**Best Practices:**

1. **Before Election Day:**
   - Test system with load testing
   - Ensure database has sufficient capacity
   - Create user accounts in advance
   - Provide login credentials securely

2. **During Election:**
   - Monitor server performance
   - Check database connections
   - Watch audit logs for errors
   - Have support team ready

3. **After Election:**
   - Backup database
   - Archive results
   - Review audit logs
   - Generate compliance report

### Task 3: Troubleshoot Voting Issues

**Scenario:** Voter reports they cannot vote

**Steps:**

1. **Check if voter voted**
   - Go to **Audit Logs**
   - Search for voter's name
   - See if vote was recorded

2. **If vote shows in logs:**
   - Explain to voter they already voted
   - Show them vote timestamp

3. **If no vote recorded:**
   - Check if election is active
   - Check voter status (not disabled)
   - Check browser console for errors
   - Suggest clearing browser cache and trying again

4. **If still failing:**
   - Check server logs
   - Check database connection
   - Contact technical support

---

## API Reference

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: {...} }
```

#### Register
```
POST /api/auth/register
Body: { 
  full_name: string, 
  email: string, 
  national_id: string,
  password: string 
}
Response: { success: true, message: string }
```

#### Logout
```
POST /api/auth/logout
Response: { success: true }
```

### Election Endpoints

#### List Elections
```
GET /api/elections
Response: [{ id, title, description, start_date, end_date, status }]
```

#### Get Election Details
```
GET /api/elections/:id
Response: { id, title, candidates: [...], results: {...} }
```

#### Create Election (Admin only)
```
POST /api/elections/admin/create
Body: { title, description, start_date, end_date }
Response: { id, ...election }
```

#### Update Election (Admin only)
```
PUT /api/elections/admin/:id
Body: { title, description, start_date, end_date, status }
Response: { success: true, election: {...} }
```

### Voting Endpoints

#### Cast Vote
```
POST /api/votes/cast
Body: { election_id: string, candidate_id: string }
Response: { success: true, message: "Vote recorded" }
```

#### Get Results
```
GET /api/elections/:id/results
Response: { 
  candidates: [
    { name: string, votes: number, percentage: number }
  ],
  total_votes: number
}
```

### User Endpoints

#### Get User Profile
```
GET /api/users/profile
Response: { id, name, email, national_id, role }
```

#### Update Profile
```
PUT /api/users/profile
Body: { name: string, password: string }
Response: { success: true, user: {...} }
```

---

## Best Practices

### For Voters

1. **Security:**
   - ✅ Use a strong, unique password
   - ✅ Don't share your login credentials
   - ✅ Log out when finished voting
   - ✅ Close browser window after voting
   - ❌ Don't vote on public computers without clearing cache

2. **Voting:**
   - ✅ Review your selection before confirming
   - ✅ Vote before the election closes
   - ✅ Keep your National ID safe
   - ❌ Don't share your voting choice if privacy is a concern

3. **Account:**
   - ✅ Keep your email address current
   - ✅ Use a memorable password
   - ✅ Update profile if information changes
   - ❌ Don't use your National ID as your password

### For Administrators

1. **Security:**
   - ✅ Change default admin password immediately
   - ✅ Use strong admin passwords
   - ✅ Limit admin account access
   - ✅ Regularly review audit logs
   - ✅ Backup database regularly
   - ❌ Don't share admin credentials
   - ❌ Don't vote in elections you're administering

2. **Election Management:**
   - ✅ Test elections before going live
   - ✅ Create clear election descriptions
   - ✅ Set realistic election dates
   - ✅ Add all candidates before opening election
   - ✅ Announce election details to voters
   - ❌ Don't change election rules mid-voting

3. **Data Integrity:**
   - ✅ Backup database before major changes
   - ✅ Keep audit logs for compliance
   - ✅ Verify vote counts match audit trail
   - ✅ Archive closed elections
   - ❌ Don't manually modify vote counts
   - ❌ Don't delete votes without documentation

4. **Support:**
   - ✅ Respond to user issues promptly
   - ✅ Document all support tickets
   - ✅ Provide clear instructions to voters
   - ✅ Test system before election day
   - ✅ Have backup systems ready

---

## Troubleshooting

### "Cannot vote - election not found"
- Ensure election exists and is active
- Refresh the page
- Check election start/end dates

### "Vote already cast for this election"
- You have already voted in this election
- Votes cannot be changed
- Contact admin if you believe this is an error

### "Invalid credentials"
- Check email and password
- Verify CAPS LOCK is off
- Ensure account is registered
- Reset password if forgotten

### "Server error - try again"
- Refresh the page
- Clear browser cache
- Try in incognito/private mode
- Contact administrator

### "Database connection failed"
- Admin issue - contact system administrator
- Check if server is running (`npm run dev`)
- Verify MySQL database is running
- Check `.env` configuration

---

## Additional Resources

- [README.md](README.md) - Project overview
- [INSTALLATION.md](INSTALLATION.md) - Installation guide
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database information
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Code examples

---

## Support & Feedback

For issues or suggestions:
1. Check this guide for solutions
2. Review [Troubleshooting](#troubleshooting) section
3. Check application logs (F12 → Console)
4. Contact administrator
5. Open GitHub issue with details

---

**Last Updated:** December 2024
**Version:** 1.0.0
