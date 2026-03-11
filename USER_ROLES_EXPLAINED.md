# 👥 User Roles in Banisa Platform - Database Structure

## 🎯 Yes, You're Absolutely Correct!

**Clinic Admin** and **Super Admin** are completely different roles in the database with different permissions and data relationships.

---

## 📊 Database Schema Overview

### 1. **User Model** (Central Authentication Table)

```sql
model User {
  id           String     @id @default(uuid())
  phone        String     @unique
  email        String?
  passwordHash String
  firstName    String?
  lastName     String?
  role         Role       @default(PATIENT)
  status       UserStatus @default(PENDING)
  isActive     Boolean    @default(true)
  clinicId     String?    @unique  <-- KEY FIELD!
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
```

### 2. **Role Enum** (Different User Types)

```sql
enum Role {
  SUPER_ADMIN      <-- Platform administrator
  CLINIC_ADMIN     <-- Clinic administrator  
  PATIENT          <-- Regular user
  PENDING_CLINIC   <-- Clinic waiting approval
}
```

### 3. **Clinic Model** (Clinic Information)

```sql
model Clinic {
  id          String       @id @default(uuid())
  nameUz      String
  nameRu      String?
  address     String?
  phone       String?
  email       String?
  status      ClinicStatus @default(PENDING)
  isActive    Boolean      @default(true)
  adminPhone  String?
  adminEmail  String?
  // ... other fields
}
```

---

## 🔐 Key Differences Between Roles

### **SUPER_ADMIN**
- **Purpose:** Platform administrator
- **Clinic Association:** `clinicId = NULL` (not linked to any clinic)
- **Permissions:**
  - Manage ALL clinics
  - Approve/reject clinic registrations
  - Create global services
  - View platform statistics
  - Manage all users

### **CLINIC_ADMIN**
- **Purpose:** Individual clinic administrator
- **Clinic Association:** `clinicId = <CLINIC_UUID>` (linked to specific clinic)
- **Permissions:**
  - Manage ONLY their own clinic
  - Customize services for their clinic
  - Manage clinic staff
  - View clinic statistics
  - Cannot see other clinics

---

## 🗂️ Database Relationships

### **Super Admin Data Flow**
```
User (role: SUPER_ADMIN, clinicId: NULL)
    ↓
Can access ALL Clinic records
    ↓
Can manage ALL DiagnosticService records
```

### **Clinic Admin Data Flow**
```
User (role: CLINIC_ADMIN, clinicId: "clinic-123")
    ↓
Can access ONLY Clinic where id = "clinic-123"
    ↓
Can manage ONLY ClinicDiagnosticService where clinicId = "clinic-123"
```

---

## 📋 Database Tables per Role

### **Tables Super Admin Can Access:**
- ✅ `User` (all records)
- ✅ `Clinic` (all records)
- ✅ `DiagnosticService` (all global services)
- ✅ `SurgicalService` (all global services)
- ✅ `ClinicDiagnosticService` (all clinic services)
- ✅ `ClinicRegistrationRequest` (all registrations)
- ✅ `ServiceCustomization` (all customizations)

### **Tables Clinic Admin Can Access:**
- ✅ `User` (only their own record)
- ✅ `Clinic` (only their own clinic)
- ✅ `DiagnosticService` (read-only global services)
- ✅ `ClinicDiagnosticService` (only their clinic's services)
- ✅ `ServiceCustomization` (only their clinic's customizations)
- ❌ `ClinicRegistrationRequest` (cannot access)
- ❌ Other clinics' data

---

## 🔍 Example Database Records

### **Super Admin Record**
```json
{
  "id": "user-super-123",
  "phone": "+998901234567",
  "role": "SUPER_ADMIN",
  "clinicId": null,
  "status": "APPROVED",
  "firstName": "Super",
  "lastName": "Admin"
}
```

### **Clinic Admin Record**
```json
{
  "id": "user-clinic-456",
  "phone": "+998905555555",
  "role": "CLINIC_ADMIN",
  "clinicId": "clinic-789",
  "status": "APPROVED",
  "firstName": "Clinic",
  "lastName": "Admin"
}
```

### **Corresponding Clinic Record**
```json
{
  "id": "clinic-789",
  "nameUz": "Shifokorlar Markazi",
  "phone": "+998905555555",
  "status": "APPROVED",
  "isActive": true
}
```

---

## 🛡️ Security Implications

### **Authentication Flow**
1. User logs in with phone/password
2. System checks `role` and `clinicId`
3. JWT token contains both `role` and `clinicId`
4. Middleware enforces role-based access

### **API Access Control**
```typescript
// Super Admin Route
router.use('/admin', requireRole('SUPER_ADMIN'))

// Clinic Admin Route  
router.use('/clinic', requireRole('CLINIC_ADMIN'))

// Clinic-specific data access
router.get('/clinic/services', async (req, res) => {
  const clinicId = req.user.clinicId;  // From JWT
  // Only return services for this clinicId
})
```

---

## 📊 User Registration Flow

### **1. Clinic Registration**
```
Step 1-8: Fill clinic information
    ↓
Creates: ClinicRegistrationRequest
    ↓
Status: PENDING
```

### **2. Admin Approval**
```
Super Admin reviews request
    ↓
Creates: Clinic record
    ↓
Creates: User record (role: CLINIC_ADMIN, clinicId: <clinic.id>)
    ↓
Status: APPROVED
```

### **3. Clinic Admin Login**
```
User logs in with phone/password
    ↓
JWT contains: { role: "CLINIC_ADMIN", clinicId: "clinic-789" }
    ↓
Can access only their clinic data
```

---

## 🎯 Summary

| Feature | Super Admin | Clinic Admin |
|---------|-------------|--------------|
| **Platform Access** | ✅ Entire platform | ❌ Only their clinic |
| **Clinic Management** | ✅ All clinics | ❌ Only own clinic |
| **Service Creation** | ✅ Global services | ❌ Cannot create |
| **Service Customization** | ❌ Not needed | ✅ For their clinic |
| **User Management** | ✅ All users | ❌ Only own staff |
| **Database `clinicId`** | `NULL` | `<CLINIC_UUID>` |
| **Login URL** | `/admin/login` | `/clinic/login` |
| **Dashboard URL** | `/admin/dashboard` | `/clinic/dashboard` |

---

## 🔍 Check Current Database

To see the actual users in your database:

```bash
cd /home/user/Desktop/code/banisa/backend
npx prisma studio
# Opens at http://localhost:5555

# Or query directly:
npx prisma db execute --stdin << 'EOF'
SELECT id, phone, role, clinicId, firstName, lastName 
FROM "User" 
ORDER BY role, createdAt;
EOF
```

This will show you exactly which users exist and their roles/clinic associations.

---

**Bottom Line:** Yes, you're 100% correct! Super Admins and Clinic Admins are completely separate roles with different data access patterns and permissions in the database.
