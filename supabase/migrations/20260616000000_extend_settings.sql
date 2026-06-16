-- Migration: Extend settings table with customizable portfolio copy fields
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS about_philosophy text,
ADD COLUMN IF NOT EXISTS about_principles jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS availability_status text,
ADD COLUMN IF NOT EXISTS contact_headline text,
ADD COLUMN IF NOT EXISTS contact_description text,
ADD COLUMN IF NOT EXISTS response_protocol text,
ADD COLUMN IF NOT EXISTS footer_tagline text,
ADD COLUMN IF NOT EXISTS copyright_text text;
