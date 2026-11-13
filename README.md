# Personal Finance Management Web App

A premium full-stack application built using the MERN stack (MongoDB, Express, React, Node.js). 

## Features
* **Custom Vanilla CSS UI**: A premium user interface leveraging glassmorphism, smooth animations, and a rich dark-thematic palette.
* **Authentication**: Robust JWT authentication for individual user scopes.
* **Dashboard Analytics**: Extensive metric aggregations utilizing MongoDB and visual representations via Recharts. 
* **Budget Tracking**: Live progress indicators and warning alerts when approaching set monthly category limits.
* **Recurring Bills**: Reminder tracking with overdue/upcoming tags natively built-in.
* **PDF / CSV Export**: Generate raw financial arrays to local hard drives instantly.

## Setup Instructions

Ensure you have **Node.js** and **MongoDB** (running locally on `mongodb://127.0.0.1:27017`) installed.

### 1. Backend Server Setup
Navigate into the `backend` folder:
```bash
cd backend
npm install
npm run dev # Note: Needs `start` script if dev isn't mounted, or run `node server.js`
```
*The `.env` file containing JWT secrets and DB URI has been pre-configured internally.*

### 2. Frontend React Client Setup
Open a new terminal window and navigate into the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
Navigate to the proxy address (usually `http://localhost:5173`) in your web browser. First-time users will need to click 'Sign up', create an account, and begin transacting!
