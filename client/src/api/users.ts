import apiClient from "./client";
import type { Role } from "./auth";

export interface ManagedUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  role: Role;
  activo: boolean;
  fechaRegistro: string;
}

export interface UpdateUserData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  activo?: boolean;
}

export async function listUsersRequest(): Promise<ManagedUser[]> {
  const res = await apiClient.get<ManagedUser[]>("/users");
  return res.data;
}

export async function updateUserRequest(id: string, data: UpdateUserData): Promise<ManagedUser> {
  const res = await apiClient.put<ManagedUser>(`/users/${id}`, data);
  return res.data;
}
