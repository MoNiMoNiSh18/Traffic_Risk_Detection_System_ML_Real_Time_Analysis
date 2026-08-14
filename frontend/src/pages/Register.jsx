import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Registration failed."
        );
      }

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(error);
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
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
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
            Create Account
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Create an account to access RoadSense.
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
    Username
  </label>

  <input
    type="text"
    placeholder="Enter your username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
    }}
  />
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
            }}
          />
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
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
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
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                register();
              }
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
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

        {success && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              color: "#15803d",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <button
          onClick={register}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: loading
              ? "#93c5fd"
              : "#2563eb",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            marginBottom: 0,
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
