import { useEffect, useState } from "react";
import { createWaterLogRequest, deleteWaterLogRequest, listTodayWaterRequest, type WaterLog } from "../../api/water";

const META_ML = 2000;

export default function WaterTracker() {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listTodayWaterRequest()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  async function addWater(cantidadMl: number) {
    setBusy(true);
    try {
      const log = await createWaterLogRequest(cantidadMl);
      setLogs((prev) => [...prev, log]);
    } finally {
      setBusy(false);
    }
  }

  async function undoLast() {
    const last = logs[logs.length - 1];
    if (!last) return;
    setBusy(true);
    try {
      await deleteWaterLogRequest(last.id);
      setLogs((prev) => prev.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  const total = logs.reduce((sum, l) => sum + l.cantidadMl, 0);
  const porcentaje = Math.min(100, Math.round((total / META_ML) * 100));

  if (loading) return null;

  return (
    <section className="card">
      <h2>💧 Agua de hoy</h2>
      <p>
        {total} / {META_ML} ml {porcentaje >= 100 && "— ¡meta cumplida!"}
      </p>
      <div className="progress-bar">
        <div style={{ width: `${porcentaje}%` }} />
      </div>
      <div className="form-row">
        <button className="secondary" disabled={busy} onClick={() => addWater(250)}>
          + 250 ml
        </button>
        <button className="secondary" disabled={busy} onClick={() => addWater(500)}>
          + 500 ml
        </button>
        <button className="secondary" disabled={busy || logs.length === 0} onClick={undoLast}>
          Deshacer último
        </button>
      </div>
    </section>
  );
}
