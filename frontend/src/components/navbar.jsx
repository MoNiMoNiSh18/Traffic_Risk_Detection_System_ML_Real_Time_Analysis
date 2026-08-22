import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLinkStyle = (path) => ({
    color: location.pathname === path ? "#ffffff" : "#a3a3a3",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "600" : "500",
    padding: "9px 13px",
    borderRadius: "7px",
    backgroundColor:
      location.pathname === path ? "#262626" : "transparent",
    border:
      location.pathname === path
        ? "1px solid #404040"
        : "1px solid transparent",
    transition: "all 0.2s ease",
    cursor: "pointer",
  });

  return (
    <nav
      style={{
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #262626",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "700",
          letterSpacing: "0.5px",
          color: "#ffffff",
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
            padding: "9px 15px",
            border: "1px solid #404040",
            borderRadius: "7px",
            backgroundColor: "#171717",
            color: "#ffffff",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;