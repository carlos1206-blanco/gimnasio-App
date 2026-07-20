import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  fontWeight: isActive ? "bold" : "normal",
  textDecoration: "none",
});

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <nav>
          <NavLink to="/admin" end style={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/usuarios" style={navLinkStyle}>
            Usuarios
          </NavLink>
          <NavLink to="/admin/contenido" style={navLinkStyle}>
            Contenido
          </NavLink>
          <NavLink to="/admin/rutinas" style={navLinkStyle}>
            Rutinas
          </NavLink>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>{user?.nombre}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
