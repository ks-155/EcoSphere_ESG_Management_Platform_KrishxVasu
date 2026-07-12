import { apiClient } from "./api-client";
import type { LoginRequest, LoginResponse, User } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";

export async function login(data: LoginRequest): Promise<void> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  useAuthStore.getState().setAuth(
    response.data.user,
    response.data.accessToken,
    response.data.refreshToken
  );
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    useAuthStore.getState().logout();
  }
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  useAuthStore.getState().setUser(data);
  return data;
}
