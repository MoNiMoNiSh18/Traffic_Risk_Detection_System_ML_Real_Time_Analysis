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
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <p className="auth-brand">ROADSENSE</p>

          <h1>Welcome Back</h1>

          <p className="auth-description">
            Sign in to access your road risk dashboard.
          </p>
        </div>

        <div className="auth-form">

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

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
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="auth-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>
            Create Account
          </button>
        </p>

        <p className="auth-footer">
          AI-based road risk prediction and analysis
        </p>

      </div>
    </div>
  );
}

export default Login;