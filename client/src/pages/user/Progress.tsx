import { useEffect, useState, type FormEvent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { createProgressLogRequest, listMyProgressLogsRequest, type ProgressLog } from "../../api/progress";
import { listMyAchievementsRequest, type AchievementConProgreso } from "../../api/achievements";
import { resolveUploadUrl, getErrorMessage } from "../../api/client";

export default function Progress() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [achievements, setAchievements] = useState<AchievementConProgreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ peso: "", cintura: "", pecho: "", brazo: "", marcaPersonal: "" });
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    setLoading(true);
    const [logsData, achievementsData] = await Promise.all([
      listMyProgressLogsRequest(),
      listMyAchievementsRequest(),
    ]);
    setLogs(logsData);
    setAchievements(achievementsData);
    setLoading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createProgressLogRequest({
        peso: form.peso ? Number(form.peso) : undefined,
        cintura: form.cintura ? Number(form.cintura) : undefined,
        pecho: form.pecho ? Number(form.pecho) : undefined,
        brazo: form.brazo ? Number(form.brazo) : undefined,
        marcaPersonal: form.marcaPersonal || undefined,
        foto: foto ?? undefined,
      });
      setForm({ peso: "", cintura: "", pecho: "", brazo: "", marcaPersonal: "" });
      setFoto(null);
      await reload();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo registrar el progreso"));
    } finally {
      setSubmitting(false);
    }
  }

  const chartData = logs
    .filter((l) => l.peso !== null)
    .map((l) => ({ fecha: new Date(l.fecha).toLocaleDateString(), peso: l.peso }));

  if (loading) return <p>Cargando tu progreso...</p>;

  return (
    <div className="stack" style={{ maxWidth: 640 }}>
      <h1>Mis logros y progreso</h1>

      <section className="card">
        <h2>Registrar progreso</h2>
        <form onSubmit={handleSubmit} className="form-row">
          <label style={{ margin: 0 }}>
            Peso (kg)
            <input
              type="number"
              step="0.1"
              value={form.peso}
              onChange={(e) => setForm((f) => ({ ...f, peso: e.target.value }))}
              style={{ width: "5.5rem" }}
            />
          </label>
          <label style={{ margin: 0 }}>
            Cintura (cm)
            <input
              type="number"
              value={form.cintura}
              onChange={(e) => setForm((f) => ({ ...f, cintura: e.target.value }))}
              style={{ width: "5.5rem" }}
            />
          </label>
          <label style={{ margin: 0 }}>
            Pecho (cm)
            <input
              type="number"
              value={form.pecho}
              onChange={(e) => setForm((f) => ({ ...f, pecho: e.target.value }))}
              style={{ width: "5.5rem" }}
            />
          </label>
          <label style={{ margin: 0 }}>
            Brazo (cm)
            <input
              type="number"
              value={form.brazo}
              onChange={(e) => setForm((f) => ({ ...f, brazo: e.target.value }))}
              style={{ width: "5.5rem" }}
            />
          </label>
          <label style={{ margin: 0 }}>
            Marca personal
            <input
              placeholder="Ej: Sentadilla 100kg"
              value={form.marcaPersonal}
              onChange={(e) => setForm((f) => ({ ...f, marcaPersonal: e.target.value }))}
            />
          </label>
          <label style={{ margin: 0 }}>
            Foto (opcional)
            <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Registrar"}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      {chartData.length > 0 && (
        <section className="card">
          <h2>Evolución de peso</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" />
              <XAxis dataKey="fecha" tick={{ fill: "#9a9a9e", fontSize: 12 }} stroke="#2a2a2d" />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "#9a9a9e", fontSize: 12 }} stroke="#2a2a2d" />
              <Tooltip
                contentStyle={{ background: "#19191b", border: "1px solid #2a2a2d", borderRadius: 8 }}
                labelStyle={{ color: "#9a9a9e" }}
              />
              <Line type="monotone" dataKey="peso" stroke="#ff7a1a" strokeWidth={2} dot={{ fill: "#ff7a1a" }} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      <section className="card">
        <h2>Historial</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {logs
            .slice()
            .reverse()
            .map((l) => (
              <li key={l.id} style={{ marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)" }}>{new Date(l.fecha).toLocaleDateString()}</span>
                {l.peso !== null && <span>{l.peso}kg</span>}
                {l.marcaPersonal && <span>· {l.marcaPersonal}</span>}
                {l.fotoUrl && (
                  <img
                    src={resolveUploadUrl(l.fotoUrl)}
                    alt="Foto de progreso"
                    style={{ height: 40, borderRadius: 4 }}
                  />
                )}
              </li>
            ))}
        </ul>
      </section>

      <section className="card">
        <h2>Insignias</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {achievements.map((a) => (
            <div key={a.id} className="card achievement-card" style={{ width: 160, opacity: a.obtenido ? 1 : 0.4 }}>
              <div className="icon">{a.obtenido ? "🏅" : "🔒"}</div>
              <strong>{a.nombre}</strong>
              <p style={{ fontSize: "0.8rem" }}>{a.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
