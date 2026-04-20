# Backend Vercel Deployment Guide

This guide will help you deploy your backend to Vercel as serverless functions.

## Prerequisites
- Backend code converted to serverless functions (completed)
- GitHub repository with backend code
- Vercel account
- MongoDB Atlas cluster configured for remote access

## Step 1: Push Code to GitHub

```bash
cd backend
git add .
git commit -m "Convert backend to Vercel serverless functions"
git push
```

## Step 2: Connect Backend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your backend repository from GitHub
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./backend` (if monorepo) or leave as root
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

## Step 3: Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
DB_USERNAME = abhishekh-mongodb
DB_PASSWORD = your_mongodb_password
JWT_SECRET = your_jwt_secret
NODE_ENV = production
FRONTEND_URL = https://frontend-f63r.vercel.app/
```

**Important**: Use your actual MongoDB password and JWT secret.

## Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Vercel will provide a URL like `https://your-backend.vercel.app`

## Step 5: Update Frontend API URL

In your frontend project, set the environment variable:

```
VITE_API_BASE_URL = https://your-backend.vercel.app/api
```

Then redeploy your frontend.

## Step 6: Test Integration

Test the following endpoints:
- `POST /api/auth/login` - Authentication
- `GET /api/courses` - Course listing
- `POST /api/courses` - Course creation (with file upload as base64)
- Other endpoints as needed

## File Upload Handling

File uploads are handled via base64 encoding in the JSON body:

```javascript
const formData = {
  title: "Course Title",
  description: "Description",
  category: "PROGRAMMING",
  fileData: base64EncodedFile,  // Convert file to base64
  fileName: "file.pdf",
  mimeType: "application/pdf"
};
```

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB Atlas allows access from anywhere (0.0.0.0/0)
- Check DB_USERNAME and DB_PASSWORD are correct

**CORS Issues:**
- Ensure FRONTEND_URL is set correctly in Vercel environment variables

**Function Timeout:**
- Large file uploads may timeout on free tier (60s limit)
- Consider using Vercel's paid tier for longer timeouts

## Notes

- Serverless functions have execution time limits (60s free tier)
- MongoDB connections are pooled for efficiency
- The original Express server (`index.js`) is no longer used in production
- File uploads use base64 encoding to work with serverless constraints
