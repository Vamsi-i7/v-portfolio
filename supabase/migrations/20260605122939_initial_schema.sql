-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Table: settings
CREATE TABLE settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id uuid REFERENCES auth.users(id),
    full_name text NOT NULL,
    tagline text,
    bio text,
    location text,
    email text,
    profile_image_path text,
    resume_path text,
    og_image_path text,
    site_title text,
    meta_description text,
    social_links jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: projects
CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    short_description text,
    long_description text,
    category text,
    tech_stack text[] DEFAULT '{}',
    demo_url text,
    github_url text,
    thumbnail_path text,
    banner_path text,
    status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    is_featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    started_at date,
    ended_at date,
    is_ongoing boolean DEFAULT false,
    github_stars integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: skills
CREATE TABLE skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    category text NOT NULL,
    proficiency text CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
    icon_identifier text,
    display_order integer DEFAULT 0,
    status text CHECK (status IN ('draft', 'published')) DEFAULT 'published',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: journey_entries
CREATE TABLE journey_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    entry_type text NOT NULL,
    entry_date date NOT NULL,
    description text,
    icon_override text,
    tags text[] DEFAULT '{}',
    link_url text,
    link_label text,
    is_highlight boolean DEFAULT false,
    display_order integer,
    status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: achievements
CREATE TABLE achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    achievement_type text NOT NULL,
    platform text,
    value text,
    icon_name text,
    achieved_at date,
    link_url text,
    status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: certificates
CREATE TABLE certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    issuer_name text NOT NULL,
    issuer_logo_path text,
    category text,
    certificate_image_path text,
    verification_url text,
    credential_id text,
    issued_at date NOT NULL,
    expires_at date,
    has_expiry boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: experience
CREATE TABLE experience (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL,
    role_title text NOT NULL,
    employment_type text NOT NULL,
    location text,
    is_remote boolean DEFAULT false,
    start_date date NOT NULL,
    end_date date,
    is_current boolean DEFAULT false,
    description_bullets jsonb DEFAULT '[]'::jsonb,
    technologies text[] DEFAULT '{}',
    company_url text,
    company_logo_path text,
    display_order integer DEFAULT 0,
    status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: coding_cache
CREATE TABLE coding_cache (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    platform text NOT NULL,
    cache_key text NOT NULL,
    data jsonb NOT NULL,
    fetched_at timestamptz DEFAULT now(),
    ttl_minutes integer DEFAULT 360,
    fetch_status text,
    error_message text,
    UNIQUE(platform, cache_key)
);

-- Table: audit_log
CREATE TABLE audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    entity_name text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Apply updated_at triggers
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_entries_updated_at BEFORE UPDATE ON journey_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create Indexes
CREATE INDEX idx_projects_status_order ON projects(status, display_order);
CREATE INDEX idx_projects_featured_status ON projects(is_featured, status);
CREATE INDEX idx_journey_entries_date_status ON journey_entries(entry_date DESC, status);
CREATE INDEX idx_achievements_type_status ON achievements(achievement_type, status);
CREATE INDEX idx_certificates_status_issued ON certificates(status, issued_at DESC);
CREATE INDEX idx_experience_status_start ON experience(status, start_date DESC);
CREATE INDEX idx_skills_category_order ON skills(category, display_order);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
