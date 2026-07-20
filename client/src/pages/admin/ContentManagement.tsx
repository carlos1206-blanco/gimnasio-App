import { useEffect, useState, type FormEvent } from "react";
import { createPostRequest, listPostsRequest, type Post, type PostType } from "../../api/posts";
import { getErrorMessage } from "../../api/client";

const TIPOS: PostType[] = ["AVISO", "NOTICIA", "HISTORIA"];

export default function ContentManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ tipo: "AVISO" as PostType, titulo: "", contenido: "", imagenUrl: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const data = await listPostsRequest();
    setPosts(data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createPostRequest({
        tipo: form.tipo,
        titulo: form.titulo,
        contenido: form.contenido,
        imagenUrl: form.imagenUrl || undefined,
      });
      setForm({ tipo: "AVISO", titulo: "", contenido: "", imagenUrl: "" });
      await loadPosts();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo publicar"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Publicar contenido</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 480 }}>
        <label>
          Tipo
          <select
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as PostType }))}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          Título
          <input
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            required
          />
        </label>
        <label>
          Contenido
          <textarea
            value={form.contenido}
            onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
            required
            rows={4}
          />
        </label>
        <label>
          Imagen (URL, opcional)
          <input
            value={form.imagenUrl}
            onChange={(e) => setForm((f) => ({ ...f, imagenUrl: e.target.value }))}
            placeholder="https://..."
          />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Publicando..." : "Publicar"}
        </button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>Publicado recientemente</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>[{p.tipo}]</strong> {p.titulo} —{" "}
            {new Date(p.fechaPublicacion).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
