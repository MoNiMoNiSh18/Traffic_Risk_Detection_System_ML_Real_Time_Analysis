import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const result = await response.json();

      localStorage.setItem("token", result.access_token);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#2563eb",
              fontWeight: "700",
              letterSpacing: "1px",
              fontSize: "14px",
            }}
          >
            ROADSENSE
          </p>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontSize: "30px",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Sign in to access your road risk dashboard.
          </p>
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: loading ? "#93c5fd" : "#2563eb",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "13px",
            marginTop: "24px",
            marginBottom: 0,
          }}
        >
          AI-based road risk prediction and analysis
        </p>
      </div>
    </div>
  );
}

export default Login;