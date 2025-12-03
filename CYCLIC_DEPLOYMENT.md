# Cyclic.sh Deployment Guide

## Quick Deployment Steps

### Step 1: Push Code to GitHub
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Cyclic deployment"
git push origin main
```

### Step 2: Sign Up for Cyclic.sh
1. Go to [https://www.cyclic.sh](https://www.cyclic.sh)
2. Click "Sign Up" or "Get Started"
3. Sign up with GitHub (recommended - easiest way)

### Step 3: Deploy Your App
1. After signing in, click **"New App"** or **"Deploy"**
2. Select your GitHub repository (`smart-service-desk`)
3. Cyclic will auto-detect it's a Node.js app
4. Click **"Deploy"**

### Step 4: Add Environment Variables
1. Go to your app dashboard
2. Click on **"Environment Variables"** or **"Config"**
3. Add these variables:

**MONGO_URI:**
```
mongodb+srv://faisalfansa_db_user:MoKa%402001@smart-service-desk.d5vcula.mongodb.net/smart-service-desk?retryWrites=true&w=majority
```

**JWT_SECRET:**
```
6059067675ef78b921bfd37d428fb154ac629dea3c61ad4c3e61fff72e340b7f
```

4. Save the environment variables
5. The app will automatically redeploy

### Step 5: Test Your Deployment
Once deployed, Cyclic will give you a URL like:
`https://your-app-name.cyclic.app`

Test the health endpoint:
`https://your-app-name.cyclic.app/health`

You should see:
```json
{"message":"Server is running","status":"healthy"}
```

---

## Important Notes

### Socket.io on Cyclic.sh
- Socket.io should work, but there may be limitations on serverless platforms
- If you experience issues with real-time features, you might need to configure Socket.io for serverless environments

### File Uploads
- The `uploads` folder is ephemeral on serverless platforms
- Consider using cloud storage (AWS S3, Cloudinary) for production file uploads
- For now, uploads will work but won't persist across deployments

### Free Tier Limits
- ✅ No credit card required
- ✅ Free SSL/HTTPS
- ✅ Automatic deployments from GitHub
- ⚠️ May have cold starts (first request after inactivity takes longer)
- ⚠️ Limited resources

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify `npm start` command works locally

### Environment Variables Not Working
- Make sure variables are added in Cyclic dashboard
- Redeploy after adding variables

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Cyclic's IPs
- Check connection string is correct (password URL-encoded)

---

## Your Deployment URL
After deployment, your app will be available at:
`https://[your-app-name].cyclic.app`

Update your frontend to use this URL instead of `http://localhost:4000`

