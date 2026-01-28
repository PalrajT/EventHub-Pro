# � EventHub Pro

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

---

Built with ❤️ using MERN Stack

**MongoDB Connection Error:**
- Ensure MongoDB is running locally
- Check connection string in `.env`
- For Atlas, verify IP whitelist

**CORS Issues:**
- Verify frontend proxy in `package.json`
- Check backend CORS configuration

**Port Already in Use:**
- Change PORT in backend `.env`
- Update proxy in frontend `package.json`

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
