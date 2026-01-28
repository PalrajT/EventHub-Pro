# Deployment Checklist

## Pre-Deployment

- [ ] Test app locally (both frontend and backend)
- [ ] Commit all changes to Git
- [ ] Push to GitHub repository

## MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Copy connection string

## Backend Deployment (Render)

- [ ] Sign up at Render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET (generate new one)
  - [ ] PORT=5000
  - [ ] NODE_ENV=production
- [ ] Deploy and verify health check
- [ ] Copy backend URL

## Frontend Deployment (Vercel)

- [ ] Sign up at Vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variable:
  - [ ] REACT_APP_API_URL (your Render backend URL)
- [ ] Deploy
- [ ] Verify deployment works

## Post-Deployment Testing

- [ ] Open Vercel URL
- [ ] Test signup/login
- [ ] Create a test event
- [ ] Register for event
- [ ] Verify approval workflow
- [ ] Check ticket generation
- [ ] Test mobile responsiveness

## Monitoring

- [ ] Check Render logs for errors
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up Vercel analytics (optional)

## Share

- [ ] Update GitHub README with live URLs
- [ ] Share event link with users
- [ ] Collect feedback

---

🎉 Your app is live!
