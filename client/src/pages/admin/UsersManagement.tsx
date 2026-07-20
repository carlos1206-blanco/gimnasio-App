import { useEffect, useState } from "react";
import { listUsersRequest, updateUserRequest, type ManagedUser } from "../../api/users";

export default function UsersManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nombre: "", apellido: "", telefono: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await listUsersRequest();
      setUsers(data);
      setError(null);
    } catch {
      setError("No se pudo cargar la lista de socios");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(u: ManagedUser) {
    setEditingId(u.id);
    setEditForm({ nombre: u.nombre, apellido: u.apellido, telefono: u.telefono ?? "" });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const updated = await updateUserRequest(id, editForm);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    setEditingId(null);
  }

  async function toggleActivo(u: ManagedUser) {
    const updated = await updateUserRequest(u.id, { activo: !u.activo });
    setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
  }

  if (loading) return <p>Cargando socios...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h1>Gestión de socios</h1>
      <div className="card table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                {editingId === u.id ? (
                  <>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <input
                          value={editForm.nombre}
                          onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                        />
                        <input
                          value={editForm.apellido}
                          onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                        />
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <input
                        value={editForm.telefono}
                        onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
                      />
                    </td>
                    <td>
                      <span className={`badge ${u.role === "ADMIN" ? "badge-primary" : "badge-muted"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.activo ? "badge-success" : "badge-danger"}`}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => saveEdit(u.id)}>Guardar</button>
                        <button className="secondary" onClick={cancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {u.nombre} {u.apellido}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.telefono ?? "—"}</td>
                    <td>
                      <span className={`badge ${u.role === "ADMIN" ? "badge-primary" : "badge-muted"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.activo ? "badge-success" : "badge-danger"}`}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="secondary" onClick={() => startEdit(u)}>
                          Editar
                        </button>
                        <button
                          className={u.activo ? "danger" : ""}
                          onClick={() => toggleActivo(u)}
                        >
                          {u.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
