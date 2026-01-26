# GitHub Actions Workflows

## 🚀 Active Workflows

### [Minimal CI](workflows/minimal-ci.yml) ⭐
**Triggers:** Push to `main`/`develop`, Pull Requests  
**Purpose:** Essential checks - lint and build only  
**Status:** Always Active

Quick validation workflow that runs on every push:
- ✅ Linting
- ✅ Build
- ✅ Basic tests (if available)

---

## 📦 Optional Workflows

These workflows are disabled by default and can be enabled when needed:

### [Full CI Pipeline](workflows/ci.yml)
**Triggers:** Manual dispatch, Push (when enabled)  
**Purpose:** Comprehensive testing including E2E and multiple Node versions

**To Enable:** 
```yaml
on:
  push:
    branches: [ main, develop ]
```

### [Code Quality](workflows/code-quality.yml)
**Triggers:** Manual dispatch, Weekly schedule  
**Purpose:** SonarCloud, type coverage, bundle size analysis

**Requirements:**
- `SONAR_TOKEN` secret
- SonarCloud project setup

### [Security Scanning](workflows/security.yml)
**Triggers:** Manual dispatch, Weekly schedule  
**Purpose:** CodeQL, dependency scanning, secrets detection

**Requirements:**
- `SNYK_TOKEN` (optional)
- Enable CodeQL in repository settings

### [Docker Build & Push](workflows/docker.yml)
**Triggers:** Manual dispatch, Version tags (`v*.*.*`)  
**Purpose:** Build and publish Docker images

**Requirements:**
- `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
- Container registry setup

### [Continuous Deployment](workflows/cd.yml)
**Triggers:** Manual dispatch only  
**Purpose:** Deploy to staging/production

**Requirements:**
- `STAGING_HOST`, `PRODUCTION_HOST`
- `SSH_KEY` secrets
- Server access configured

### [Release](workflows/release.yml)
**Triggers:** Version tags (`v*.*.*`)  
**Purpose:** Create GitHub releases automatically

### [Auto Label](workflows/auto-label.yml)
**Triggers:** Pull requests  
**Purpose:** Automatically label PRs based on changed files

---

## 🔧 Configuration Guide

### Quick Start

1. **Commit the minimal setup:**
```bash
git add .github/workflows/minimal-ci.yml
git commit -m "ci: add minimal CI workflow"
git push
```

2. **Enable optional workflows as needed** by updating their `on:` triggers

### Required Secrets

For full functionality, add these secrets in **Settings → Secrets and variables → Actions**:

#### Deployment
```
STAGING_HOST=your-staging-server.com
STAGING_USER=deploy
STAGING_SSH_KEY=<private-key>
STAGING_PORT=22

PRODUCTION_HOST=your-production-server.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=<private-key>
PRODUCTION_PORT=22
```

#### Docker
```
DOCKERHUB_USERNAME=your-username
DOCKERHUB_TOKEN=<access-token>
```

#### Code Quality
```
SONAR_TOKEN=<sonarcloud-token>
```

#### Security
```
SNYK_TOKEN=<snyk-token>
```

#### Notifications
```
SLACK_WEBHOOK=<webhook-url>
DISCORD_WEBHOOK=<webhook-url>
```

---

## 📊 Workflow Status

Check workflow runs at: `https://github.com/YOUR_ORG/happy-cat-api/actions`

### Current Strategy

✅ **Minimal CI** - Always runs  
⏸️ **Full CI** - Manual/scheduled  
⏸️ **Security** - Manual/scheduled  
⏸️ **Quality** - Manual/scheduled  
⏸️ **Docker** - Tag-based  
⏸️ **Deploy** - Manual only  

---

## 🎯 Enabling Workflows

### Enable Full CI
```yaml
# .github/workflows/ci.yml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

### Enable Security Scanning
```yaml
# .github/workflows/security.yml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

### Enable Auto Deployment
```yaml
# .github/workflows/cd.yml
on:
  push:
    branches: [ main ]  # Auto-deploy staging on main push
```

---

## 🐛 Troubleshooting

### Workflow fails with "command not found"
Check that the script exists in `package.json`:
```json
{
  "scripts": {
    "lint": "eslint .",
    "build": "nest build",
    "test": "jest"
  }
}
```

### Missing secrets
Workflows requiring secrets will be skipped automatically. Add secrets in repository settings.

### Docker build fails
Ensure Dockerfile is present and valid. Test locally:
```bash
docker build -t happy-cat-api .
```

---

## 📝 Best Practices

1. **Start Simple:** Use minimal-ci.yml first
2. **Enable Gradually:** Add workflows as you configure secrets
3. **Test Locally:** Always test commands locally before adding to CI
4. **Monitor Costs:** Be aware of GitHub Actions minutes usage
5. **Use Caching:** Workflows use pnpm caching for faster builds

---

**Last Updated:** January 26, 2026  
**Maintained by:** Happy Cat API Team
