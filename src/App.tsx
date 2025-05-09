import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import ErrorBoundary from "./routes/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route index element={<Navigate replace to="home" />} />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
