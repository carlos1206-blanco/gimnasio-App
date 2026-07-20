import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserLayout from "../pages/user/UserLayout";
import Wall from "../pages/user/Wall";
import MyRoutines from "../pages/user/MyRoutines";
import Progress from "../pages/user/Progress";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UsersManagement from "../pages/admin/UsersManagement";
import ContentManagement from "../pages/admin/ContentManagement";
import RoutinesManagement from "../pages/admin/RoutinesManagement";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/inicio" element={<UserLayout />}>
            <Route index element={<Wall />} />
            <Route path="rutinas" element={<MyRoutines />} />
            <Route path="progreso" element={<Progress />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="usuarios" element={<UsersManagement />} />
            <Route path="contenido" element={<ContentManagement />} />
            <Route path="rutinas" element={<RoutinesManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
