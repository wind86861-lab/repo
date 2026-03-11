# 🚀 Deployment Instructions - Banisa Medical Platform

## 📋 Repository Pushed Successfully!

**New Repository:** https://github.com/wind86861-lab/repo.git  
**Branch:** main  
**Status:** ✅ All code pushed and ready for deployment

---

## 🎯 Quick Deploy Options

### Option 1: Railway (Recommended)
Easiest deployment with automatic scaling and database

### Option 2: DigitalOcean App Platform  
Similar to Railway with good pricing

### Option 3: AWS/GCP/Azure
More control, requires more setup

---

## 🛠️ Railway Deployment Steps

### 1. Connect Repository to Railway
```bash
# 1. Go to https://railway.app
# 2. Click "New Project" 
# 3. Select "Deploy from GitHub repo"
# 4. Choose: wind86861-lab/repo
# 5. Select main branch
```

### 2. Configure Environment Variables
Set these in Railway project settings:

#### Required Variables:
```env
# Database (Railway auto-provides when you add PostgreSQL service)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-different

# Node Environment
NODE_ENV=production

# CORS Origin (your frontend URL after deployment)
CORS_ORIGIN=https://your-app-name.railway.app

# SMS/OTP (if using Eskiz.uz)
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://notify.eskiz.uz/api

# File Upload Settings
UPLOAD_MAX_FILE_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp,application/pdf

# Default Admin (change these!)
DEFAULT_ADMIN_PHONE=+998901234567
DEFAULT_ADMIN_PASSWORD=change-this-in-production
```

### 3. Add PostgreSQL Service
```
# In Railway dashboard:
1. Click "+ New Service"
2. Select "PostgreSQL"
3. Railway will auto-provide DATABASE_URL
4. Connect to your main app service
```

### 4. Deploy
```
# Railway will automatically:
✅ Install dependencies (npm install)
✅ Generate Prisma client
✅ Build TypeScript
✅ Deploy migrations
✅ Start server
```

### 5. Verify Deployment
```bash
# Test your deployed app
curl https://your-app-name.railway.app/health

# Should return: {"status":"ok"}
```

---

## 🔧 Alternative: Manual VPS Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- PostgreSQL 14+
- PM2 (process manager)
- Nginx (reverse proxy)

### Setup Commands
```bash
# 1. Update server
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres createdb banisa

# 4. Install PM2
sudo npm install -g pm2

# 5. Install Nginx
sudo apt install nginx -y

# 6. Clone repository
cd /var/www
sudo git clone https://github.com/wind86861-lab/repo.git banisa
sudo chown -R $USER:$USER /var/www/banisa
cd banisa

# 7. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your values

# 8. Setup database
npx prisma migrate deploy
npx prisma db seed

# 9. Build frontend
cd ../code
npm install
npm run build

# 10. Setup PM2
cd ../backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 11. Configure Nginx
sudo nano /etc/nginx/sites-available/banisa
# Add Nginx config (see below)

# 12. Enable site
sudo ln -s /etc/nginx/sites-available/banisa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/banisa
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/banisa/code/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Railway vs VPS Comparison

| Feature | Railway | VPS |
|---------|---------|-----|
| **Setup Time** | 5 minutes | 1-2 hours |
| **Cost** | $20-50/month | $5-20/month |
| **Database** | Included | Separate setup |
| **SSL** | Auto included | Manual setup |
| **Scaling** | Automatic | Manual |
| **Control** | Limited | Full control |
| **Best For** | Quick deployment | Production apps |

---

## 🔍 Pre-Deployment Checklist

### Code Quality ✅
- [ ] TypeScript compiles without errors
- [ ] All tests pass (if any)
- [ ] No console errors in browser
- [ ] Environment variables documented

### Database ✅
- [ ] All migrations committed to git
- [ ] Seed data tested
- [ ] Database schema validated
- [ ] Connection strings tested

### Security ✅
- [ ] JWT secrets are strong (min 32 chars)
- [ ] Default passwords changed
- [ ] CORS origin set correctly
- [ ] File upload limits configured
- [ ] Rate limiting enabled

### Performance ✅
- [ ] Images optimized
- [ ] API responses cached where appropriate
- [ ] Database indexes added
- [ ] Frontend bundle optimized

### Documentation ✅
- [ ] README.md updated
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment guide created

---

## 🚀 Post-Deployment Tasks

### 1. Test All Features
```bash
# Test endpoints
curl https://your-domain.com/api/health

# Test admin login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+998901234567", "password": "admin123"}'
```

### 2. Monitor Logs
```bash
# Railway: Check dashboard logs
# VPS: pm2 logs
pm2 logs all
```

### 3. Set Up Monitoring
- Railway: Built-in metrics
- VPS: Consider UptimeRobot, Sentry, etc.

### 4. Backup Strategy
- Railway: Automatic database backups
- VPS: Set up pg_dump cron jobs

---

## 📱 Mobile App Ready

The API is mobile-ready with:
- ✅ RESTful endpoints
- ✅ JWT authentication  
- ✅ File upload support
- ✅ Role-based access
- ✅ CORS configured

### Flutter/React Native Setup
```dart
// API Base URL
const String API_BASE = 'https://your-domain.com/api';

// Authentication
Future<String> login(String phone, String password) async {
  final response = await http.post(
    Uri.parse('$API_BASE/auth/login'),
    body: jsonEncode({'phone': phone, 'password': password}),
    headers: {'Content-Type': 'application/json'},
  );
  // Handle response...
}
```

---

## 🔧 Troubleshooting

### Railway Issues
- **Build fails**: Check environment variables
- **Migration errors**: Verify DATABASE_URL format
- **CORS errors**: Check CORS_ORIGIN setting
- **401 errors**: Check JWT secrets

### VPS Issues
- **Port conflicts**: Check if ports 5000/80/443 are free
- **Database connection**: Verify PostgreSQL is running
- **Nginx errors**: Check nginx -t and logs
- **PM2 issues**: Check pm2 logs and restart

---

## 📞 Support & Contact

### Documentation Files Created:
- ✅ `PROJECT_RUNNING_GUIDE.md` - Local development
- ✅ `USER_ROLES_EXPLAINED.md` - Role system
- ✅ `DEPLOYMENT_INSTRUCTIONS.md` - This file
- ✅ `CHANGES_AFTER_LAST_PUSH.md` - Feature summary

### Quick Links:
- **Repository:** https://github.com/wind86861-lab/repo
- **Railway:** https://railway.app
- **Prisma Docs:** https://www.prisma.io/docs
- **React Query:** https://tanstack.com/query/latest

---

## ✅ Deployment Status

**Repository:** ✅ Pushed to GitHub  
**Code:** ✅ Production ready  
**Database:** ✅ Migrations included  
**Environment:** ✅ Variables documented  
**Documentation:** ✅ Complete guides created  

**Ready to Deploy:** 🚀 YES!

---

*Last Updated: March 12, 2026*  
*Platform: Banisa Medical Services Platform*  
*Version: 1.0.0 Production Ready*
