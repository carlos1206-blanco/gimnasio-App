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
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Gestión de socios</h1>
      <div className="table-scroll">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
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
            <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
              {editingId === u.id ? (
                <>
                  <td>
                    <input
                      value={editForm.nombre}
                      onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                      style={{ width: "5rem" }}
                    />
                    <input
                      value={editForm.apellido}
                      onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                      style={{ width: "5rem", marginLeft: "0.25rem" }}
                    />
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <input
                      value={editForm.telefono}
                      onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
                      style={{ width: "6rem" }}
                    />
                  </td>
                  <td>{u.role}</td>
                  <td>{u.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button onClick={() => saveEdit(u.id)}>Guardar</button>
                    <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    {u.nombre} {u.apellido}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.telefono ?? "—"}</td>
                  <td>{u.role}</td>
                  <td>{u.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button onClick={() => startEdit(u)}>Editar</button>
                    <button onClick={() => toggleActivo(u)} style={{ marginLeft: "0.5rem" }}>
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>
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
