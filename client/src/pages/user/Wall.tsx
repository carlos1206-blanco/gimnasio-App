import { useEffect, useState } from "react";
import { listPostsRequest, type Post } from "../../api/posts";

export default function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPostsRequest()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando avisos...</p>;

  if (posts.length === 0) {
    return <p>Todavía no hay avisos publicados.</p>;
  }

  return (
    <div className="stack" style={{ gap: "1rem", maxWidth: 560 }}>
      {posts.map((p) => (
        <article key={p.id} className="card post-card">
          <span className="badge badge-primary">{p.tipo}</span>
          <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{p.titulo}</h3>
          {p.imagenUrl && (
            <img
              src={p.imagenUrl}
              alt={p.titulo}
              style={{ maxWidth: "100%", borderRadius: 6, margin: "0.5rem 0" }}
            />
          )}
          <p>{p.contenido}</p>
          <small style={{ color: "var(--text-muted)" }}>
            {p.autor.nombre} {p.autor.apellido} — {new Date(p.fechaPublicacion).toLocaleString()}
          </small>
        </article>
      ))}
    </div>
  );
}
