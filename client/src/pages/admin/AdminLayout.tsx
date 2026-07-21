import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? "var(--primary)" : undefined,
  background: isActive ? "rgba(255, 122, 26, 0.12)" : undefined,
});

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <div className="brand-row">
          <div className="logo-badge sm">
            <img src="/logo-gymbros.png" alt="GYMBROS" />
          </div>
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
        </div>
        <div className="user-box">
          <span>{user?.nombre}</span>
          <button className="secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
