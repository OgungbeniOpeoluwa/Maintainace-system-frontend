import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SubmitRequest from "./pages/SubmitRequest";
import ChangePassword from "./pages/ChangePassword";

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <AdminDashboard />;
  if (user.role === "OFFICER") return <OfficerDashboard />;
  return <StudentDashboard />;
}

/** Wraps every private route: if the account still has a temp password, force them to change it first. */
function ForcePasswordChangeGate({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user?.mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ForcePasswordChangeGate>
                <Home />
              </ForcePasswordChangeGate>
            </PrivateRoute>
          }
        />
        <Route
          path="/submit-request"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <ForcePasswordChangeGate>
                <SubmitRequest />
              </ForcePasswordChangeGate>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <ForcePasswordChangeGate>
                <StudentDashboard />
              </ForcePasswordChangeGate>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
