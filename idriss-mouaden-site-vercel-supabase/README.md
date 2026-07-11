# Idriss Mouaden — Academic portfolio

Multi-page academic portfolio built with Next.js and deployed on Vercel.

Production: <https://idriss-mouaden.vercel.app>

## Content system

- Supabase Postgres stores research and writing records.
- Supabase Storage stores private PDF files.
- Supabase Auth protects `/admin` with an email sign-in link.
- Row Level Security exposes only published records and documents publicly.

## Local development

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Then run:

```bash
npm install
npm run dev
```

The production database schema is versioned under `supabase/migrations`.
