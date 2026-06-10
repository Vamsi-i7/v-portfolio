-- ============================================================
-- Migration: Grant Table Permissions
-- Phase 1.4 — Security Fix
-- ============================================================
-- Even with RLS enabled, the Postgrest API (authenticated/anon roles)
-- needs basic SQL GRANTs to perform SELECT/INSERT/UPDATE/DELETE.
-- Without these, Supabase returns a 403 Forbidden (42501).
-- ============================================================

-- Grant usage on public schema to all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on ALL tables to the relevant roles
-- RLS policies will still filter the actual data access.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Ensure future tables also get these permissions automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- Specifically for sequences (if any tables use serial/identity)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
