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
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
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
          user_id: string;
          name?: string | null;
          total_mg: number;
          remaining_mg: number;
          status?: "active" | "depleted";
        };
        Update: Partial<Database["public"]["Tables"]["pens"]["Insert"]>;
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
          pen_id: string;
          user_id: string;
          type?: "initialization" | "dose";
          dose_mg: number;
          taken_at: string;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["doses"]["Insert"]>;
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
          user_id: string;
          weight_kg: number;
          body_fat_pct?: number | null;
          bmi?: number | null;
          source?: "manual" | "scale_scan";
          photo_url?: string | null;
          logged_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["weight_logs"]["Insert"]>;
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pen = Database["public"]["Tables"]["pens"]["Row"];
export type Dose = Database["public"]["Tables"]["doses"]["Row"];
export type WeightLog = Database["public"]["Tables"]["weight_logs"]["Row"];
