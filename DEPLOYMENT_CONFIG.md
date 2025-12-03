# Deployment Configuration - READY TO USE

## Your MongoDB Connection String

**IMPORTANT:** Your password contains special characters that need to be URL-encoded in the connection string.

### Formatted Connection String:
```
mongodb+srv://faisalfansa_db_user:MoKa%402001@smart-service-desk.d5vcula.mongodb.net/smart-service-desk?retryWrites=true&w=majority
```

**Note:** The `@` in your password (`MoKa@2001`) is encoded as `%40` in the URL.

## Environment Variables for Render

Copy these exact values when setting up Render:

### MONGO_URI
```
mongodb+srv://faisalfansa_db_user:MoKa%402001@smart-service-desk.d5vcula.mongodb.net/smart-service-desk?retryWrites=true&w=majority
```

### JWT_SECRET
```
6059067675ef78b921bfd37d428fb154ac629dea3c61ad4c3e61fff72e340b7f
```

### NODE_ENV (optional)
```
production
```

---

## Next Steps: Deploy to Render

1. **Go to Render.com** → Sign up/Login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - Name: `smart-service-desk-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables:**
   - `MONGO_URI` = (copy the formatted string above)
   - `JWT_SECRET` = (copy the JWT secret above)
6. **Click "Create Web Service"**
7. **Wait 2-5 minutes for deployment**

---

## Security Note

⚠️ **Important:** After deployment, consider:
- Changing your MongoDB password
- Using environment variables instead of hardcoding
- Never commit `.env` files to Git (already in `.gitignore`)

