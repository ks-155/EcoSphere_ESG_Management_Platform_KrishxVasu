export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ESG_MANAGER = "ESG_MANAGER",
  DEPT_HEAD = "DEPT_HEAD",
  EMPLOYEE = "EMPLOYEE",
  AUDITOR = "AUDITOR",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
