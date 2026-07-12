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
  xp?: number;
  avatar?: string;
  department?: string | null;
  departmentId?: string;
  organizationId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
