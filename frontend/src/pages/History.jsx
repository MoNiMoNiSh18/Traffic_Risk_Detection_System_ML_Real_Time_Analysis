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

  const getRiskStyle = (risk) => {
    if (risk === "High") {
      return {
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
      };
    }

    if (risk === "Medium") {
      return {
        backgroundColor: "#fff7ed",
        color: "#c2410c",
      };
    }

    return {
      backgroundColor: "#ecfdf5",
      color: "#047857",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "45px 30px",
        }}
      >
        {/* Header */}
        <section style={{ marginBottom: "30px" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#2563eb",
              fontWeight: "700",
              letterSpacing: "0.8px",
              fontSize: "14px",
            }}
          >
            ROAD RISK ANALYTICS
          </p>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontSize: "34px",
            }}
          >
            Prediction History
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Review previous RoadSense risk predictions and
            their associated traffic conditions.
          </p>
        </section>

        {/* Action Card */}
        <section
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "22px 26px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 5px",
                color: "#111827",
                fontSize: "20px",
              }}
            >
              Prediction Records
            </h2>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              Load your previously generated predictions.
            </p>
          </div>

          <button
            onClick={getHistory}
            disabled={loading}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: loading
                ? "#93c5fd"
                : "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Loading..."
              : "Load Prediction History"}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "25px",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Summary Cards */}
        {history.length > 0 && (
          <section style={{ marginBottom: "30px" }}>
            <h2
              style={{
                color: "#111827",
                marginBottom: "18px",
              }}
            >
              Prediction Summary
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "18px",
              }}
            >
              {/* Total */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Total Predictions
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    color: "#111827",
                  }}
                >
                  {history.length}
                </h3>
              </div>

              {/* High */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#b91c1c",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  High Risk
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    color: "#b91c1c",
                  }}
                >
                  {highRiskCount}
                </h3>
              </div>

              {/* Medium */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #fed7aa",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#c2410c",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Medium Risk
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    color: "#c2410c",
                  }}
                >
                  {mediumRiskCount}
                </h3>
              </div>

              {/* Low */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #a7f3d0",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#047857",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Low Risk
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    color: "#047857",
                  }}
                >
                  {lowRiskCount}
                </h3>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {history.length === 0 && !loading && !error && (
          <section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              padding: "45px 30px",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2
              style={{
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              No Prediction History
            </h2>

            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Click "Load Prediction History" to retrieve
              your previous RoadSense predictions.
            </p>
          </section>
        )}

        {/* Prediction Table */}
        {history.length > 0 && (
          <section>
            <h2
              style={{
                color: "#111827",
                marginBottom: "18px",
              }}
            >
              Previous Predictions
            </h2>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.06)",
                overflow: "hidden",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "950px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#f9fafb",
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
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
                        <th
                          key={heading}
                          style={{
                            padding: "14px 16px",
                            textAlign: "left",
                            color: "#4b5563",
                            fontSize: "13px",
                            fontWeight: "700",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom:
                            "1px solid #f3f4f6",
                        }}
                      >
                        <td
                          style={{
                            padding: "16px",
                            color: "#6b7280",
                          }}
                        >
                          #{item.id}
                        </td>

                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              ...getRiskStyle(
                                item.predicted_risk
                              ),
                              padding:
                                "5px 10px",
                              borderRadius:
                                "999px",
                              fontSize: "13px",
                              fontWeight: "700",
                            }}
                          >
                            {item.predicted_risk}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {item.confidence}%
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            color: "#4b5563",
                          }}
                        >
                          {item.traffic_density}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            color: "#4b5563",
                          }}
                        >
                          {item.avg_speed}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            color: "#4b5563",
                          }}
                        >
                          {item.weather_condition}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            color: "#4b5563",
                          }}
                        >
                          {item.road_quality_score}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            color: "#4b5563",
                          }}
                        >
                          {item.stress_index}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                          }}
                        >
                          {item.latitude !== null &&
                          item.longitude !== null ? (
                            <Link
                              to="/risk-map"
                              style={{
                                color: "#2563eb",
                                fontWeight: "600",
                                textDecoration:
                                  "none",
                              }}
                            >
                              View on Map →
                            </Link>
                          ) : (
                            <span
                              style={{
                                color: "#9ca3af",
                              }}
                            >
                              Not available
                            </span>
                          )}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            color: "#6b7280",
                            whiteSpace: "nowrap",
                          }}
                        >
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