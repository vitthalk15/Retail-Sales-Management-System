# Deployment Guide

## Frontend Deployment (Vercel)

### Steps:
1. Push code to GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.onrender.com/api`)

6. Deploy

### Vercel Configuration:
- The frontend will automatically detect Vite
- Build output goes to `dist/` folder
- Static files are served automatically

## Backend Deployment (Render)

### Steps:
1. Push code to GitHub repository
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - **Name**: retail-sales-backend (or your choice)
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (or paid)

6. Add Environment Variables:
   - **MONGODB_URI**: Your MongoDB connection string
   - **JWT_SECRET**: A secure random string (e.g., `openssl rand -base64 32`)
   - **PORT**: `3001` (or leave default)

7. Deploy

### Render Configuration:
- Render will automatically install dependencies
- Server starts on the port specified in environment or default
- Health check endpoint: `/health`

## Post-Deployment

### Update Frontend API URL:
After backend is deployed, update the `VITE_API_URL` in Vercel to point to your Render backend URL.

### CORS Configuration:
The backend already has CORS enabled for all origins. If you need to restrict it, update `backend/src/index.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app'
}));
```

### MongoDB Connection:
Ensure your MongoDB Atlas cluster allows connections from Render's IP addresses (0.0.0.0/0 for development).

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend (Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
PORT=3001
```

## Testing Deployment

1. **Backend Health Check**: `https://your-backend.onrender.com/health`
2. **Frontend**: `https://your-frontend.vercel.app`
3. **API Test**: `https://your-backend.onrender.com/api/sales?page=1&pageSize=10`

## Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure environment variables are set correctly
- Check that `npm start` command works locally

### Frontend Issues:
- Check Vercel build logs
- Verify `VITE_API_URL` is set correctly
- Ensure backend CORS allows Vercel domain
- Check browser console for API errors

### Common Issues:
- **CORS errors**: Update backend CORS configuration
- **API not found**: Check `VITE_API_URL` environment variable
- **MongoDB connection failed**: Verify connection string and network access

