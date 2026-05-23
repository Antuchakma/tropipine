# TropiPine Server — Quick Start

Requirements
- Node.js 18+ and npm
- PostgreSQL (or Neon/Supabase) running and accessible

Setup

1. Install dependencies

```bash
cd tropipine-server
npm install
```

2. Copy environment file

```bash
cp .env.example .env
# edit .env and set DATABASE_URL and other values
```

3. Generate Prisma client and run migrations (after setting DATABASE_URL)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start the server (development)

```bash
npm run dev
```

Production

```bash
npm start
```

Useful commands

```bash
npx prisma studio   # open GUI to explore DB
npx prisma migrate deploy  # run migrations in CI/production
```
