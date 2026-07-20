import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Panel de administración</h1>
      <p>Hola, {user?.nombre}. Usa el menú superior para gestionar usuarios, contenido y rutinas.</p>
    </div>
  );
}
