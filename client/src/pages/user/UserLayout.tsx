import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  fontWeight: isActive ? "bold" : "normal",
  textDecoration: "none",
});

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <nav>
          <NavLink to="/inicio" end style={navLinkStyle}>
            Muro
          </NavLink>
          <NavLink to="/inicio/rutinas" style={navLinkStyle}>
            Mis Rutinas
          </NavLink>
          <NavLink to="/inicio/progreso" style={navLinkStyle}>
            Mis Logros
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
