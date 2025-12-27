import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
import Header from "./components/Header";
import "./index.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("login");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogin = (newToken, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", name);
    setToken(newToken);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUserName("");
    setPage("login");
  };

  if (!token) {
    return page === "login" ? (
      <LoginPage 
        setToken={setToken} 
        goSignup={() => setPage("signup")} 
        onLogin={handleLogin}
      />
    ) : (
      <SignupPage 
        goLogin={() => setPage("login")} 
      />
    );
  }

  return (
    <div className="app-container">
      <Header onLogout={logout} userName={userName} />
      <UploadPage />
    </div>
  );
}