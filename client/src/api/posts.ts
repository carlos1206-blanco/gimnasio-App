import apiClient from "./client";

export type PostType = "AVISO" | "NOTICIA" | "HISTORIA";

export interface Post {
  id: string;
  tipo: PostType;
  titulo: string;
  contenido: string;
  imagenUrl: string | null;
  fechaPublicacion: string;
  expiraEn: string | null;
  autor: { nombre: string; apellido: string };
}

export interface CreatePostData {
  tipo: PostType;
  titulo: string;
  contenido: string;
  imagenUrl?: string;
  expiraEn?: string;
}

export async function listPostsRequest(): Promise<Post[]> {
  const res = await apiClient.get<Post[]>("/posts");
  return res.data;
}

export async function createPostRequest(data: CreatePostData): Promise<Post> {
  const res = await apiClient.post<Post>("/posts", data);
  return res.data;
}
