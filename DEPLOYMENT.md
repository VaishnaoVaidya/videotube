# VideoTube Deployment Guide

## Frontend on Vercel

1. Import the `frontend` folder as a Vercel project.
2. Framework preset: `Create React App`.
3. Build command:
   `npm run build`
4. Output directory:
   `build`
5. Add environment variable:
   `REACT_APP_API_URL=https://your-backend-service.onrender.com`

## Backend on Render

1. Import the `backend` folder as a Render Web Service.
2. Build command:
   `npm install`
3. Start command:
   `npm start`
4. Add environment variables from [backend/.env.example](D:/code-playground/Reactjs Projects/video-tube/backend/.env.example)

## Required Backend Environment Variables

- `PORT`
- `NODE_ENV=production`
- `CORS_ORIGIN`
- `MONGODB_URI`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## CORS

- `CORS_ORIGIN` supports comma-separated origins.
- Example:
  `https://your-app.vercel.app,http://localhost:3000,http://localhost:3001`
- Preview Vercel URLs are also accepted automatically by the backend.

## Local + Production Setup

- Frontend local env example: [frontend/.env.example](D:/code-playground/Reactjs Projects/video-tube/frontend/.env.example)
- Backend local env example: [backend/.env.example](D:/code-playground/Reactjs Projects/video-tube/backend/.env.example)

## Notes

- Frontend API URLs are now centralized in [frontend/src/config/api.js](D:/code-playground/Reactjs Projects/video-tube/frontend/src/config/api.js)
- Backend cookies and CORS are environment-aware for local development and production
- Vercel SPA rewrites are configured in [frontend/vercel.json](D:/code-playground/Reactjs Projects/video-tube/frontend/vercel.json)
