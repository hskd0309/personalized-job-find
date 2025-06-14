export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied_date: string
          company_name: string
          created_at: string
          id: string
          job_id: string
          job_title: string
          location: string | null
          notes: string | null
          resume_url: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date?: string
          company_name: string
          created_at?: string
          id?: string
          job_id: string
          job_title: string
          location?: string | null
          notes?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string
          company_name?: string
          created_at?: string
          id?: string
          job_id?: string
          job_title?: string
          location?: string | null
          notes?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          position: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_matches: {
        Row: {
          applied: boolean | null
          created_at: string
          id: string
          job_id: string
          match_reasons: string[] | null
          match_score: number | null
          user_id: string
          viewed: boolean | null
        }
        Insert: {
          applied?: boolean | null
          created_at?: string
          id?: string
          job_id: string
          match_reasons?: string[] | null
          match_score?: number | null
          user_id: string
          viewed?: boolean | null
        }
        Update: {
          applied?: boolean | null
          created_at?: string
          id?: string
          job_id?: string
          match_reasons?: string[] | null
          match_score?: number | null
          user_id?: string
          viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_job_matches_job_id"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          applications_count: number | null
          created_at: string
          description: string
          experience_level: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          requirements: string
          salary_max: number | null
          salary_min: number | null
          skills_required: string[] | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          applications_count?: number | null
          created_at?: string
          description: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements: string
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          applications_count?: number | null
          created_at?: string
          description?: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_description: string | null
          company_name: string | null
          company_size: string | null
          company_website: string | null
          created_at: string
          email: string | null
          experience: Json | null
          first_name: string | null
          id: string
          industry: string | null
          last_name: string | null
          location: string | null
          phone: string | null
          profile_completion: number | null
          skills: string[] | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_description?: string | null
          company_name?: string | null
          company_size?: string | null
          company_website?: string | null
          created_at?: string
          email?: string | null
          experience?: Json | null
          first_name?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          profile_completion?: number | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_description?: string | null
          company_name?: string | null
          company_size?: string | null
          company_website?: string | null
          created_at?: string
          email?: string | null
          experience?: Json | null
          first_name?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          profile_completion?: number | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      resume_uploads: {
        Row: {
          ai_feedback: string | null
          ai_score: number | null
          created_at: string
          education_level: string | null
          experience_years: number | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          parsed_data: Json | null
          skills_extracted: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          ai_score?: number | null
          created_at?: string
          education_level?: string | null
          experience_years?: number | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          parsed_data?: Json | null
          skills_extracted?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          ai_score?: number | null
          created_at?: string
          education_level?: string | null
          experience_years?: number | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          parsed_data?: Json | null
          skills_extracted?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: Json
          created_at: string
          id: string
          template_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          template_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          template_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_gap_analysis: {
        Row: {
          created_at: string
          current_skills: string[] | null
          id: string
          missing_skills: string[] | null
          recommendations: string[] | null
          required_skills: string[] | null
          skill_gap_score: number | null
          target_job_title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_skills?: string[] | null
          id?: string
          missing_skills?: string[] | null
          recommendations?: string[] | null
          required_skills?: string[] | null
          skill_gap_score?: number | null
          target_job_title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_skills?: string[] | null
          id?: string
          missing_skills?: string[] | null
          recommendations?: string[] | null
          required_skills?: string[] | null
          skill_gap_score?: number | null
          target_job_title?: string
          updated_at?: string
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
