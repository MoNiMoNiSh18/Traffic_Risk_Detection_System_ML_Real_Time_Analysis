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

  const getRiskColor = (risk) => {
    if (risk === "High") return "red";
    if (risk === "Medium") return "orange";
    return "green";
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Prediction History</h1>

        <p>
          Review previous RoadSense risk predictions and
          their associated traffic conditions.
        </p>

        <button onClick={getHistory} disabled={loading}>
          {loading ? "Loading..." : "Load Prediction History"}
        </button>

        {error && <p>{error}</p>}

        {history.length > 0 && (
          <section>
            <h2>Prediction Summary</h2>

            <p>
              <strong>Total Predictions:</strong>{" "}
              {history.length}
            </p>

            <p>
              <strong>High Risk:</strong>{" "}
              {highRiskCount}
            </p>

            <p>
              <strong>Medium Risk:</strong>{" "}
              {mediumRiskCount}
            </p>

            <p>
              <strong>Low Risk:</strong>{" "}
              {lowRiskCount}
            </p>
          </section>
        )}

        {history.length === 0 && !loading ? (
          <p>No prediction history loaded.</p>
        ) : (
          history.length > 0 && (
            <section>
              <h2>Previous Predictions</h2>

              <div style={{ overflowX: "auto" }}>
                <table border="1" cellPadding="8">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Risk</th>
                      <th>Confidence</th>
                      <th>Traffic</th>
                      <th>Speed</th>
                      <th>Weather</th>
                      <th>Road Quality</th>
                      <th>Stress</th>
                      <th>Location</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>

                        <td>
                          <strong
                            style={{
                              color: getRiskColor(
                                item.predicted_risk
                              ),
                            }}
                          >
                            {item.predicted_risk}
                          </strong>
                        </td>

                        <td>
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
                            <Link to="/risk-map">
                              View on Map
                            </Link>
                          ) : (
                            "Not available"
                          )}
                        </td>

                        <td>
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        )}
      </main>
    </div>
  );
}

export default History;