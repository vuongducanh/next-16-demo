

---

## Setup

```bash
# Generate Prisma Client
npx prisma generate

# Migrate database (dev)
npx prisma migrate dev

# Mở Prisma Studio để xem database
npx prisma studio

```

---

## Development

```bash
npm run dev -- -p 3001 --inspect=localhost:3002
```

* App chạy tại: `http://localhost:3001`
* Debug tại: `localhost:3002`

---

## Database

* Neon Console:
  [https://console.neon.tech/app/projects/royal-tree-01035864?database=neondb](https://console.neon.tech/app/projects/royal-tree-01035864?database=neondb)

---

## Secret

```bash
openssl rand -base64 32
```

→ Dùng để tạo `SESSION_SECRET`

---

## Environment

* Node.js: **v22.22.0**

---
