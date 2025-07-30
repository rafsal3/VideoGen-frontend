import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import Explore from "./pages/Explore";
import Account from "./pages/Account";
import TemplateDetail from "./pages/TemplateDetail";
import NewProject from "./pages/NewProject";
import ExportPage from "./pages/ExportPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="account" element={<Account />} />

          {/* 👇 Nested route inside /dashboard/ */}
          <Route path="template/:templateId" element={<TemplateDetail />} />
          <Route path="template/:templateId/use" element={<NewProject />} />


          {/* Fallback route inside dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Default redirect from root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
