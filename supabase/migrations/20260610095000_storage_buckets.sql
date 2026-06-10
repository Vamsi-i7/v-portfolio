-- ============================================================
-- Migration: Storage Buckets & Policies
-- Phase 1.3 — Milestone 1.3.2
-- ============================================================
-- This migration creates the storage buckets for assets,
-- resumes, certificates, and logos. It also configures
-- the required RLS policies on storage.objects to ensure
-- only the admin can upload/update/delete, while the public
-- can read.
-- ============================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('portfolio-assets', 'portfolio-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('certificates', 'certificates', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('resumes', 'resumes', true, 5242880, ARRAY['application/pdf']),
  ('logos', 'logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);

-- 2. Enable RLS on storage.objects (usually enabled by default, but safe to ensure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Storage Policies

-- bucket: portfolio-assets
CREATE POLICY "portfolio_assets_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "portfolio_assets_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());
CREATE POLICY "portfolio_assets_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-assets' AND public.is_admin());
CREATE POLICY "portfolio_assets_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- bucket: certificates
CREATE POLICY "certificates_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "certificates_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND public.is_admin());
CREATE POLICY "certificates_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'certificates' AND public.is_admin());
CREATE POLICY "certificates_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND public.is_admin());

-- bucket: resumes
CREATE POLICY "resumes_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "resumes_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND public.is_admin());
CREATE POLICY "resumes_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND public.is_admin());
CREATE POLICY "resumes_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND public.is_admin());

-- bucket: logos
CREATE POLICY "logos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "logos_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND public.is_admin());
CREATE POLICY "logos_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND public.is_admin());
CREATE POLICY "logos_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND public.is_admin());
