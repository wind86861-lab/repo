# 🚀 Banisa Medical Platform - Running Guide

## ✅ Project Status: RUNNING

**Backend Server:** ✅ Running on http://localhost:5000  
**Frontend Server:** ✅ Running on http://localhost:5173  
**Database:** ✅ Connected (PostgreSQL)  
**Browser Preview:** ✅ Available at http://127.0.0.1:45855

---

## 📋 Quick Access URLs

### Main Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Browser Preview:** http://127.0.0.1:45855

### Admin Portal
- **Super Admin Login:** http://localhost:5173/admin/login
- **Admin Dashboard:** http://localhost:5173/admin/dashboard
- **Clinics Management:** http://localhost:5173/admin/clinics
- **Services Management:** http://localhost:5173/admin/services

### Clinic Portal
- **Clinic Login:** http://localhost:5173/clinic/login
- **Clinic Dashboard:** http://localhost:5173/clinic/dashboard
- **Clinic Services:** http://localhost:5173/clinic/services
- **Clinic Profile:** http://localhost:5173/clinic/profile

### Clinic Registration
- **Self-Registration:** http://localhost:5173/register
- **Registration Status:** http://localhost:5173/register/status
- **Registration Login:** http://localhost:5173/register/login

---

## 🔑 Default Credentials

### Super Admin
```
Phone: +998901234567
Password: admin123
```

### Test Clinic Admin
```
Phone: (check database after registration)
Password: (set during registration)
```

---

## 🛠️ Running Commands

### Start Both Servers (Current Status)
```bash
# Backend (already running)
cd /home/user/Desktop/code/banisa/backend
npm run dev

# Frontend (already running)
cd /home/user/Desktop/code/banisa/code
npm run dev
```

### Stop Servers
```bash
# Find and kill processes
lsof -ti:5000,5173 | xargs kill -9

# Or use Ctrl+C in each terminal
```

### Restart Servers
```bash
# Kill existing processes
lsof -ti:5000,5173 | xargs kill -9

# Start backend
cd /home/user/Desktop/code/banisa/backend && npm run dev &

# Start frontend
cd /home/user/Desktop/code/banisa/code && npm run dev &
```

---

## 📊 Database Management

### View Database with Prisma Studio
```bash
cd /home/user/Desktop/code/banisa/backend
npx prisma studio
```
Opens at: http://localhost:5555

### Run Migrations
```bash
cd /home/user/Desktop/code/banisa/backend
npx prisma migrate dev
```

### Reset Database (⚠️ Deletes all data)
```bash
cd /home/user/Desktop/code/banisa/backend
npx prisma migrate reset
```

### Seed Database
```bash
cd /home/user/Desktop/code/banisa/backend
npx prisma db seed
```

---

## 🧪 Testing Features

### 1. Super Admin Features
1. Login at http://localhost:5173/admin/login
2. View clinics at http://localhost:5173/admin/clinics
3. Manage services at http://localhost:5173/admin/services
4. Review clinic registrations

### 2. Clinic Registration Flow
1. Go to http://localhost:5173/register
2. Complete 8-step registration wizard
3. Wait for admin approval
4. Login at http://localhost:5173/clinic/login

### 3. Clinic Admin Features
1. Login at http://localhost:5173/clinic/login
2. View dashboard at http://localhost:5173/clinic/dashboard
3. Manage services at http://localhost:5173/clinic/services
4. Customize services (click "Moslashtirish" button)
5. Activate/deactivate services

### 4. Service Customization
1. Login as clinic admin
2. Go to Services page
3. Click "Aktivlashtirish" to activate a service
4. Click "Moslashtirish" (Settings icon) to customize
5. Edit in 4 tabs:
   - **Asosiy ma'lumotlar** - Names, descriptions, benefits
   - **Rasmlar** - Upload up to 5 images
   - **Ish vaqti** - Set available days and time slots
   - **Qo'shimcha** - Booking settings, prepayment

---

## 🔍 API Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Get Available Services (Clinic)
```bash
curl http://localhost:5000/api/clinic/services/available \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Activate Service
```bash
curl -X POST http://localhost:5000/api/clinic/services/activate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "SERVICE_UUID"}'
```

### Get Service Customization
```bash
curl http://localhost:5000/api/clinic/services/CLINIC_SERVICE_ID/customization \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 Project Structure

```
banisa/
├── backend/                    # Node.js + Express + Prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── admin/         # Super Admin features
│   │   │   ├── clinic/        # Clinic features
│   │   │   │   └── services/  # Service customization
│   │   │   └── clinics/       # Clinic management
│   │   ├── middleware/        # Auth, upload, validation
│   │   └── server.ts          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts            # Seed data
│   └── package.json
│
└── code/                       # React + Vite frontend
    ├── src/
    │   ├── admin/             # Super Admin portal
    │   ├── clinic/            # Clinic Admin portal
    │   │   ├── pages/         # Dashboard, Services, etc.
    │   │   ├── components/    # Reusable components
    │   │   └── hooks/         # React Query hooks
    │   ├── clinic-registration/ # Self-registration flow
    │   ├── shared/            # Shared utilities
    │   │   ├── auth/          # Auth context, guards
    │   │   └── api/           # Axios instance
    │   └── App.jsx            # Main app component
    └── package.json
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Check database connection
cd backend && npx prisma db push
```

### Frontend won't start
```bash
# Check if port 5173 is in use
lsof -ti:5173

# Kill the process
lsof -ti:5173 | xargs kill -9

# Clear cache and restart
cd code && rm -rf node_modules/.vite && npm run dev
```

### Database connection error
```bash
# Check .env file exists
cat backend/.env

# Should contain:
# DATABASE_URL="postgresql://user:password@localhost:5432/banisa"

# Test connection
cd backend && npx prisma db push
```

### CORS errors
Check `backend/src/config/env.ts`:
```typescript
corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
```

### 401 Unauthorized errors
- Check if you're logged in
- Check if token is valid
- Check if token is being sent in Authorization header

---

## 📝 Development Workflow

### 1. Make Backend Changes
```bash
cd backend
# Edit files in src/
# Server auto-restarts with ts-node
```

### 2. Make Frontend Changes
```bash
cd code
# Edit files in src/
# Vite hot-reloads automatically
```

### 3. Database Schema Changes
```bash
cd backend
# Edit prisma/schema.prisma
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

### 4. Add New API Endpoint
1. Create validation schema in `validation.ts`
2. Add service method in `service.ts`
3. Add controller method in `controller.ts`
4. Add route in `routes.ts`
5. Test with curl or Postman

### 5. Add New Frontend Page
1. Create page component in `src/clinic/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in sidebar
4. Create React Query hooks if needed

---

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/banisa"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_REFRESH_SECRET="your-refresh-secret-different-from-jwt"
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:5173"
DEFAULT_ADMIN_PHONE="+998901234567"
DEFAULT_ADMIN_PASSWORD="admin123"
```

### Frontend (optional .env)
```env
VITE_API_URL="http://localhost:5000"
```

---

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd code
npm run build
# Outputs to code/dist/
```

---

## 🎯 Current Features

### ✅ Implemented
- [x] Super Admin authentication
- [x] Clinic self-registration (8-step wizard)
- [x] Admin clinic approval workflow
- [x] Clinic admin portal
- [x] Service management (activate/deactivate)
- [x] **Service customization system** (NEW)
  - [x] Custom names and descriptions
  - [x] Image gallery (up to 5 images)
  - [x] Custom scheduling
  - [x] Booking settings
- [x] Checkup packages
- [x] Dashboard with statistics
- [x] Profile management

### 🚧 In Progress
- [ ] Appointment booking
- [ ] Payment integration
- [ ] SMS notifications
- [ ] Doctor management
- [ ] Patient records

---

## 📞 Support

### Logs Location
- **Backend logs:** Terminal where `npm run dev` is running
- **Frontend logs:** Browser console (F12)
- **Database logs:** Check PostgreSQL logs

### Common Issues
1. **Port already in use:** Kill the process with `lsof -ti:PORT | xargs kill -9`
2. **Database migration failed:** Run `npx prisma migrate reset` and re-seed
3. **Module not found:** Run `npm install` in the respective directory
4. **CORS errors:** Check `CORS_ORIGIN` in backend `.env`

---

## ✅ Current Status Summary

**Servers Running:**
- ✅ Backend: http://localhost:5000 (PID: check with `lsof -ti:5000`)
- ✅ Frontend: http://localhost:5173 (PID: check with `lsof -ti:5173`)

**Database:**
- ✅ Connected to PostgreSQL
- ✅ 3 migrations applied
- ✅ Seed data loaded

**Features Ready:**
- ✅ Admin portal fully functional
- ✅ Clinic registration working
- ✅ Service customization complete
- ✅ Image upload operational

**Next Steps:**
1. Open http://localhost:5173 in your browser
2. Login as Super Admin or register a new clinic
3. Test service customization features
4. Deploy to Railway when ready

---

**Last Updated:** March 12, 2026 at 1:47 AM UTC+05:00  
**Project Version:** 1.0.0  
**Status:** ✅ FULLY OPERATIONAL
