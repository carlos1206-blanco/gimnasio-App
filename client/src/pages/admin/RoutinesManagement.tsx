import { useEffect, useState } from "react";
import {
  assignRoutineRequest,
  createExerciseRequest,
  createRoutineRequest,
  listAssignmentsByUserRequest,
  listExercisesRequest,
  listRoutinesRequest,
  type Exercise,
  type NewRoutineExercise,
  type Routine,
  type RoutineAssignment,
} from "../../api/routines";
import { listUsersRequest, type ManagedUser } from "../../api/users";
import { getErrorMessage } from "../../api/client";

export default function RoutinesManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [socios, setSocios] = useState<ManagedUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newExercise, setNewExercise] = useState({ nombre: "", grupoMuscular: "" });

  const [routineForm, setRoutineForm] = useState({ nombre: "", nivel: "" });
  const [routineExercises, setRoutineExercises] = useState<NewRoutineExercise[]>([]);
  const [pickExerciseId, setPickExerciseId] = useState("");
  const [pickSeries, setPickSeries] = useState(3);
  const [pickReps, setPickReps] = useState(10);

  const [assignRoutineId, setAssignRoutineId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");

  const [progressUserId, setProgressUserId] = useState("");
  const [progressAssignments, setProgressAssignments] = useState<RoutineAssignment[]>([]);

  useEffect(() => {
    reloadAll();
  }, []);

  async function reloadAll() {
    const [ex, rt, users] = await Promise.all([
      listExercisesRequest(),
      listRoutinesRequest(),
      listUsersRequest(),
    ]);
    setExercises(ex);
    setRoutines(rt);
    setSocios(users.filter((u) => u.role === "USER"));
  }

  async function handleAddExercise() {
    if (!newExercise.nombre.trim()) return;
    try {
      await createExerciseRequest({
        nombre: newExercise.nombre,
        grupoMuscular: newExercise.grupoMuscular || undefined,
      });
      setNewExercise({ nombre: "", grupoMuscular: "" });
      const ex = await listExercisesRequest();
      setExercises(ex);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear el ejercicio"));
    }
  }

  function addExerciseToRoutine() {
    if (!pickExerciseId) return;
    setRoutineExercises((prev) => [
      ...prev,
      {
        exerciseId: pickExerciseId,
        series: pickSeries,
        repeticiones: pickReps,
        orden: prev.length + 1,
      },
    ]);
    setPickExerciseId("");
  }

  function removeExerciseFromRoutine(exerciseId: string) {
    setRoutineExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  }

  async function handleCreateRoutine() {
    setError(null);
    if (!routineForm.nombre.trim() || routineExercises.length === 0) {
      setError("La rutina necesita un nombre y al menos un ejercicio");
      return;
    }
    try {
      await createRoutineRequest({
        nombre: routineForm.nombre,
        nivel: routineForm.nivel || undefined,
        ejercicios: routineExercises,
      });
      setRoutineForm({ nombre: "", nivel: "" });
      setRoutineExercises([]);
      const rt = await listRoutinesRequest();
      setRoutines(rt);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear la rutina"));
    }
  }

  async function handleAssign() {
    setError(null);
    if (!assignRoutineId || !assignUserId) {
      setError("Elige una rutina y un socio");
      return;
    }
    try {
      await assignRoutineRequest(assignRoutineId, assignUserId);
      setAssignRoutineId("");
      setAssignUserId("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo asignar la rutina"));
    }
  }

  async function loadProgress(userId: string) {
    setProgressUserId(userId);
    if (!userId) {
      setProgressAssignments([]);
      return;
    }
    const data = await listAssignmentsByUserRequest(userId);
    setProgressAssignments(data);
  }

  return (
    <div className="stack" style={{ maxWidth: 720 }}>
      <h1>Rutinas</h1>
      {error && <p className="error-text">{error}</p>}

      <section className="card">
        <h2>Catálogo de ejercicios</h2>
        <ul>
          {exercises.map((e) => (
            <li key={e.id}>
              {e.nombre} {e.grupoMuscular ? `(${e.grupoMuscular})` : ""}
            </li>
          ))}
        </ul>
        <div className="form-row">
          <input
            placeholder="Nombre del ejercicio"
            value={newExercise.nombre}
            onChange={(e) => setNewExercise((f) => ({ ...f, nombre: e.target.value }))}
          />
          <input
            placeholder="Grupo muscular (opcional)"
            value={newExercise.grupoMuscular}
            onChange={(e) => setNewExercise((f) => ({ ...f, grupoMuscular: e.target.value }))}
          />
          <button className="secondary" onClick={handleAddExercise}>
            Agregar ejercicio
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Crear rutina</h2>
        <div className="form-row" style={{ marginBottom: "0.75rem" }}>
          <input
            placeholder="Nombre de la rutina"
            value={routineForm.nombre}
            onChange={(e) => setRoutineForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <input
            placeholder="Nivel (opcional)"
            value={routineForm.nivel}
            onChange={(e) => setRoutineForm((f) => ({ ...f, nivel: e.target.value }))}
          />
        </div>

        <div className="form-row">
          <select value={pickExerciseId} onChange={(e) => setPickExerciseId(e.target.value)}>
            <option value="">Elegir ejercicio...</option>
            {exercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <label style={{ margin: 0 }}>
            Series
            <input
              type="number"
              min={1}
              value={pickSeries}
              onChange={(e) => setPickSeries(Number(e.target.value))}
              style={{ width: "4rem" }}
            />
          </label>
          <label style={{ margin: 0 }}>
            Reps
            <input
              type="number"
              min={1}
              value={pickReps}
              onChange={(e) => setPickReps(Number(e.target.value))}
              style={{ width: "4rem" }}
            />
          </label>
          <button className="secondary" onClick={addExerciseToRoutine}>
            Añadir a la rutina
          </button>
        </div>

        <ul>
          {routineExercises.map((re) => {
            const ex = exercises.find((e) => e.id === re.exerciseId);
            return (
              <li key={re.exerciseId}>
                {ex?.nombre} — {re.series}x{re.repeticiones}{" "}
                <button className="secondary" onClick={() => removeExerciseFromRoutine(re.exerciseId)}>
                  Quitar
                </button>
              </li>
            );
          })}
        </ul>

        <button onClick={handleCreateRoutine}>Guardar rutina</button>
      </section>

      <section className="card">
        <h2>Asignar rutina a un socio</h2>
        <div className="form-row">
          <select value={assignRoutineId} onChange={(e) => setAssignRoutineId(e.target.value)}>
            <option value="">Elegir rutina...</option>
            {routines.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
          <select value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}>
            <option value="">Elegir socio...</option>
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} {s.apellido}
              </option>
            ))}
          </select>
          <button onClick={handleAssign}>Asignar</button>
        </div>
      </section>

      <section className="card">
        <h2>Ver progreso de un socio</h2>
        <select value={progressUserId} onChange={(e) => loadProgress(e.target.value)}>
          <option value="">Elegir socio...</option>
          {socios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} {s.apellido}
            </option>
          ))}
        </select>

        {progressAssignments.map((a) => (
          <div key={a.id} style={{ marginTop: "1rem" }}>
            <strong>{a.routine.nombre}</strong>
            <ul>
              {a.routine.ejercicios.map((re) => {
                const log = a.sessionLogs.find((l) => l.exerciseId === re.exerciseId);
                return (
                  <li key={re.id} style={{ margin: "0.3rem 0" }}>
                    {re.exercise.nombre}{" "}
                    <span className={`badge ${log?.completado ? "badge-success" : "badge-muted"}`}>
                      {log?.completado ? "Completado" : "Pendiente"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
