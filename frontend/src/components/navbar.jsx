import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

const navLinkStyle = (path) => ({
  color: location.pathname === path ? "#ffffff" : "#d1d5db",
  textDecoration: "none",
  fontWeight: location.pathname === path ? "600" : "500",
  padding: "8px 12px",
  borderRadius: "6px",
  backgroundColor:
    location.pathname === path ? "#2563eb" : "transparent",
  transition: "all 0.2s ease",
  cursor: "pointer",
});

  return (
    <nav
      style={{
        backgroundColor: "#111827",
        color: "#ffffff",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "700",
          letterSpacing: "0.5px",
        }}
      >
        RoadSense
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Link
          to="/dashboard"
          style={navLinkStyle("/dashboard")}
        >
          Dashboard
        </Link>

        <Link
          to="/location"
          style={navLinkStyle("/location")}
        >
          Location
        </Link>

        <Link
          to="/prediction"
          style={navLinkStyle("/prediction")}
        >
          Prediction
        </Link>

        <Link
          to="/history"
          style={navLinkStyle("/history")}
        >
          History
        </Link>

        <Link
          to="/risk-map"
          style={navLinkStyle("/risk-map")}
        >
          Risk Map
        </Link>

        <button
          onClick={logout}
          style={{
            marginLeft: "10px",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
