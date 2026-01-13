// Database Types
export interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  survey_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface Question {
  id: string;
  survey_id: string;
  category_id: string | null;
  question_text: string;
  description: string | null;
  media_url: string | null;
  media_urls: string[] | null; // Multiple images
  question_type: QuestionType;
  order_index: number;
  created_at: string;
}

export interface Response {
  id: string;
  survey_id: string;
  question_id: string;
  session_id: string;
  age_range: AgeRange;
  gender: Gender;
  answer_value: string;
  created_at: string;
}

export interface SessionTracking {
  id: string;
  survey_id: string;
  session_id: string;
  current_page: number;
  question_id: string | null;
  time_spent_seconds: number;
  last_active_at: string;
  created_at: string;
}

// Enums
export enum QuestionType {
  LIKE_DISLIKE = 'like_dislike',
  RATING_1_5 = 'rating_1_5',
  COMBINED = 'combined' // Both like/dislike AND rating
}

export enum AgeRange {
  RANGE_18_24 = '18-24',
  RANGE_25_34 = '25-34',
  RANGE_35_44 = '35-44',
  RANGE_45_54 = '45-54',
  RANGE_55_PLUS = '55+'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Form Types
export interface SurveyFormData {
  title: string;
  description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

export interface CategoryFormData {
  survey_id: string;
  name: string;
  order_index: number;
}

export interface QuestionFormData {
  survey_id: string;
  category_id: string;
  question_text: string;
  description: string;
  media_url: string;
  media_urls?: string[]; // Multiple images
  question_type: QuestionType;
  order_index: number;
}

export interface ResponseFormData {
  survey_id: string;
  question_id: string;
  session_id: string;
  age_range: AgeRange;
  gender: Gender;
  answer_value: string;
}

export interface DemographicsData {
  age_range: AgeRange;
  gender: Gender;
}

// Extended Types with Relations
export interface SurveyWithRelations extends Survey {
  categories?: CategoryWithQuestions[];
  questions?: Question[];
  _count?: {
    responses: number;
  };
}

export interface CategoryWithQuestions extends Category {
  questions?: Question[];
}

export interface QuestionWithDetails extends Question {
  category?: Category;
}

// Aggregated Results
export interface QuestionResult {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  total_responses: number;
  like_count?: number;
  dislike_count?: number;
  rating_1?: number;
  rating_2?: number;
  rating_3?: number;
  rating_4?: number;
  rating_5?: number;
  average_rating?: number;
}

export interface AggregatedResults {
  survey_id: string;
  total_responses: number;
  by_age: Record<AgeRange, number>;
  by_gender: Record<Gender, number>;
  by_device: Record<string, number>;
  by_browser: Record<string, number>;
  by_os: Record<string, number>;
  questions: QuestionResult[];
}

// Realtime Tracking
export interface ActiveSession {
  session_id: string;
  current_page: number;
  question_id: string | null;
  question_text?: string;
  time_spent_seconds: number;
  last_active_at: string;
}

export interface RealtimeStats {
  total_active_users: number;
  active_sessions: ActiveSession[];
  average_time_per_question: number;
}

// Admin Auth
export interface AdminSession {
  authenticated: boolean;
  expiresAt: number;
}
