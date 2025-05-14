import { Navigate, Route, Routes } from "react-router-dom";
// import Auth from "./pages/auth/Auth";
// import Home from "./pages/home/Home";
import { lazy, Suspense } from "react";
// import ErrorBoundary from "./routes/ErrorBoundary";
import ErrorBoundary from "./routes/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./UI/loader/Loader";

const Auth = lazy(() => import("./pages/auth/Auth"));
const Home = lazy(() => import("./pages/home/Home"));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
