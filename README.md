# Small Runs

Static landing page for Small Runs.

## Admin portal (inventory dashboard)

There is a basic admin dashboard at:

- `/admin/` (on GitHub Pages: `https://rorynoble.github.io/small-runs/admin/`)

It uses **Supabase** for:

- Login (email + password)
- Inventory table (read/write)

Important: GitHub Pages is static hosting. The UI code is public, but your Supabase data is protected by **Row Level Security (RLS)**.

### Setup

1) Create a Supabase project
2) In Supabase, run `admin/supabase.sql` in the SQL editor
3) Create (or invite) the admin user in Supabase Auth:
   - `rory@fiveammusic.com`
4) Open the admin page and click **Settings**, paste:
   - Supabase Project URL
   - Supabase anon key

Those settings are stored in your browser localStorage on that device.

## Local preview

```bash
python3 -m http.server 4321
```

Then open http://127.0.0.1:4321
