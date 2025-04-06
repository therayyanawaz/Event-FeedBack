# Netlify Deployment Guide

This guide provides instructions for deploying the Event-FeedBack Chatbot to Netlify.

## Pre-deployment Checklist

1. Ensure you have a [Netlify account](https://app.netlify.com/signup) connected to your GitHub account.
2. Make sure your MongoDB connection string is ready (either MongoDB Atlas or another hosted MongoDB solution).
3. Have your Groq API key ready.

## Deployment Steps

### 1. Connect Your Repository

1. Log in to [Netlify](https://app.netlify.com/).
2. Click "Add new site" → "Import an existing project".
3. Select GitHub and authorize Netlify to access your repositories.
4. Choose your GitHub repository (`therayyanawaz/Event-FeedBack`).

### 2. Configure Build Settings

The `netlify.toml` file already contains the necessary configuration, but verify these settings in the Netlify UI:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Advanced build settings**: Add the following environment variables:
  - `NODE_VERSION`: `18`
  - `NEXT_RUNTIME`: `nodejs`

### 3. Configure Environment Variables

Add the following environment variables in the Netlify site settings (under "Site settings" → "Environment variables"):

- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/event-feedback`)
- `GROQ_API_KEY`: Your Groq API key
- `JWT_SECRET`: A secure random string for JWT token generation (use a password generator)
- `NODE_ENV`: Set to `production`

### 4. Deploy

Click "Deploy site" to start the deployment process. Netlify will build and deploy your project.

## Next.js on Netlify

This project uses Next.js with the App Router, which requires the [@netlify/plugin-nextjs](https://github.com/netlify/netlify-plugin-nextjs) plugin for optimal deployment. The plugin is configured automatically by Netlify when it detects a Next.js project.

## Troubleshooting

### MongoDB Connection Issues

If you encounter issues with MongoDB connection:

1. Check if your MongoDB connection string is correct in the environment variables.
2. Ensure your MongoDB Atlas cluster has your Netlify deployment's IP added to the IP whitelist, or preferably, allow connections from anywhere for production deployments.
3. Verify that your MongoDB user has the correct permissions.

### Dynamic Import Issues

If you encounter issues with dynamic imports or Mongoose:

1. Check that all API routes have the `export const runtime = 'nodejs';` directive at the top.
2. Verify that the Netlify function settings in `netlify.toml` are correctly configured.
3. Make sure the application is using the dynamic import approach for Mongoose.

### Missing Environment Variables

If you see warnings about missing environment variables:

1. Double-check that all required variables are set in the Netlify environment variables settings.
2. Redeploy the project after adding the missing variables.
3. Remember that environment variables are case-sensitive.

## Logs and Monitoring

To monitor your deployment:

1. Go to your site in the Netlify dashboard.
2. Click on "Deploys" to see all deployment history.
3. Select a deployment to view build and runtime logs.
4. For function logs, go to "Functions" in the dashboard.

## Custom Domain Setup

To add a custom domain:

1. Go to your site settings in Netlify.
2. Click on "Domain settings".
3. Click "Add custom domain" and follow the instructions.
4. Netlify provides automatic HTTPS certificates via Let's Encrypt.

## Continuous Deployment

Netlify automatically deploys when you push changes to your GitHub repository. You can configure deployment settings:

1. Go to your site settings in Netlify.
2. Under "Build & deploy" → "Continuous deployment", configure branch deploy settings.

## Netlify Functions

This project uses Netlify Functions via Next.js API routes. All API routes in the `app/api` directory will be deployed as Netlify Functions automatically.

## Need Help?

If you encounter any issues not covered by this guide, you can:

1. Check the [Netlify documentation](https://docs.netlify.com/).
2. Consult the [Next.js on Netlify documentation](https://docs.netlify.com/integrations/frameworks/next-js/).
3. Post an issue on the [GitHub repository](https://github.com/therayyanawaz/event-feedBack/issues).
4. Contact the developer at therayyanawaz@gmail.com.

---

Happy deploying! 🚀 