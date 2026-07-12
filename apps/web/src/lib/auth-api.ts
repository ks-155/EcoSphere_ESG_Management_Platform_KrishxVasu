import { apiClient } from "./api-client";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  useAuthStore.getState().setAuth(response.data.user, response.data.tokens);
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    useAuthStore.getState().logout();
  }
}

export async function refreshToken(): Promise<void> {
  const { tokens } = useAuthStore.getState();
  if (!tokens?.refreshToken) throw new Error("No refresh token");

  const { data } = await apiClient.post<LoginResponse>("/auth/refresh", {
    refreshToken: tokens.refreshToken,
  });
  useAuthStore.getState().setAuth(data.user, data.tokens);
}

export async function getProfile(): Promise<void> {
  const { data } = await apiClient.get("/auth/profile");
  useAuthStore.getState().setUser(data);
}
