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
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 640 }}>
      <h1>Mis logros y progreso</h1>

      <section>
        <h2>Registrar progreso</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
          <label>
            Peso (kg)
            <input
              type="number"
              step="0.1"
              value={form.peso}
              onChange={(e) => setForm((f) => ({ ...f, peso: e.target.value }))}
              style={{ width: "5rem", display: "block" }}
            />
          </label>
          <label>
            Cintura (cm)
            <input
              type="number"
              value={form.cintura}
              onChange={(e) => setForm((f) => ({ ...f, cintura: e.target.value }))}
              style={{ width: "5rem", display: "block" }}
            />
          </label>
          <label>
            Pecho (cm)
            <input
              type="number"
              value={form.pecho}
              onChange={(e) => setForm((f) => ({ ...f, pecho: e.target.value }))}
              style={{ width: "5rem", display: "block" }}
            />
          </label>
          <label>
            Brazo (cm)
            <input
              type="number"
              value={form.brazo}
              onChange={(e) => setForm((f) => ({ ...f, brazo: e.target.value }))}
              style={{ width: "5rem", display: "block" }}
            />
          </label>
          <label>
            Marca personal
            <input
              placeholder="Ej: Sentadilla 100kg"
              value={form.marcaPersonal}
              onChange={(e) => setForm((f) => ({ ...f, marcaPersonal: e.target.value }))}
              style={{ display: "block" }}
            />
          </label>
          <label>
            Foto (opcional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
              style={{ display: "block" }}
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Registrar"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>

      {chartData.length > 0 && (
        <section>
          <h2>Evolución de peso</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="peso" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      <section>
        <h2>Historial</h2>
        <ul>
          {logs
            .slice()
            .reverse()
            .map((l) => (
              <li key={l.id} style={{ marginBottom: "0.5rem" }}>
                {new Date(l.fecha).toLocaleDateString()} —{" "}
                {l.peso !== null && `${l.peso}kg `}
                {l.marcaPersonal && `· ${l.marcaPersonal} `}
                {l.fotoUrl && (
                  <img
                    src={resolveUploadUrl(l.fotoUrl)}
                    alt="Foto de progreso"
                    style={{ height: 40, verticalAlign: "middle", marginLeft: "0.5rem" }}
                  />
                )}
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2>Insignias</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {achievements.map((a) => (
            <div
              key={a.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "1rem",
                width: 160,
                opacity: a.obtenido ? 1 : 0.4,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem" }}>{a.obtenido ? "🏅" : "🔒"}</div>
              <strong>{a.nombre}</strong>
              <p style={{ fontSize: "0.8rem" }}>{a.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
