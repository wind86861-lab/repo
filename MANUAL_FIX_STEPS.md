# Manual Steps to Fix Railway Deployment

## Current Issue
Railway is still trying to use `npm ci` which fails because it can't find package-lock.json in the build context.

## Solution Steps

### Step 1: Clean Git State
```bash
cd /home/user/Desktop/code/banisa

# Abort any ongoing rebase
git rebase --abort

# Reset to clean state
git reset --hard HEAD

# Pull latest changes
git pull origin main
```

### Step 2: Verify nixpacks.toml Content
Make sure `nixpacks.toml` has this exact content:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "openssl"]

[phases.install]
cmds = ["cd backend && npm install"]

[phases.build]
cmds = ["cd backend && npx prisma generate", "cd backend && npm run build"]

[start]
cmd = "cd backend && npx prisma migrate deploy && npm start"
```

**Key change:** Line 5 must say `npm install` NOT `npm ci`

### Step 3: Commit and Push
```bash
# Add all files
git add -A

# Commit
git commit -m "fix: Use npm install for Railway deployment"

# Push
git push origin main
```

### Step 4: Trigger Railway Redeploy
After pushing:
1. Go to Railway dashboard
2. Click on your "web" service
3. Click "Deploy" or wait for automatic deployment
4. Watch the build logs

## Expected Build Output

You should see:
```
✓ Setup: nodejs-18_x, openssl installed
✓ Install: npm install completed
✓ Build: Prisma client generated
✓ Build: TypeScript compiled
✓ Start: Migrations deployed
✓ Start: Server running on port 5000
```

## If It Still Fails

### Alternative 1: Use railway.json only
Delete `nixpacks.toml` and rely on `railway.json`:

```bash
rm nixpacks.toml
git add nixpacks.toml
git commit -m "fix: Remove nixpacks.toml, use railway.json"
git push origin main
```

### Alternative 2: Create Dockerfile
If Nixpacks continues to fail, create a custom Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

# Install dependencies
WORKDIR /app/backend
RUN npm install

# Copy rest of backend
COPY backend ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start command
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

Then commit and push:
```bash
git add Dockerfile
git commit -m "fix: Add custom Dockerfile for Railway"
git push origin main
```

## Environment Variables Required

Make sure these are set in Railway:
- `DATABASE_URL` (auto-provided by Railway PostgreSQL)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN`

## Verification

After successful deployment, test:
```bash
curl https://your-app.railway.app/health
```

Should return: `{"status":"ok"}`
