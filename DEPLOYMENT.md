# Railway Deployment Guide

This guide walks you through deploying the Record Tracker application to Railway.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app))
- Your code pushed to a GitHub repository
- Basic understanding of environment variables

## Architecture

The application consists of three services on Railway:
1. **PostgreSQL Database** - Managed PostgreSQL instance
2. **Backend API** - ASP.NET Core 8 API (Dockerized)
3. **Frontend** - Next.js 15 application (Dockerized)

## Step-by-Step Deployment

### 1. Create Railway Project

1. Log in to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will create a new project

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. **Important**: Note the database connection details (you'll need this later)

### 3. Deploy Backend Service

1. In your Railway project, click "+ New" → "GitHub Repo"
2. Select your repository again
3. Railway will detect the repository
4. Click on the new service to configure it:
   - **Root Directory**: Set to `backend`
   - **Build Command**: Railway will auto-detect the Dockerfile
   - **Start Command**: Handled by Dockerfile

#### Backend Environment Variables

Add these environment variables in the Railway service settings:

```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<PostgreSQL connection string from step 2>
Auth__Jwt__Key=<Generate a strong random secret key>
Cors__AllowedOrigins__0=<Frontend URL - you'll set this after deploying frontend>
```

**Getting the PostgreSQL connection string:**
- In Railway, go to your PostgreSQL service
- Click on the "Variables" tab
- Copy the `DATABASE_URL` value
- Use this as your `ConnectionStrings__DefaultConnection`

**Generating JWT Secret:**
- Use a strong random string (at least 32 characters)
- You can generate one using: `openssl rand -base64 32`
- Or use an online generator

**CORS Origin:**
- Initially, you can set this to `*` for testing, but update it to your frontend URL after deployment
- Format: `https://your-frontend-app.railway.app`

### 4. Deploy Frontend Service

1. In your Railway project, click "+ New" → "GitHub Repo"
2. Select your repository
3. Click on the new service to configure it:
   - **Root Directory**: Set to `frontend`
   - **Build Command**: Railway will auto-detect the Dockerfile
   - **Start Command**: Handled by Dockerfile

#### Frontend Environment Variables

Add this environment variable:

```
NEXT_PUBLIC_API_URL=<Backend API URL>
```

**Getting the Backend API URL:**
- In Railway, go to your backend service
- Click on the "Settings" tab
- Find the "Domains" section
- Copy the generated domain (e.g., `https://your-backend.railway.app`)
- Add `/api` to the end: `https://your-backend.railway.app/api`

### 5. Update Backend CORS Configuration

After you have your frontend URL:

1. Go to your backend service in Railway
2. Navigate to "Variables"
3. Update `Cors__AllowedOrigins__0` with your frontend URL (without `/api`)
   - Example: `https://your-frontend.railway.app`

### 6. Configure Custom Domains (Optional)

Railway provides default domains, but you can add custom domains:

1. Go to each service's "Settings" tab
2. Click "Generate Domain" or "Add Custom Domain"
3. Follow Railway's instructions for custom domain setup

## Environment Variables Reference

### Backend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Environment name | `Production` |
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string | From Railway DB service |
| `Auth__Jwt__Key` | JWT signing key | Random 32+ character string |
| `Cors__AllowedOrigins__0` | Frontend URL for CORS | `https://your-app.railway.app` |

**Note**: The double underscore (`__`) is used for nested configuration in ASP.NET Core.

### Frontend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://your-backend.railway.app/api` |

**Note**: `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser.

## Database Migrations

Database migrations run automatically when the backend service starts in production. The `Program.cs` file includes logic to apply migrations on startup.

If you need to run migrations manually:

1. Install Railway CLI: `npm i -g @railway/cli`
2. Run: `railway run dotnet ef database update --project backend/src/RecordTracker.Infrastructure`

## Testing the Deployment

1. **Backend Health Check:**
   - Visit your backend URL (e.g., `https://your-backend.railway.app`)
   - You should see a response (or 404 if no root endpoint)

2. **Frontend:**
   - Visit your frontend URL
   - The app should load
   - Try logging in or creating an account

3. **API Connection:**
   - Open browser DevTools → Network tab
   - Check if API calls are going to the correct backend URL
   - Verify CORS is working (no CORS errors in console)

## Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure PostgreSQL connection string is correct
- Check that migrations can run (database is accessible)

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend URL includes `/api` path
- Check browser console for CORS errors

### Database connection issues
- Verify `ConnectionStrings__DefaultConnection` is set
- Check PostgreSQL service is running in Railway
- Ensure connection string format is correct

### Build failures
- Check Railway build logs
- Verify Dockerfiles are in correct locations
- Ensure all dependencies are in package.json/csproj files

## Local Testing with Docker

Before deploying, you can test the Docker setup locally:

```bash
# Build and run all services
docker-compose up --build

# Or run services individually
docker build -t record-tracker-backend ./backend
docker build -t record-tracker-frontend ./frontend
```

## CI/CD with Railway

Railway automatically deploys when you push to your connected GitHub branch:

1. Push code to your main/master branch
2. Railway detects the change
3. Builds and deploys automatically
4. You can see progress in Railway dashboard

To configure which branch to deploy:
- Go to service settings
- Set "Source" branch
- Default is usually `main` or `master`

## Cost Considerations

Railway's free tier includes:
- $5 credit per month
- Sufficient for small hobby projects

After free tier:
- Backend service: ~$5/month
- Frontend service: ~$5/month
- PostgreSQL: ~$5/month (or use free tier if available)

**Total estimated cost**: ~$10-15/month after free tier

## Security Best Practices

1. **JWT Secret**: Use a strong, random secret key (never commit to git)
2. **Environment Variables**: Never commit sensitive values
3. **CORS**: Restrict to your frontend domain only (not `*`)
4. **HTTPS**: Railway provides HTTPS by default
5. **Database**: Use Railway's managed PostgreSQL (automatically secured)

## Next Steps

- Set up custom domains for production
- Configure monitoring and logging
- Set up staging environment
- Add GitHub Actions for pre-deployment testing
- Configure backup strategy for database

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [ASP.NET Core Production Best Practices](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/production-checklist)
- [Next.js Deployment](https://nextjs.org/docs/deployment)



