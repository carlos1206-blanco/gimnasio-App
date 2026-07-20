import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/inicio", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo completar el registro"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="logo-badge lg">
          <img src="/logo-gymbros.jpg" alt="GYMBROS" />
        </div>
        <div className="card">
          <h1>Crear cuenta</h1>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Nombre
              <input value={form.nombre} onChange={updateField("nombre")} required />
            </label>
            <label>
              Apellido
              <input value={form.apellido} onChange={updateField("apellido")} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={updateField("email")} required />
            </label>
            <label>
              Teléfono (opcional)
              <input value={form.telefono} onChange={updateField("telefono")} />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={form.password}
                onChange={updateField("password")}
                minLength={6}
                required
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
