# TrueCost Deployment Guide

This guide provides step-by-step instructions for deploying TrueCost to various hosting platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deploy to Vercel](#deploy-to-vercel)
- [Deploy to Render](#deploy-to-render)
- [Deploy to Netlify](#deploy-to-netlify)
- [Deploy to GitHub Pages](#deploy-to-github-pages)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally for testing

## Environment Variables

All deployments require the following environment variable:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key for AI features | Yes |

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

> ⚠️ **Important**: Never commit API keys to your repository. Always use environment variables.

## Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variable:
   - Name: `GEMINI_API_KEY`
   - Value: `your_api_key_here`
6. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variable when asked
```

### Vercel Configuration

The `vercel.json` file is pre-configured with:
- Security headers (XSS protection, frame options, etc.)
- SPA routing (rewrites all routes to index.html)

> **Note**: Environment variables like `GEMINI_API_KEY` should be configured through Vercel's dashboard during project setup (Step 5 above), not in `vercel.json`.

## Deploy to Render

### Static Site Deployment

1. Visit [render.com](https://render.com) and sign in
2. Click "New" → "Static Site"
3. Connect your Git repository
4. Configure:
   - **Name**: truecost (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `your_api_key_here`
6. Click "Create Static Site"

### Render Configuration

The `render.yaml` file is pre-configured for automatic deployments.

## Deploy to Netlify

### Method 1: Netlify UI

1. Visit [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider
4. Select your repository
5. Build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Show advanced" → "New variable"
   - Key: `GEMINI_API_KEY`
   - Value: `your_api_key_here`
7. Click "Deploy site"

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow prompts and set up environment variable
```

### Netlify Configuration

The `netlify.toml` file includes:
- Build commands and publish directory
- SPA redirects
- Security headers
- Cache-Control headers for assets

## Deploy to GitHub Pages

> ⚠️ **Note**: GitHub Pages doesn't support environment variables. You'll need to build locally with your API key set.

1. Build locally with API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here npm run build
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

## Post-Deployment Checks

After deploying, verify:

1. ✅ Site loads without errors
2. ✅ Dark mode toggle works
3. ✅ Navigation between views works
4. ✅ Forms validate properly
5. ✅ Charts render correctly
6. ✅ Responsive design works on mobile
7. ✅ Console has no errors (check browser DevTools)

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Module not found" error

**Solution**: 
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Key Not Working

**Issue**: "AI features are currently unavailable"

**Solutions**:
1. Verify API key is correctly set in platform environment variables
2. Check key format (should start with `AIza...`)
3. Verify key is active in [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Check API quota limits

### SPA Routing Not Working

**Issue**: Refreshing page returns 404

**Solutions**:
- **Vercel**: Check `vercel.json` rewrites configuration
- **Netlify**: Verify `_redirects` or `netlify.toml` redirects
- **Render**: Check `render.yaml` routing configuration

### Large Bundle Warning

**Issue**: Bundle size warnings during build

**Solution**: This is expected. The app uses code splitting:
- Main bundle: ~240 KB
- Charts library: ~319 KB (loaded separately)
- These are within acceptable ranges for a dashboard app

### Environment Variables Not Available

**Issue**: `process.env.GEMINI_API_KEY` is undefined

**Solutions**:
1. Ensure variable is named exactly `GEMINI_API_KEY`
2. Redeploy after adding environment variables
3. Check platform-specific docs for environment variable syntax

## Performance Optimization

### Already Implemented
- ✅ Code splitting (React, Charts, GenAI separated)
- ✅ Minification with Terser
- ✅ Tree shaking
- ✅ Console removal in production
- ✅ gzip compression

### Additional Recommendations
1. Enable HTTP/2 on your platform
2. Use CDN for static assets
3. Monitor with Lighthouse or WebPageTest
4. Set up monitoring (Sentry, LogRocket, etc.)

## Security Best Practices

### Already Configured
- ✅ XSS protection headers
- ✅ Frame options (clickjacking protection)
- ✅ Content type sniffing prevention
- ✅ API keys via environment variables
- ✅ Console logs removed in production

### Additional Recommendations
1. Set up rate limiting for API calls
2. Implement Content Security Policy (CSP)
3. Regular dependency updates: `npm audit fix`
4. Monitor for security vulnerabilities

## Monitoring and Analytics

Consider adding:
- Google Analytics or Plausible
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics / Netlify Analytics

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

### Render
1. Go to Settings → Custom Domains
2. Add domain
3. Update DNS A/CNAME records

## Continuous Deployment

All platforms support automatic deployments:
- **Trigger**: Push to main/master branch
- **Process**: Automatic build and deploy
- **Rollback**: Available in platform dashboard

## Support

For issues or questions:
- **GitHub Issues**: [Create an issue](https://github.com/karthikeya-vppcoe/TrueCost/issues)
- **Email**: support@truecost.com
- **Documentation**: Check README.md

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial deployment-ready release |

---

**Last Updated**: October 2024  
**Maintained by**: TrueCost Team
