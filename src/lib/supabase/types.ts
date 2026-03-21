export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          goal_weight_kg: number | null;
          daily_calories_target: number | null;
          daily_protein_target_g: number | null;
          daily_carbs_target_g: number | null;
          daily_fats_target_g: number | null;
          daily_water_target_ml: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar_url?: string | null;
          height_cm?: number | null;
          current_weight_kg?: number | null;
          goal_weight_kg?: number | null;
          daily_calories_target?: number | null;
          daily_protein_target_g?: number | null;
          daily_carbs_target_g?: number | null;
          daily_fats_target_g?: number | null;
          daily_water_target_ml?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          height_cm?: number | null;
          current_weight_kg?: number | null;
          goal_weight_kg?: number | null;
          daily_calories_target?: number | null;
          daily_protein_target_g?: number | null;
          daily_carbs_target_g?: number | null;
          daily_fats_target_g?: number | null;
          daily_water_target_ml?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pens: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          total_mg: number;
          remaining_mg: number;
          status: "active" | "depleted";
          registered_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          total_mg: number;
          remaining_mg: number;
          status?: "active" | "depleted";
          registered_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          total_mg?: number;
          remaining_mg?: number;
          status?: "active" | "depleted";
          registered_at?: string;
        };
        Relationships: [];
      };
      doses: {
        Row: {
          id: string;
          pen_id: string;
          user_id: string;
          type: "initialization" | "dose";
          dose_mg: number;
          taken_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pen_id: string;
          user_id: string;
          type?: "initialization" | "dose";
          dose_mg: number;
          taken_at: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pen_id?: string;
          user_id?: string;
          type?: "initialization" | "dose";
          dose_mg?: number;
          taken_at?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          body_fat_pct: number | null;
          bmi: number | null;
          source: "manual" | "scale_scan";
          photo_url: string | null;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg: number;
          body_fat_pct?: number | null;
          bmi?: number | null;
          source?: "manual" | "scale_scan";
          photo_url?: string | null;
          logged_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight_kg?: number;
          body_fat_pct?: number | null;
          bmi?: number | null;
          source?: "manual" | "scale_scan";
          photo_url?: string | null;
          logged_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      meal_logs: {
        Row: {
          id: string;
          user_id: string;
          meal_slot: "breakfast" | "morning_snack" | "lunch" | "afternoon_snack" | "dinner" | "extra";
          name: string;
          calories_kcal: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_slot: "breakfast" | "morning_snack" | "lunch" | "afternoon_snack" | "dinner" | "extra";
          name: string;
          calories_kcal?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_slot?: "breakfast" | "morning_snack" | "lunch" | "afternoon_snack" | "dinner" | "extra";
          name?: string;
          calories_kcal?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          logged_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pen = Database["public"]["Tables"]["pens"]["Row"];
export type Dose = Database["public"]["Tables"]["doses"]["Row"];
export type WeightLog = Database["public"]["Tables"]["weight_logs"]["Row"];
export type MealLog = Database["public"]["Tables"]["meal_logs"]["Row"];
export type MealLogInsert = Database["public"]["Tables"]["meal_logs"]["Insert"];
