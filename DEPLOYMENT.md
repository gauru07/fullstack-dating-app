# Frontend Deployment Guide for Render.com

## 🚀 Deployment Steps

### 1. Prepare Your Repository
- Ensure all code is committed to your Git repository
- Push to GitHub/GitLab

### 2. Create New Web Service on Render.com
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Choose your repository

### 3. Configure Build Settings
- **Name**: `devtinder-frontend` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` or `20`

### 4. Environment Variables
Add these environment variables in Render dashboard:

```
NEXT_PUBLIC_API_URL=https://devtinder-backend-i04j.onrender.com
```

### 5. Advanced Settings
- **Auto-Deploy**: `Yes` (deploys on every push)
- **Branch**: `main` (or your default branch)

### 6. Deploy
Click "Create Web Service" and wait for deployment.

## 📋 Pre-Deployment Checklist

✅ **package.json** - Updated with correct start script
✅ **lib/config.ts** - Points to deployed backend
✅ **Profile page** - Uses dynamic API URLs
✅ **No hardcoded localhost URLs**
✅ **Environment variables** - Ready for production

## 🔧 Backend Requirements

Make sure your backend at `https://devtinder-backend-i04j.onrender.com` has:

1. **CORS enabled** for your frontend domain
2. **Profile endpoints**:
   - `GET /profile/view`
   - `POST /profile/upload-photos`
   - `DELETE /profile/delete-photo/:photoUrl`
   - `PUT /profile/set-main-photo`
3. **Authentication endpoints** working
4. **Static file serving** for uploaded images

## 🌐 After Deployment

Your frontend will be available at:
`https://your-app-name.onrender.com`

## 🐛 Troubleshooting

1. **Build fails**: Check Node version compatibility
2. **API calls fail**: Verify CORS settings on backend
3. **Images not loading**: Check static file serving on backend
4. **Authentication issues**: Verify JWT token handling

## 📞 Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test backend endpoints directly
4. Check browser console for errors
