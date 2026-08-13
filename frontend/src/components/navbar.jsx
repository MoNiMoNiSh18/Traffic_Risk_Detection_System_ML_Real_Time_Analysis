import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav>
      <h2>Traffic Risk System</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>{" "}
        <Link to="/location">Location Details</Link>{" "}
        <Link to="/prediction">Prediction</Link>{" "}
        <Link to="/history">View Predictions</Link>{" "}
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;