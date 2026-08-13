import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch prediction history");
        }

        const result = await response.json();

        setHistory(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  const totalPredictions = history.length;

  const highRiskCount = history.filter(
    (item) => item.predicted_risk === "High"
  ).length;

  const mediumRiskCount = history.filter(
    (item) => item.predicted_risk === "Medium"
  ).length;

  const lowRiskCount = history.filter(
    (item) => item.predicted_risk === "Low"
  ).length;

  return (
    <div>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section>
          <h1>Welcome to RoadSense</h1>

          <p>
            AI-powered road risk prediction and
            location-based traffic analysis.
          </p>

          <p>
            Analyze driving conditions, identify potential
            road risks, and visualize risk patterns
            geographically.
          </p>
        </section>

        {/* Risk Overview */}
        <section>
          <h2>Risk Overview</h2>

          {loading ? (
            <p>Loading risk statistics...</p>
          ) : (
            <div>
              <div>
                <h3>Total Predictions</h3>
                <p>{totalPredictions}</p>
              </div>

              <div>
                <h3>High Risk</h3>
                <p>{highRiskCount}</p>
              </div>

              <div>
                <h3>Medium Risk</h3>
                <p>{mediumRiskCount}</p>
              </div>

              <div>
                <h3>Low Risk</h3>
                <p>{lowRiskCount}</p>
              </div>
            </div>
          )}
        </section>

        {/* Quick Access */}
        <section>
          <h2>Quick Access</h2>

          <div>
            <Link to="/location">
              <button>📍 Location Details</button>
            </Link>

            <Link to="/prediction">
              <button>🎯 Predict Risk</button>
            </Link>

            <Link to="/history">
              <button>📜 Prediction History</button>
            </Link>

            <Link to="/risk-map">
              <button>🗺️ Risk Map</button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2>How RoadSense Works</h2>

          <div>
            <div>
              <h3>1. Location</h3>
              <p>
                Capture the current geographical location
                using browser location services.
              </p>
            </div>

            <div>
              <h3>2. Risk Prediction</h3>
              <p>
                Analyze traffic and driving conditions using
                the trained machine learning model.
              </p>
            </div>

            <div>
              <h3>3. Risk Analysis</h3>
              <p>
                Store predictions and analyze road risk
                patterns based on geographical information.
              </p>
            </div>

            <div>
              <h3>4. Visualization</h3>
              <p>
                View risk information on an interactive
                geographical map.
              </p>
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2>About RoadSense</h2>

          <p>
            RoadSense is an AI-based traffic risk detection
            system designed to identify potential road risks
            before they lead to unsafe situations.
          </p>

          <p>
            The system combines machine learning,
            geographical location data, and interactive
            visualization to support proactive road safety
            analysis.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;