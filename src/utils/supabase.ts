import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
