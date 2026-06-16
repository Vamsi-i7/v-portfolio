export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_at: string | null
          achievement_type: string
          created_at: string | null
          icon_name: string | null
          id: string
          link_url: string | null
          platform: string | null
          status: string | null
          title: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          achieved_at?: string | null
          achievement_type: string
          created_at?: string | null
          icon_name?: string | null
          id?: string
          link_url?: string | null
          platform?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          achieved_at?: string | null
          achievement_type?: string
          created_at?: string | null
          icon_name?: string | null
          id?: string
          link_url?: string | null
          platform?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          category: string | null
          certificate_image_path: string | null
          created_at: string | null
          credential_id: string | null
          expires_at: string | null
          has_expiry: boolean | null
          id: string
          is_featured: boolean | null
          issued_at: string
          issuer_logo_path: string | null
          issuer_name: string
          status: string | null
          title: string
          updated_at: string | null
          verification_url: string | null
        }
        Insert: {
          category?: string | null
          certificate_image_path?: string | null
          created_at?: string | null
          credential_id?: string | null
          expires_at?: string | null
          has_expiry?: boolean | null
          id?: string
          is_featured?: boolean | null
          issued_at: string
          issuer_logo_path?: string | null
          issuer_name: string
          status?: string | null
          title: string
          updated_at?: string | null
          verification_url?: string | null
        }
        Update: {
          category?: string | null
          certificate_image_path?: string | null
          created_at?: string | null
          credential_id?: string | null
          expires_at?: string | null
          has_expiry?: boolean | null
          id?: string
          is_featured?: boolean | null
          issued_at?: string
          issuer_logo_path?: string | null
          issuer_name?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          verification_url?: string | null
        }
        Relationships: []
      }
      coding_cache: {
        Row: {
          cache_key: string
          data: Json
          error_message: string | null
          fetch_status: string | null
          fetched_at: string | null
          id: string
          platform: string
          ttl_minutes: number | null
        }
        Insert: {
          cache_key: string
          data: Json
          error_message?: string | null
          fetch_status?: string | null
          fetched_at?: string | null
          id?: string
          platform: string
          ttl_minutes?: number | null
        }
        Update: {
          cache_key?: string
          data?: Json
          error_message?: string | null
          fetch_status?: string | null
          fetched_at?: string | null
          id?: string
          platform?: string
          ttl_minutes?: number | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          company_logo_path: string | null
          company_name: string
          company_url: string | null
          created_at: string | null
          description_bullets: Json | null
          display_order: number | null
          employment_type: string
          end_date: string | null
          id: string
          is_current: boolean | null
          is_remote: boolean | null
          location: string | null
          role_title: string
          start_date: string
          status: string | null
          technologies: string[] | null
          updated_at: string | null
        }
        Insert: {
          company_logo_path?: string | null
          company_name: string
          company_url?: string | null
          created_at?: string | null
          description_bullets?: Json | null
          display_order?: number | null
          employment_type: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          is_remote?: boolean | null
          location?: string | null
          role_title: string
          start_date: string
          status?: string | null
          technologies?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company_logo_path?: string | null
          company_name?: string
          company_url?: string | null
          created_at?: string | null
          description_bullets?: Json | null
          display_order?: number | null
          employment_type?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          is_remote?: boolean | null
          location?: string | null
          role_title?: string
          start_date?: string
          status?: string | null
          technologies?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      journey_entries: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          entry_date: string
          entry_type: string
          icon_override: string | null
          id: string
          is_highlight: boolean | null
          link_label: string | null
          link_url: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          entry_date: string
          entry_type: string
          icon_override?: string | null
          id?: string
          is_highlight?: boolean | null
          link_label?: string | null
          link_url?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          entry_date?: string
          entry_type?: string
          icon_override?: string | null
          id?: string
          is_highlight?: boolean | null
          link_label?: string | null
          link_url?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          banner_path: string | null
          category: string | null
          created_at: string | null
          demo_url: string | null
          display_order: number | null
          ended_at: string | null
          github_stars: number | null
          github_url: string | null
          id: string
          is_featured: boolean | null
          is_ongoing: boolean | null
          long_description: string | null
          short_description: string | null
          slug: string
          started_at: string | null
          status: string | null
          tech_stack: string[] | null
          thumbnail_path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_path?: string | null
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          display_order?: number | null
          ended_at?: string | null
          github_stars?: number | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_ongoing?: boolean | null
          long_description?: string | null
          short_description?: string | null
          slug: string
          started_at?: string | null
          status?: string | null
          tech_stack?: string[] | null
          thumbnail_path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_path?: string | null
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          display_order?: number | null
          ended_at?: string | null
          github_stars?: number | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_ongoing?: boolean | null
          long_description?: string | null
          short_description?: string | null
          slug?: string
          started_at?: string | null
          status?: string | null
          tech_stack?: string[] | null
          thumbnail_path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          about_philosophy: string | null
          about_principles: Json | null
          availability_status: string | null
          bio: string | null
          contact_description: string | null
          contact_headline: string | null
          copyright_text: string | null
          created_at: string | null
          email: string | null
          footer_tagline: string | null
          full_name: string
          id: string
          location: string | null
          meta_description: string | null
          og_image_path: string | null
          owner_user_id: string | null
          profile_image_path: string | null
          response_protocol: string | null
          resume_path: string | null
          site_title: string | null
          social_links: Json | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          about_philosophy?: string | null
          about_principles?: Json | null
          availability_status?: string | null
          bio?: string | null
          contact_description?: string | null
          contact_headline?: string | null
          copyright_text?: string | null
          created_at?: string | null
          email?: string | null
          footer_tagline?: string | null
          full_name: string
          id?: string
          location?: string | null
          meta_description?: string | null
          og_image_path?: string | null
          owner_user_id?: string | null
          profile_image_path?: string | null
          response_protocol?: string | null
          resume_path?: string | null
          site_title?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          about_philosophy?: string | null
          about_principles?: Json | null
          availability_status?: string | null
          bio?: string | null
          contact_description?: string | null
          contact_headline?: string | null
          copyright_text?: string | null
          created_at?: string | null
          email?: string | null
          footer_tagline?: string | null
          full_name?: string
          id?: string
          location?: string | null
          meta_description?: string | null
          og_image_path?: string | null
          owner_user_id?: string | null
          profile_image_path?: string | null
          response_protocol?: string | null
          resume_path?: string | null
          site_title?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          icon_identifier: string | null
          id: string
          name: string
          proficiency: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          icon_identifier?: string | null
          id?: string
          name: string
          proficiency?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          icon_identifier?: string | null
          id?: string
          name?: string
          proficiency?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
