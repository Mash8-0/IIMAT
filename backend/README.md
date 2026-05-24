# IIMAT College — Backend API

Production-ready REST API for the IIMAT College website built with Node.js, Express, PostgreSQL, and Prisma.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Uploads | Multer |
| Validation | Zod |
| CORS | cors |

---

## Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and update:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a long, random secret string
- `CLIENT_URL` — your frontend URL (for CORS)

### 3. Run database migrations

```bash
npm run db:migrate
# or for production:
npx prisma migrate deploy
```

### 4. Generate Prisma client

```bash
npm run db:generate
```

### 5. Seed the database

```bash
npm run db:seed
```

Default admin credentials after seeding:
- **Email:** admin@iimat.edu.my
- **Password:** Admin@12345

> Change these in `prisma/seed.js` before running in production.

### 6. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Seed data
├── src/
│   ├── config/
│   │   ├── db.js           # Prisma client instance
│   │   └── multer.js       # File upload config
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, roles, errors, upload
│   ├── routes/             # Express route definitions
│   ├── utils/              # Helpers (token, slug, response)
│   ├── validators/         # Zod schema validators
│   ├── app.js              # Express app setup
│   └── server.js           # Entry point
├── uploads/
│   ├── applications/       # Uploaded application documents
│   ├── programmes/         # Programme images
│   └── schools/            # School images
├── .env.example
└── package.json
```

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| POST | `/api/auth/register` | super_admin | Register new user |
| GET | `/api/auth/me` | Protected | Get current user |

### Schools (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools` | Get all active schools |
| GET | `/api/schools/:slug` | Get school + programmes by slug |

### Schools (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools/admin/all` | Get all schools |
| POST | `/api/admin/schools` | Create school (with image) |
| PUT | `/api/admin/schools/:id` | Update school |
| DELETE | `/api/admin/schools/:id` | Delete school |

### Programmes (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programmes` | Get all active programmes (supports `?search=&level=`) |
| GET | `/api/programmes/:slug` | Get programme by slug |
| GET | `/api/programmes/school/:schoolSlug` | Get programmes by school |

### Programmes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programmes/admin/all` | Get all programmes (supports `?page=&limit=&schoolId=&status=`) |
| POST | `/api/admin/programmes` | Create programme |
| PUT | `/api/admin/programmes/:id` | Update programme |
| DELETE | `/api/admin/programmes/:id` | Delete programme |

### Inquiries

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit inquiry (public) |
| GET | `/api/inquiries/admin` | List all inquiries |
| GET | `/api/inquiries/admin/:id` | Get inquiry |
| PUT | `/api/inquiries/admin/:id/status` | Update status |
| DELETE | `/api/inquiries/admin/:id` | Delete inquiry |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit application + documents (public) |
| GET | `/api/applications/admin` | List all applications |
| GET | `/api/applications/admin/:id` | Get application + documents |
| PUT | `/api/applications/admin/:id/status` | Update application status |
| PUT | `/api/applications/admin/:id/remarks` | Add/update remarks |
| DELETE | `/api/applications/admin/:id` | Delete application |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Summary stats + recent activity |

---

## File Uploads

Files are served statically from `/uploads/`.

**Application documents** — sent as `multipart/form-data` with these field names:

| Field | Type | Max Count |
|-------|------|-----------|
| `passport` | PDF/JPG/PNG | 1 |
| `academic` | PDF/JPG/PNG | 3 |
| `photo` | JPG/PNG | 1 |
| `english_cert` | PDF/JPG/PNG | 1 |
| `other` | PDF/JPG/PNG | 3 |

Max file size: **5 MB** per file.

---

## API Testing Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iimat.edu.my","password":"Admin@12345"}'
```

### Get all schools (public)
```bash
curl http://localhost:5000/api/schools
```

### Submit inquiry (public)
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Ahmad bin Ali",
    "email": "ahmad@example.com",
    "phone": "0123456789",
    "interestedProgramme": "Diploma in Nursing",
    "message": "I would like to know more about the nursing programme."
  }'
```

### Submit application with documents
```bash
curl -X POST http://localhost:5000/api/applications \
  -F "studentName=Ahmad bin Ali" \
  -F "email=ahmad@example.com" \
  -F "phone=0123456789" \
  -F "passportNo=A12345678" \
  -F "nationality=Malaysian" \
  -F "dateOfBirth=2000-01-15" \
  -F "selectedProgramme=Diploma in Nursing" \
  -F "academicQualification=SPM 2018 - 5As" \
  -F "passport=@/path/to/passport.pdf" \
  -F "academic=@/path/to/cert.pdf"
```

### Get dashboard (protected)
```bash
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Role Permissions

| Action | super_admin | admin | staff |
|--------|:-----------:|:-----:|:-----:|
| Register users | ✅ | ❌ | ❌ |
| Create/Edit schools | ✅ | ✅ | ❌ |
| Create/Edit programmes | ✅ | ✅ | ❌ |
| View inquiries | ✅ | ✅ | ✅ |
| Update inquiry status | ✅ | ✅ | ✅ |
| View applications | ✅ | ✅ | ✅ |
| Update application status | ✅ | ✅ | ✅ |
| Delete records | ✅ | ✅ | ❌ |

---

## Prisma Commands

```bash
# Create and apply a new migration
npm run db:migrate

# Apply migrations in production (no prompts)
npx prisma migrate deploy

# Reset database (drops all data!)
npm run db:reset

# Open Prisma Studio (visual DB browser)
npm run db:studio

# Re-generate Prisma client after schema changes
npm run db:generate
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change default admin password in `prisma/seed.js`
- [ ] Set `CLIENT_URL` to your actual frontend domain
- [ ] Set `DATABASE_URL` to your production PostgreSQL URL
- [ ] Run `npx prisma migrate deploy` (not `migrate dev`)
- [ ] Configure a reverse proxy (Nginx/Caddy) in front of the Node server
- [ ] Set up SSL/TLS (HTTPS)
- [ ] Store uploaded files on object storage (S3/Cloudflare R2) for production
