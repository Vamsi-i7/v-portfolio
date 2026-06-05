/**
 * Global TypeScript Type Declarations
 *
 * This file contains ambient module declarations and global type augmentations.
 * All domain-specific types (Project, Skill, etc.) will be defined in
 * src/types/ as individual files in Wave 2+.
 */

// Ensure this file is treated as a module
export {};

// Environment variable type safety
// Any VITE_ prefixed env var used in the app must be declared here.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
