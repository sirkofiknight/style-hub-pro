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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          assigned_staff: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          duration_minutes: number
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          assigned_staff?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          assigned_staff?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string
          expense_date: string
          id: string
          notes: string | null
          receipt_url: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          expense_date?: string
          id?: string
          notes?: string | null
          receipt_url?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          expense_date?: string
          id?: string
          notes?: string | null
          receipt_url?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      fabrics: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          material_type: string | null
          min_quantity_yards: number
          name: string
          notes: string | null
          price_per_yard: number | null
          quantity_yards: number
          sku: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          material_type?: string | null
          min_quantity_yards?: number
          name: string
          notes?: string | null
          price_per_yard?: number | null
          quantity_yards?: number
          sku?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          material_type?: string | null
          min_quantity_yards?: number
          name?: string
          notes?: string | null
          price_per_yard?: number | null
          quantity_yards?: number
          sku?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          ankle: number | null
          arm_hole: number | null
          back_width: number | null
          calf: number | null
          chest: number | null
          created_at: string
          height: number | null
          hips: number | null
          id: string
          inseam: number | null
          is_default: boolean | null
          knee: number | null
          measurement_type: string
          measurement_unit: string
          neck: number | null
          notes: string | null
          outseam: number | null
          profile_name: string
          shirt_length: number | null
          shoulder_width: number | null
          sleeve_length: number | null
          thigh: number | null
          trouser_length: number | null
          updated_at: string
          user_id: string
          waist: number | null
          weight: number | null
          wrist: number | null
        }
        Insert: {
          ankle?: number | null
          arm_hole?: number | null
          back_width?: number | null
          calf?: number | null
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          is_default?: boolean | null
          knee?: number | null
          measurement_type?: string
          measurement_unit?: string
          neck?: number | null
          notes?: string | null
          outseam?: number | null
          profile_name?: string
          shirt_length?: number | null
          shoulder_width?: number | null
          sleeve_length?: number | null
          thigh?: number | null
          trouser_length?: number | null
          updated_at?: string
          user_id: string
          waist?: number | null
          weight?: number | null
          wrist?: number | null
        }
        Update: {
          ankle?: number | null
          arm_hole?: number | null
          back_width?: number | null
          calf?: number | null
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          is_default?: boolean | null
          knee?: number | null
          measurement_type?: string
          measurement_unit?: string
          neck?: number | null
          notes?: string | null
          outseam?: number | null
          profile_name?: string
          shirt_length?: number | null
          shoulder_width?: number | null
          sleeve_length?: number | null
          thigh?: number | null
          trouser_length?: number | null
          updated_at?: string
          user_id?: string
          waist?: number | null
          weight?: number | null
          wrist?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          assigned_tailor: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          due_date: string | null
          fabric_details: string | null
          garment_description: string | null
          garment_type: string
          id: string
          measurement_id: string | null
          notes: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          assigned_tailor?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          due_date?: string | null
          fabric_details?: string | null
          garment_description?: string | null
          garment_type: string
          id?: string
          measurement_id?: string | null
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          assigned_tailor?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          due_date?: string | null
          fabric_details?: string | null
          garment_description?: string | null
          garment_type?: string
          id?: string
          measurement_id?: string | null
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          order_id: string | null
          payment_date: string
          payment_method: string
          payment_status: string
          transaction_reference: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string
          payment_method?: string
          payment_status?: string
          transaction_reference?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string
          payment_method?: string
          payment_status?: string
          transaction_reference?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean
          last_name: string
          notes: string | null
          phone: string | null
          role: string
          specialty: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          last_name: string
          notes?: string | null
          phone?: string | null
          role?: string
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          last_name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      appointment_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      appointment_type:
        | "measurement"
        | "fitting"
        | "consultation"
        | "pickup"
        | "other"
      order_status:
        | "pending"
        | "cutting"
        | "stitching"
        | "fitting"
        | "completed"
        | "delivered"
        | "cancelled"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      appointment_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: [
        "measurement",
        "fitting",
        "consultation",
        "pickup",
        "other",
      ],
      order_status: [
        "pending",
        "cutting",
        "stitching",
        "fitting",
        "completed",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
