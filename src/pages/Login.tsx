import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useAuth } from "@/context/AuthContext";

const loginUrl = import.meta.env.VITE_LOGIN_URL || "http://localhost:8080/realms/internal/protocol/openid-connect/token";

const loginRequest = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 0));

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: "local-internal-app",
      username: "admin",
      password: "admin",
    }),
  });

  if (!response.ok) throw new Error("Login failed");
  const result = await response.json();
  return result.access_token;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔹 Clear localStorage when arriving at login
  useEffect(() => {
    localStorage.clear();
    console.log("LocalStorage cleared on login page load");
  }, []);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const token = await loginRequest();
      login(token);
      setFadeOut(true);
      setTimeout(() => navigate("/dashboard"), 500);
    } catch {
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate, login]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center w-screen h-screen"
    >
      <div className="relative w-full h-full flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] overflow-hidden">
        <Spotlight />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            R&D Form
          </h1>
          <div className="mt-4 text-base text-neutral-300 text-center">
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <KeyRound className="mr-2" />}
              {loading ? "Please wait" : "Login"}
            </Button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
