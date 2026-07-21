import { useEffect, useState } from "react";
import { listMyAssignmentsRequest, updateSessionLogRequest, type RoutineAssignment } from "../../api/routines";

export default function MyRoutines() {
  const [assignments, setAssignments] = useState<RoutineAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    listMyAssignmentsRequest()
      .then(setAssignments)
      .finally(() => setLoading(false));
  }, []);

  async function toggleCompletado(assignment: RoutineAssignment, exerciseId: string, actual: boolean) {
    const updatedLog = await updateSessionLogRequest(assignment.id, exerciseId, {
      completado: !actual,
    });
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignment.id) return a;
        const otros = a.sessionLogs.filter((l) => l.exerciseId !== exerciseId);
        return { ...a, sessionLogs: [...otros, updatedLog] };
      }),
    );
  }

  function toggleExpanded(routineExerciseId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(routineExerciseId)) next.delete(routineExerciseId);
      else next.add(routineExerciseId);
      return next;
    });
  }

  if (loading) return <p>Cargando tus rutinas...</p>;

  if (assignments.length === 0) {
    return <p>Todavía no tienes rutinas asignadas. Habla con tu entrenador.</p>;
  }

  return (
    <div className="stack" style={{ gap: "1.5rem", maxWidth: 560 }}>
      <h1>Mis rutinas</h1>
      {assignments.map((a) => {
        const total = a.routine.ejercicios.length;
        const completados = a.routine.ejercicios.filter(
          (re) => a.sessionLogs.find((l) => l.exerciseId === re.exerciseId)?.completado,
        ).length;

        return (
          <article key={a.id} className="card">
            <h3>
              {a.routine.nombre} {a.routine.nivel ? `(${a.routine.nivel})` : ""}
            </h3>
            <p>
              {completados} de {total} ejercicios completados
            </p>
            <div className="progress-bar">
              <div style={{ width: `${total > 0 ? (completados / total) * 100 : 0}%` }} />
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {a.routine.ejercicios.map((re) => {
                const log = a.sessionLogs.find((l) => l.exerciseId === re.exerciseId);
                const completado = log?.completado ?? false;
                const expandido = expandedIds.has(re.id);
                return (
                  <li key={re.id} style={{ padding: "0.3rem 0", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={completado}
                          onChange={() => toggleCompletado(a, re.exerciseId, completado)}
                        />
                        {re.exercise.nombre} — {re.series}x{re.repeticiones}
                      </label>
                      {re.exercise.descripcion && (
                        <button className="secondary" onClick={() => toggleExpanded(re.id)}>
                          {expandido ? "Ocultar" : "Cómo hacerlo"}
                        </button>
                      )}
                    </div>
                    {expandido && re.exercise.descripcion && (
                      <p style={{ margin: "0.4rem 0 0.6rem", fontSize: "0.9rem" }}>{re.exercise.descripcion}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
