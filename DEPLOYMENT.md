# Deployment Guide

This guide will help you deploy the Smart Service Desk backend to Render.com (free tier).

## Prerequisites

- A GitHub account
- A MongoDB Atlas account (free tier available)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier)
4. Wait for the cluster to be created (2-3 minutes)
5. Click "Connect" on your cluster
6. Choose "Connect your application"
7. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/`)
8. Replace `<password>` with your database user password
9. Replace `<dbname>` with your database name (e.g., `smart-service-desk`)
10. Save this connection string - you'll need it in Step 3

**Important:** Make sure to:
- Add your IP address to the IP Access List (or use `0.0.0.0/0` for development)
- Create a database user with read/write permissions

## Step 2: Prepare Your Code

1. Make sure your code is pushed to a GitHub repository
2. If you haven't already, commit and push your code:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

## Step 3: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign up for a free account (or sign in)
3. Click "New +" → "Web Service"
4. Connect your GitHub account if prompted
5. Select your repository (`smart-service-desk`)
6. Configure the service:
   - **Name:** `smart-service-desk-backend` (or any name you prefer)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** Leave empty (or `.` if needed)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
7. Click "Advanced" and add Environment Variables:
   - `MONGO_URI` = Your MongoDB Atlas connection string from Step 1
   - `JWT_SECRET` = A random secret string (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `NODE_ENV` = `production` (optional)
8. Click "Create Web Service"
9. Wait for deployment to complete (2-5 minutes)

## Step 4: Verify Deployment

1. Once deployed, Render will provide a URL like: `https://smart-service-desk-backend.onrender.com`
2. Test the health endpoint: `https://your-app.onrender.com/health`
3. You should see: `{"message":"Server is running","status":"healthy"}`

## Step 5: Update Your Frontend

Update your frontend API base URL to point to your Render deployment URL instead of `http://localhost:4000`.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string from Atlas |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |
| `PORT` | No | Server port (Render sets this automatically) |
| `NODE_ENV` | No | Set to `production` for production |

## Troubleshooting

### Build Fails
- Check that `package.json` has the correct `start` script
- Verify all dependencies are listed in `package.json`

### Application Crashes
- Check logs in Render dashboard
- Verify `MONGO_URI` is correct and accessible
- Ensure `JWT_SECRET` is set

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Render's IPs
- Check that database user has correct permissions
- Ensure connection string is correct

### Socket.io Issues
- Render free tier supports WebSockets, but there may be connection limits
- Consider upgrading if you need persistent connections

## Free Tier Limitations

Render free tier includes:
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ⚠️ Spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
- ⚠️ Limited resources (512MB RAM)

## Alternative: Railway.app

If you prefer Railway.app:

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as Render)
6. Railway will auto-detect Node.js and deploy

Railway free tier includes $5 credit/month.

## Need Help?

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Check application logs in Render dashboard for errors

