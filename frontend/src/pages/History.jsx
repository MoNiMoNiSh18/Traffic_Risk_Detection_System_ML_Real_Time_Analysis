import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getHistory = async () => {
    setLoading(true);
    setError("");

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const highRiskCount = history.filter(
    (item) => item.predicted_risk === "High"
  ).length;

  const mediumRiskCount = history.filter(
    (item) => item.predicted_risk === "Medium"
  ).length;

  const lowRiskCount = history.filter(
    (item) => item.predicted_risk === "Low"
  ).length;

  const getRiskClass = (risk) => {
    if (risk === "High") return "risk-high";
    if (risk === "Medium") return "risk-medium";
    return "risk-low";
  };

  return (
    <div>
      <Navbar />

      <main className="risk-map-page">
        {/* Header */}
        <section className="risk-map-header">
          <p className="section-label">ROAD RISK ANALYTICS</p>

          <h1>Prediction History</h1>

          <p>
            Review previous RoadSense risk predictions and
            their associated traffic conditions.
          </p>
        </section>

        {/* Action Card */}
        <section className="risk-regional-card history-action-card">
          <div>
            <p className="risk-card-label">
              PREDICTION RECORDS
            </p>

            <h2>Previous Predictions</h2>

            <p className="history-description">
              Load your previously generated RoadSense
              predictions.
            </p>
          </div>

          <button
            onClick={getHistory}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Load Prediction History"}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className="prediction-error">
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        )}

        {/* Summary */}
        {history.length > 0 && (
          <section className="risk-summary">
            <div className="risk-section-title">
              <h2>Prediction Summary</h2>
            </div>

            <div className="risk-summary-grid">
              {/* Total */}
              <div className="summary-stat">
                <p>Total Predictions</p>
                <h3>{history.length}</h3>
              </div>

              {/* High */}
              <div className="summary-stat summary-high">
                <p>High Risk</p>
                <h3>{highRiskCount}</h3>
              </div>

              {/* Medium */}
              <div className="summary-stat summary-medium">
                <p>Medium Risk</p>
                <h3>{mediumRiskCount}</h3>
              </div>

              {/* Low */}
              <div className="summary-stat summary-low">
                <p>Low Risk</p>
                <h3>{lowRiskCount}</h3>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {history.length === 0 &&
          !loading &&
          !error && (
            <section className="risk-map-message">
              <h2>No Prediction History</h2>

              <p>
                Click "Load Prediction History" to retrieve
                your previous RoadSense predictions.
              </p>
            </section>
          )}

        {/* Prediction Table */}
        {history.length > 0 && (
          <section className="history-table-section">
            <div className="risk-section-title">
              <h2>Previous Predictions</h2>
            </div>

            <div className="history-table-card">
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Risk",
                        "Confidence",
                        "Traffic",
                        "Speed",
                        "Weather",
                        "Road Quality",
                        "Stress",
                        "Location",
                        "Created",
                      ].map((heading) => (
                        <th key={heading}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>

                        <td>
                          <span
                            className={`risk-badge ${getRiskClass(
                              item.predicted_risk
                            )}`}
                          >
                            {item.predicted_risk}
                          </span>
                        </td>

                        <td className="history-strong">
                          {item.confidence}%
                        </td>

                        <td>
                          {item.traffic_density}
                        </td>

                        <td>
                          {item.avg_speed}
                        </td>

                        <td>
                          {item.weather_condition}
                        </td>

                        <td>
                          {item.road_quality_score}
                        </td>

                        <td>
                          {item.stress_index}
                        </td>

                        <td>
                          {item.latitude !== null &&
                          item.longitude !== null ? (
                            <Link
                              to="/risk-map"
                              className="history-map-link"
                            >
                              View on Map →
                            </Link>
                          ) : (
                            <span className="history-unavailable">
                              Not available
                            </span>
                          )}
                        </td>

                        <td className="history-date">
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default History;