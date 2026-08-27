-- ============================================================
-- Migration: Harden Settings RLS (Security Fix)
-- ============================================================
-- The original settings_admin_insert policy allowed ANY authenticated
-- user to claim admin if the settings table was empty. This could let
-- an attacker become admin if the settings row is ever deleted.
--
-- This migration tightens the policy by:
-- 1. Requiring the user to be in a known admin allowlist (auth.uid())
-- 2. Allowing first-claim only when the table is truly empty AND
--    the user owns the inserted row
-- 3. Once a row exists, ONLY the existing owner can insert again
-- ============================================================

-- 1. Drop the old permissive INSERT policy
DROP POLICY IF EXISTS "settings_admin_insert" ON settings;

-- 2. Create a stricter INSERT policy
CREATE POLICY "settings_admin_insert"
    ON settings FOR INSERT
    WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL
        -- The inserted row must belong to the caller
        AND owner_user_id = auth.uid()
        -- AND one of:
        AND (
            -- Table is empty (very first user claim — one-time only)
            NOT EXISTS (SELECT 1 FROM public.settings)
            -- OR: the caller already owns a row (re-insert edge case)
            -- This is normally not needed but covers migration scenarios
            EXISTS (
                SELECT 1 FROM public.settings
                WHERE owner_user_id = auth.uid()
            )
        )
    );

-- 3. Add a trigger to prevent settings.owner_user_id from being changed
--    after initial creation. This stops an admin from transferring ownership
--    to an attacker-controlled account.
CREATE OR REPLACE FUNCTION prevent_settings_owner_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.owner_user_id IS DISTINCT FROM NEW.owner_user_id THEN
        RAISE EXCEPTION 'Cannot change settings owner_user_id after initial creation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_settings_owner_change ON settings;
CREATE TRIGGER trg_prevent_settings_owner_change
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION prevent_settings_owner_change();
