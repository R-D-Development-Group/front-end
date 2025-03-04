import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import FormCreation from "@/pages/FormCreation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

const App: React.FC = () => (
  <AuthProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form/create" element={<FormCreation mode="create"/>} />
          <Route path="/form/:id" element={<FormCreation mode="view"/>} />
        </Route>
      </Routes>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
