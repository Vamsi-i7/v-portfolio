-- ============================================================
-- Migration: RLS Policies
-- Phase 1.3 — Row Level Security
-- ============================================================
-- This migration enables RLS on all 9 tables and creates
-- granular policies for public read, admin CRUD, and
-- service-role-only access patterns.
-- ============================================================

-- ============================================================
-- 1. Helper Function: is_admin()
-- ============================================================
-- SECURITY DEFINER: Runs with the privileges of the function
-- owner (postgres), not the caller. This prevents a circular
-- dependency where RLS on the settings table would block the
-- function from reading settings.owner_user_id.
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
    SELECT EXISTS (
        SELECT 1 FROM settings WHERE owner_user_id = auth.uid()
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- 2. Enable RLS on ALL tables
-- ============================================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS Policies: settings
-- ============================================================
-- Public: Full read access (name, bio, social links are public)
-- Admin: Full CRUD via is_admin()

CREATE POLICY "settings_public_read"
    ON settings FOR SELECT
    USING (true);

CREATE POLICY "settings_admin_insert"
    ON settings FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "settings_admin_update"
    ON settings FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "settings_admin_delete"
    ON settings FOR DELETE
    USING (is_admin());

-- ============================================================
-- 4. RLS Policies: projects
-- ============================================================
-- Public: Read only published rows
-- Admin: Full read (including drafts) + full CRUD

CREATE POLICY "projects_public_read"
    ON projects FOR SELECT
    USING (status = 'published');

CREATE POLICY "projects_admin_read"
    ON projects FOR SELECT
    USING (is_admin());

CREATE POLICY "projects_admin_insert"
    ON projects FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "projects_admin_update"
    ON projects FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "projects_admin_delete"
    ON projects FOR DELETE
    USING (is_admin());

-- ============================================================
-- 5. RLS Policies: skills
-- ============================================================
-- Public: Read only published rows
-- Admin: Full read + full CRUD

CREATE POLICY "skills_public_read"
    ON skills FOR SELECT
    USING (status = 'published');

CREATE POLICY "skills_admin_read"
    ON skills FOR SELECT
    USING (is_admin());

CREATE POLICY "skills_admin_insert"
    ON skills FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "skills_admin_update"
    ON skills FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "skills_admin_delete"
    ON skills FOR DELETE
    USING (is_admin());

-- ============================================================
-- 6. RLS Policies: journey_entries
-- ============================================================
-- Public: Read only published rows
-- Admin: Full read + full CRUD

CREATE POLICY "journey_entries_public_read"
    ON journey_entries FOR SELECT
    USING (status = 'published');

CREATE POLICY "journey_entries_admin_read"
    ON journey_entries FOR SELECT
    USING (is_admin());

CREATE POLICY "journey_entries_admin_insert"
    ON journey_entries FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "journey_entries_admin_update"
    ON journey_entries FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "journey_entries_admin_delete"
    ON journey_entries FOR DELETE
    USING (is_admin());

-- ============================================================
-- 7. RLS Policies: achievements
-- ============================================================
-- Public: Read only published rows
-- Admin: Full read + full CRUD

CREATE POLICY "achievements_public_read"
    ON achievements FOR SELECT
    USING (status = 'published');

CREATE POLICY "achievements_admin_read"
    ON achievements FOR SELECT
    USING (is_admin());

CREATE POLICY "achievements_admin_insert"
    ON achievements FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "achievements_admin_update"
    ON achievements FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "achievements_admin_delete"
    ON achievements FOR DELETE
    USING (is_admin());

-- ============================================================
-- 8. RLS Policies: certificates
-- ============================================================
-- Public: Read only published rows
-- Admin: Full read + full CRUD

CREATE POLICY "certificates_public_read"
    ON certificates FOR SELECT
    USING (status = 'published');

CREATE POLICY "certificates_admin_read"
    ON certificates FOR SELECT
    USING (is_admin());

CREATE POLICY "certificates_admin_insert"
    ON certificates FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "certificates_admin_update"
    ON certificates FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "certificates_admin_delete"
    ON certificates FOR DELETE
    USING (is_admin());

-- ============================================================
-- 9. RLS Policies: experience
-- ============================================================
-- Public: Read only published rows
-- Admin: Full read + full CRUD

CREATE POLICY "experience_public_read"
    ON experience FOR SELECT
    USING (status = 'published');

CREATE POLICY "experience_admin_read"
    ON experience FOR SELECT
    USING (is_admin());

CREATE POLICY "experience_admin_insert"
    ON experience FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "experience_admin_update"
    ON experience FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "experience_admin_delete"
    ON experience FOR DELETE
    USING (is_admin());

-- ============================================================
-- 10. RLS Policies: coding_cache
-- ============================================================
-- Public: Full read access (cached API data is non-sensitive)
-- Write: service_role only (bypasses RLS — no policy needed)

CREATE POLICY "coding_cache_public_read"
    ON coding_cache FOR SELECT
    USING (true);

-- No INSERT/UPDATE/DELETE policies.
-- The service_role key bypasses RLS entirely.
-- Cron functions use the service_role key to write cache data.

-- ============================================================
-- 11. RLS Policies: audit_log
-- ============================================================
-- Public: DENY all (no SELECT policy for anon = implicit deny)
-- Admin: Read-only access for dashboard activity feed
-- Write: service_role only (bypasses RLS — no policy needed)

CREATE POLICY "audit_log_admin_read"
    ON audit_log FOR SELECT
    USING (is_admin());

-- No INSERT/UPDATE/DELETE policies.
-- The service_role key bypasses RLS entirely.
-- Audit entries are written server-side only.
