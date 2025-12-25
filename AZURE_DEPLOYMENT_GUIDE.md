# Azure Static Web Apps Deployment Guide

This guide will help you deploy the Insurance Quote Application to Azure Static Web Apps.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
2. **GitHub Repository**: Your code should be pushed to a GitHub repository
3. **Azure CLI** (optional): For command-line deployment

## Deployment Options

### Option 1: Deploy via Azure Portal (Recommended for First-Time Setup)

#### Step 1: Push Code to GitHub

```bash
cd C:\Source\myprojects\github\insurinz

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Insurance Quote Application"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Create Azure Static Web App

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create Resource**: Click "+ Create a resource"
3. **Search**: Type "Static Web App" and select it
4. **Click**: "Create"

#### Step 3: Configure Your Static Web App

**Basics Tab:**
- **Subscription**: Select your Azure subscription
- **Resource Group**: Create new or select existing
- **Name**: Choose a unique name (e.g., `insurance-quote-app`)
- **Plan type**:
  - **Free**: For development/testing
  - **Standard**: For production (includes custom domains, etc.)
- **Region**: Choose closest to your users
- **Source**: Select "GitHub"

**GitHub Configuration:**
- **Sign in** to your GitHub account
- **Organization**: Select your GitHub username/organization
- **Repository**: Select your repository
- **Branch**: Select `main` or `master`

**Build Details:**
- **Build Presets**: Select "Angular"
- **App location**: `/insurance-quote-app`
- **Api location**: Leave empty (no API)
- **Output location**: `dist/insurance-quote-app/browser`

#### Step 4: Review and Create

1. Click "Review + create"
2. Review your configuration
3. Click "Create"

Azure will:
- Create the Static Web App resource
- Add a GitHub Actions workflow to your repository
- Trigger the first deployment automatically

#### Step 5: Monitor Deployment

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Watch the deployment workflow run
4. Once complete (green checkmark), your app is live!

#### Step 6: Access Your App

1. In Azure Portal, go to your Static Web App resource
2. Click "Browse" or find the URL in the "Overview" section
3. Your app URL will be: `https://YOUR-APP-NAME.azurestaticapps.net`

---

### Option 2: Deploy Using Azure CLI

#### Prerequisites

Install Azure CLI:
```bash
# Windows (using winget)
winget install Microsoft.AzureCLI

# Or download from: https://aka.ms/installazurecliwindows
```

#### Deployment Steps

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name rg-insurance-quote --location eastus

# Create Static Web App
az staticwebapp create \
  --name insurance-quote-app \
  --resource-group rg-insurance-quote \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO_NAME \
  --location eastus \
  --branch main \
  --app-location "/insurance-quote-app" \
  --output-location "dist/insurance-quote-app/browser" \
  --login-with-github
```

---

## Configuration Files Created

### 1. `staticwebapp.config.json`

This file configures:
- **SPA Routing**: Ensures Angular routing works correctly
- **404 Handling**: Redirects to index.html for client-side routing
- **MIME Types**: Proper content types for assets
- **Cache Headers**: Controls browser caching

Located at: `insurance-quote-app/staticwebapp.config.json`

### 2. GitHub Actions Workflow

Located at: `insurance-quote-app/.github/workflows/azure-static-web-apps.yml`

This workflow:
- Runs on push to main/master branch
- Installs dependencies
- Builds the Angular application
- Deploys to Azure Static Web Apps
- Handles PR deployments (staging environments)

---

## Post-Deployment Configuration

### Custom Domain (Standard Plan Only)

1. Go to your Static Web App in Azure Portal
2. Click "Custom domains" in the left menu
3. Click "Add"
4. Follow the wizard to add your custom domain
5. Validate domain ownership via DNS

### Environment Variables

If you need environment-specific configuration:

1. In Azure Portal, go to your Static Web App
2. Click "Configuration" in the left menu
3. Add your environment variables
4. Update your Angular app to use these at build time

### Monitor Application

1. **Application Insights**: Enable for monitoring and diagnostics
2. **Log Stream**: View real-time logs
3. **Metrics**: Monitor performance and usage

---

## Troubleshooting

### Build Fails

**Check:**
- Node version in workflow matches your local version
- All dependencies are in `package.json`
- Build works locally: `npm run build`

**Fix:**
- Update Node version in workflow file
- Run `npm install` and commit `package-lock.json`

### Routes Not Working (404 Errors)

**Check:**
- `staticwebapp.config.json` is in the root of output
- `output_location` is correct in workflow

**Fix:**
- Verify `dist/insurance-quote-app/browser` contains `index.html`
- Check `navigationFallback` in `staticwebapp.config.json`

### App Shows Blank Page

**Check:**
- Browser console for errors
- Base href in `index.html`

**Fix:**
- Ensure build completed successfully
- Check Angular routing configuration

---

## Updating Your App

Every time you push to your main branch, Azure Static Web Apps will:
1. Automatically trigger a new build
2. Run tests (if configured)
3. Deploy the new version
4. Zero-downtime deployment

```bash
# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Updated feature X"
git push origin main

# Monitor deployment in GitHub Actions
```

---

## Cost Optimization

### Free Tier Includes:
- 100 GB bandwidth per subscription
- 0.5 GB storage per app
- Custom domains (via CNAME)
- Automatic HTTPS

### Standard Tier Adds:
- Increased bandwidth and storage
- Enterprise-grade SLA
- Advanced networking
- Private endpoints

**Recommendation**: Start with Free tier for development, upgrade to Standard for production.

---

## Security Best Practices

1. **HTTPS**: Enabled by default
2. **Secrets**: Store API tokens in GitHub Secrets, not in code
3. **CORS**: Configure if using APIs
4. **Authentication**: Add Azure AD B2C if needed

---

## Next Steps

1. **Set up monitoring** with Application Insights
2. **Configure CI/CD** for testing before deployment
3. **Add custom domain** for production
4. **Enable authentication** if required
5. **Set up staging environments** using PR deployments

---

## Support Resources

- **Azure Static Web Apps Documentation**: https://docs.microsoft.com/azure/static-web-apps/
- **Angular Deployment Guide**: https://angular.io/guide/deployment
- **GitHub Actions**: https://docs.github.com/actions
- **Azure Support**: https://azure.microsoft.com/support/

---

## Summary

Your Insurance Quote Application is now configured for Azure Static Web Apps deployment with:

✅ Production build configuration
✅ Azure Static Web Apps config file
✅ GitHub Actions workflow for CI/CD
✅ SPA routing support
✅ Automated deployments

**Next**: Push your code to GitHub and create your Azure Static Web App!
