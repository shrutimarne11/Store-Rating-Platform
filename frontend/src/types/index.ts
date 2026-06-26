export type UserRole = 'system_admin' | 'normal_user' | 'store_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number | null;
  ratingCount?: number;
  userRating?: number | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface UserDetails extends User {
  storeRating?: number | null;
  storeName?: string;
}

export interface OwnerDashboard {
  store: Store;
  raters: Array<{
    id: string;
    name: string;
    email: string;
    address: string;
    rating: number;
    submittedAt: string;
  }>;
}

export interface ListQuery {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
