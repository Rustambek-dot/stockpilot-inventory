# Case Study: StockPilot — Inventory Management

## Краткое описание
Система складского учёта: каталог SKU, мультилокационные остатки, журнал движений, low-stock алерты, CSV импорт/экспорт, отчёты по оборачиваемости.

## Проблема клиента
Розничная сеть вела учёт в Excel: остатки расходились с реальностью на 10–15%, внезапные out-of-stock топовых позиций, никакой истории «кто и почему списал».

## Решение
Единая система с транзакционным учётом: каждое движение фиксируется в журнале и атомарно меняет остаток (PostgreSQL RPC). Минимальные остатки подсвечивают дефицит до того, как он случился.

## Моя роль
Full-stack: модель данных с транзакционной целостностью, RLS, UI плотных таблиц, отчёты, деплой.

## Технологии
Next.js 15, React 19, TypeScript, Tailwind, Supabase (PostgreSQL + RLS + RPC), Recharts, Zod.

## Ключевые архитектурные решения
- **Атомарность остатков**: функция `register_movement()` вставляет движение и обновляет stock в одной транзакции — журнал и остатки не могут разойтись.
- **UNIQUE(org_id, sku)** — дубликаты SKU исключены на уровне БД.
- **Материализованный stock** вместо суммирования движений — O(1) чтение остатков при любом объёме журнала.
- Роли admin/manager/warehouse с RLS-изоляцией по организации.

## Результаты (ожидаемые)
- Точность остатков: с ~85% до 99%+
- Out-of-stock топовых SKU: предотвращается алертами
- Инвентаризация: часы вместо дней (история каждого движения)

## Тексты

**GitHub About:** Inventory management system — multi-location stock, transactional movement journal (PostgreSQL RPC), low-stock alerts, CSV import/export. Next.js 15 + Supabase.
**Topics:** `nextjs` `typescript` `supabase` `inventory` `warehouse` `postgresql` `saas`

**LinkedIn:** 📦 Построил систему складского учёта StockPilot: транзакционная целостность остатков через PostgreSQL RPC (журнал и stock не могут разойтись), мультилокации, low-stock алерты, CSV-отчёты. Next.js 15 + Supabase, плотные data-таблицы с сортировкой и фильтрами.

**Upwork:** I built a production inventory system (Next.js 15, Supabase/PostgreSQL): SKU catalog, multi-location stock with atomic movement registration, low-stock alerts, movement audit trail, CSV export, and turnover reports. Excel-to-system migrations are my specialty.

**Резюме:** StockPilot (Next.js 15, Supabase) — складской учёт с атомарными движениями через PostgreSQL RPC, мультилокациями и low-stock алертами.
