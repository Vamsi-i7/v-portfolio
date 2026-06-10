-- ============================================================
-- Migration: Fix RLS Chicken-and-Egg Problem
-- Phase 1.4 — Bug Fix
-- ============================================================
-- The previous settings_admin_insert policy required the user
-- to already be an admin to insert their first settings row.
-- This migration fixes that and robustifies the is_admin() function.
-- ============================================================

-- 1. Robustify is_admin() helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.settings WHERE owner_user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix Settings INSERT policy
DROP POLICY IF EXISTS "settings_admin_insert" ON settings;
CREATE POLICY "settings_admin_insert"
    ON settings FOR INSERT
    WITH CHECK (
        -- Allow if user is authenticated AND either:
        -- 1. Table is empty (the very first user)
        -- 2. OR the user is inserting their own row (if table isn't empty)
        auth.uid() IS NOT NULL AND (
            NOT EXISTS (SELECT 1 FROM public.settings)
            OR 
            owner_user_id = auth.uid()
        )
    );

-- 3. Add UNIQUE constraint to owner_user_id to ensure single-admin system
-- First delete any accidental duplicates if they somehow exist (safety)
DELETE FROM settings WHERE id NOT IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY owner_user_id ORDER BY created_at) as rn
        FROM settings
    ) t WHERE rn = 1
);

ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_owner_user_id_key;
ALTER TABLE settings ADD CONSTRAINT settings_owner_user_id_key UNIQUE (owner_user_id);
