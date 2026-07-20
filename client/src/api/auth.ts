import apiClient from "./client";

export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: Role;
}

interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function registerRequest(data: RegisterData): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/register", data);
  return res.data;
}

export async function loginRequest(data: LoginData): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/login", data);
  return res.data;
}

export async function meRequest(): Promise<User> {
  const res = await apiClient.get<User>("/auth/me");
  return res.data;
}
