// ─── API response shapes ────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Country returned by /api/countries
export interface Country {
  names: {
    common: string;
    official?: string;
  };
  codes: {
    alpha_2: string;
    alpha_3: string;
  };
  capital : string;
  flags: {
    url_png: string;
    url_svg: string;
  };
  region: string;
  subregion?: string;
  languages?: Array<{
    name: string
    native_name?: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CountriesParams {
  name?: string;
  region?: string;
  language?: string;
  capital?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// /api/countries paginated response
export interface CountriesPage {
  data: PaginatedResponse<any>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// ─── App domain ────────────────────────────────────────────────────────────

export type GameMode =
  | 'flag-to-country'
  | 'country-to-capital'
  | 'capital-to-country';

export interface Question {
  mode: GameMode;
  country: Country;
  options: string[];
  correctAnswer: string;
}

export interface GameResult {
  score: number;
  total: number;
  percentage: number;
  mode: GameMode;
  playerName: string;
  date: string;
}


// Stored auth state
export interface AuthState {
  token: string;
  user: ApiUser;
}

export interface Ranking {
  userId: string;
  totalPoints: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
