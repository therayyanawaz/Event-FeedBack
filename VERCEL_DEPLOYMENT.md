# Vercel Deployment Guide

This guide provides instructions for deploying the Event-FeedBack Chatbot to Vercel.

## Pre-deployment Checklist

1. Ensure you have a [Vercel account](https://vercel.com/signup) connected to your GitHub account.
2. Make sure your MongoDB connection string is ready (either MongoDB Atlas or another hosted MongoDB solution).
3. Have your Groq API key ready.

## Deployment Steps

### 1. Connect Your Repository

1. Log in to [Vercel](https://vercel.com/).
2. Click "Add New" → "Project".
3. Import your GitHub repository (`therayyanawaz/Event-FeedBack`).
4. Vercel will automatically detect that it's a Next.js project.

### 2. Configure Environment Variables

Add the following environment variables in the Vercel project settings:

- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/event-feedback`)
- `GROQ_API_KEY`: Your Groq API key
- `JWT_SECRET`: A secure random string for JWT token generation (use a password generator)
- `NODE_ENV`: Set to `production`

### 3. Deploy Settings

Keep the default settings:

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

Click "Deploy" to start the deployment process.

## Troubleshooting

### MongoDB Connection Issues

If you encounter issues with MongoDB connection:

1. Check if your MongoDB connection string is correct.
2. Ensure your MongoDB Atlas cluster has your Vercel deployment's IP added to the IP whitelist, or preferably, allow connections from anywhere (for production deployments).
3. Verify that your MongoDB user has the correct permissions.

### Edge Runtime Errors

The project uses Node.js runtime for API routes to ensure compatibility with MongoDB/Mongoose. If you see errors about Edge Runtime:

1. Check that all API routes have the `export const runtime = 'nodejs';` directive at the top.
2. Ensure the `vercel.json` file is correctly configured to specify Node.js runtime for API routes.

### Missing Environment Variables

If you see warnings about missing environment variables:

1. Double-check that all required variables are set in the Vercel project settings.
2. Redeploy the project after adding the missing variables.
3. Remember that environment variables are case-sensitive.

## Logs and Monitoring

To monitor your deployment:

1. Go to your project in the Vercel dashboard.
2. Click on "Deployments" to see all deployment history.
3. Select the most recent deployment to view build and runtime logs.
4. For runtime errors, click on "Functions" to see logs for specific serverless functions.

## Custom Domain Setup

To add a custom domain:

1. Go to your project settings in Vercel.
2. Click on "Domains".
3. Add your domain and follow the verification process.
4. Update DNS settings as instructed by Vercel.

## Continuous Deployment

Vercel automatically deploys when you push changes to your GitHub repository. You can configure deployment settings:

1. Go to your project settings in Vercel.
2. Click on "Git".
3. Configure production branch, preview branches, and other deployment options.

## Need Help?

If you encounter any issues not covered by this guide, you can:

1. Check the [Vercel documentation](https://vercel.com/docs).
2. Post an issue on the [GitHub repository](https://github.com/therayyanawaz/event-feedBack/issues).
3. Contact the developer at your-contact-email@example.com.

---

Happy deploying! 🚀 