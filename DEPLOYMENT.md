# Deployment — StockPilot

1. **Supabase**: создать проект → SQL Editor → выполнить `sql/schema.sql` (создаст таблицы, RPC `register_movement`, RLS) → Auth → `demo@example.com` / `Demo123!`
2. **Seed**: `.env.local` с ключами → `npm run db:seed`
3. **Vercel**: import → env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) → Deploy
4. **Проверка**: login → `/products` (таблица с low-бейджами) → `/movements` (зарегистрировать приход) → Export CSV
