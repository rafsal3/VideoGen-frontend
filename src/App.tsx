
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import Explore from "./pages/Explore";
import Account from "./pages/Account";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore/>} />
          <Route path="account" element={<Account/>} />
          


          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Route>
        {/* Default route: redirect to dashboard if logged in, else to login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
