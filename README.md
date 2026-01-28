# EventHub Pro

A modern, professional event ticketing platform built with the MERN stack. Organizers can create events and manage registrations with automated or manual approval workflows.

## ✨ Features

**For Organizers:**
- 🔐 Secure authentication (signup/login)
- ✨ Create professional events with rich descriptions
- ⚡ Auto-approval or manual review modes
- 📊 Dashboard with event statistics
- 📋 Registration management interface
- 🔗 One-click shareable event links
- 🎫 Track ticket capacity and sales

**For Attendees:**
- 🌐 Public event registration pages
- 📝 Simple registration form (name, email, phone)
- ✅ Instant or manual approval notifications
- 🔍 Check registration status
- 🎟️ Digital ticket with QR code-ready format
- 🖨️ Printable tickets

**Design:**
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Modern gradient UI with glassmorphism
- ⚡ Fast and intuitive user experience
- ♿ Accessible with proper touch targets

## 🚀 Quick Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install

cd ../frontend
npm install
```

2. **Configure environment:**
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/event-ticketing
JWT_SECRET=your_secret_key_here
PORT=5000
```

3. **Run the application:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

4. **Access:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 🏗️ Tech Stack

**Frontend:** React, React Router, Axios, CSS3  
**Backend:** Node.js, Express, MongoDB, JWT, bcrypt  
**Architecture:** RESTful API, Token-based auth

## 📖 Usage

1. **Sign up** as an organizer
2. **Create an event** with details and approval mode
3. **Share the event link** with attendees
4. **Manage registrations** from your dashboard
5. Attendees receive **digital tickets** upon approval

## 🚀 Deployment Guide

### Free Deployment Setup

Deploy your app using these free platforms:
- **Frontend**: Vercel (unlimited deployments)
- **Backend**: Render (750 hrs/month free)
- **Database**: MongoDB Atlas (512MB free cluster)

### Step 1: Setup MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **FREE cluster** (M0 Sandbox)
3. Create a database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string: `mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/event-ticketing`

### Step 2: Deploy Backend to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name**: eventhub-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI`: (your Atlas connection string)
   - `JWT_SECRET`: (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
7. Deploy and copy your backend URL: `https://eventhub-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Navigate to frontend: `cd frontend`
4. Create `.env.production`:
   ```env
   REACT_APP_API_URL=https://eventhub-backend.onrender.com
   ```
5. Deploy: `vercel --prod`
6. Or connect via [Vercel Dashboard](https://vercel.com/new):
   - Import GitHub repo
   - Set **Root Directory**: `frontend`
   - Add environment variable: `REACT_APP_API_URL` = your backend URL

### Step 4: Update API Configuration

Update `frontend/src/services/api.js` to use environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Sign up as an organizer
3. Create an event
4. Test registration flow

### 🔄 Auto-Deployment

Both platforms support auto-deployment from GitHub:
- Push to `main` branch → automatic deployment
- Pull requests create preview deployments

### 📊 Monitor Your App

- **Render Logs**: Dashboard → Logs tab
- **Vercel Analytics**: Dashboard → Analytics
- **MongoDB Atlas**: Cluster → Metrics

---

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running locally
- Check connection string in `.env`
- For Atlas, verify IP whitelist and database user

**CORS Issues:**
- Verify frontend proxy in `package.json`
- Check backend CORS configuration
- Ensure backend URL is correct in production

**Port Already in Use:**
- Change PORT in backend `.env`
- Update proxy in frontend `package.json`

**Render Free Tier Sleep:**
- Free services sleep after 15 min inactivity
- First request takes 30-60s to wake up
- Consider upgrading or using cron-job.org to ping

---

## 📝 Future Enhancements

- Email notifications for registration status
- QR code generation for tickets
- Event categories and search
- Payment integration
- Event analytics dashboard
- Multiple ticket types per event
- Bulk registration approval

## 👤 Author

Palraj T - MERN Stack Intern Assignment

## 📄 License

This project is created for internship assignment purposes.

---

**Note:** This is a demonstration project for an internship assignment. For production use, additional security measures, error handling, and features should be implemented.
