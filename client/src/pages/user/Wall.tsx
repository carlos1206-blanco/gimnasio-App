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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 560 }}>
      {posts.map((p) => (
        <article key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem" }}>
          <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>{p.tipo}</span>
          <h3 style={{ margin: "0.25rem 0" }}>{p.titulo}</h3>
          {p.imagenUrl && (
            <img src={p.imagenUrl} alt={p.titulo} style={{ maxWidth: "100%", borderRadius: 6 }} />
          )}
          <p>{p.contenido}</p>
          <small>
            {p.autor.nombre} {p.autor.apellido} — {new Date(p.fechaPublicacion).toLocaleString()}
          </small>
        </article>
      ))}
    </div>
  );
}
