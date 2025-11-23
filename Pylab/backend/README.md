# PyLab Backend (Express + MySQL)

Small backend to support the frontend in `Pylab` for registering and logging in users.

Files added:

- `server.js` — Express server exposing `/api/register` and `/api/login`.
- `db.js` — MySQL connection pool using `mysql2/promise`.
- `.env.example` — example environment variables.

Quick start (Windows PowerShell):

```powershell
cd Pylab\backend
npm install
copy .env.example .env
# Edit .env and fill DB credentials
# Ensure MySQL/MariaDB is running and import schema if needed:
#   Use the SQL in ../Db/pylab.sql to create the `users` table and other tables
# Example import (adjust for your setup):
# mysql -u root -p pylab < ..\Db\pylab.sql
npm run dev
```

Endpoints:

- `POST /api/register` — body: `{ "email": "...", "password": "...", "name": "Optional" }`.
  - Responses: `201` on success `{ id, message }`, `409` if email exists.
- `POST /api/login` — body: `{ "email": "...", "password": "..." }`.
  - Responses: `200` with `{ id, name, email, message }` on success, `401` invalid.

Notes:

- Passwords are hashed with `bcrypt` before storing.
- This implementation returns simple JSON responses. For production, add session management or JWT, validation, rate-limiting, and HTTPS.
