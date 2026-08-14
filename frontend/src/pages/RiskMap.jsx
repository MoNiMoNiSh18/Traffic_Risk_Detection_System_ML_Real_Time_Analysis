import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";

function RiskMap() {
  const [history, setHistory] = useState([]);
  const [regionalRisk, setRegionalRisk] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRiskData = async () => {
      try {
        const token = localStorage.getItem("token");

        const historyResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!historyResponse.ok) {
          throw new Error(
            "Failed to fetch prediction history"
          );
        }

        const historyResult =
          await historyResponse.json();

        setHistory(historyResult);

        const regionalResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/regional-risk",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!regionalResponse.ok) {
          throw new Error(
            "Failed to fetch regional risk"
          );
        }

        const regionalResult =
          await regionalResponse.json();

        setRegionalRisk(regionalResult);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getRiskData();
  }, []);

  const locatedPredictions = history.filter(
    (item) =>
      item.latitude !== null &&
      item.longitude !== null
  );

  const highRiskCount = locatedPredictions.filter(
    (item) => item.predicted_risk === "High"
  ).length;

  const mediumRiskCount = locatedPredictions.filter(
    (item) => item.predicted_risk === "Medium"
  ).length;

  const lowRiskCount = locatedPredictions.filter(
    (item) => item.predicted_risk === "Low"
  ).length;

  const getRiskColor = (risk) => {
    if (risk === "High") {
      return "red";
    }

    if (risk === "Medium") {
      return "orange";
    }

    return "green";
  };

  const getRiskBadgeStyle = (risk) => {
    if (risk === "High") {
      return {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (risk === "Medium") {
      return {
        backgroundColor: "#ffedd5",
        color: "#c2410c",
      };
    }

    return {
      backgroundColor: "#dcfce7",
      color: "#15803d",
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
              fontSize: "14px",
              letterSpacing: "0.5px",
            }}
          >
            GEOSPATIAL ANALYSIS
          </p>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "36px",
              color: "#111827",
            }}
          >
            RoadSense Risk Map
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Geographic view of previous road risk
            predictions and regional risk analysis.
          </p>
        </section>

        {loading && (
          <section
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p style={{ margin: 0 }}>
              Loading risk data...
            </p>
          </section>
        )}

        {error && (
          <section
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "18px 20px",
              borderRadius: "10px",
              marginBottom: "25px",
            }}
          >
            <strong>Error:</strong> {error}
          </section>
        )}

        {!loading &&
          locatedPredictions.length === 0 && (
            <section
              style={{
                backgroundColor: "#ffffff",
                padding: "30px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2>No Risk Data Available</h2>

              <p style={{ color: "#6b7280" }}>
                No location-based predictions are
                available yet.
              </p>
            </section>
          )}

        {locatedPredictions.length > 0 && (
          <>
            {/* Regional Risk */}
            <section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "28px",
                marginBottom: "25px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 6px",
                      color: "#6b7280",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    REGIONAL ASSESSMENT
                  </p>

                  <h2
                    style={{
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    Regional Risk
                  </h2>
                </div>

                {regionalRisk && (
                  <span
                    style={{
                      ...getRiskBadgeStyle(
                        regionalRisk.regional_risk
                      ),
                      padding: "10px 18px",
                      borderRadius: "999px",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    {regionalRisk.regional_risk} Risk
                  </span>
                )}
              </div>

              {regionalRisk && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                    marginTop: "25px",
                  }}
                >
                  <div
                    style={{
                      padding: "18px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "10px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "13px",
                      }}
                    >
                      Total Predictions
                    </p>

                    <h3
                      style={{
                        margin: "6px 0 0",
                        fontSize: "26px",
                      }}
                    >
                      {regionalRisk.total_predictions}
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      backgroundColor: "#fef2f2",
                      borderRadius: "10px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#991b1b",
                        fontSize: "13px",
                      }}
                    >
                      High Risk
                    </p>

                    <h3
                      style={{
                        margin: "6px 0 0",
                        fontSize: "26px",
                        color: "#b91c1c",
                      }}
                    >
                      {regionalRisk.high_risk}
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      backgroundColor: "#fff7ed",
                      borderRadius: "10px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#c2410c",
                        fontSize: "13px",
                      }}
                    >
                      Medium Risk
                    </p>

                    <h3
                      style={{
                        margin: "6px 0 0",
                        fontSize: "26px",
                        color: "#c2410c",
                      }}
                    >
                      {regionalRisk.medium_risk}
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      backgroundColor: "#f0fdf4",
                      borderRadius: "10px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#15803d",
                        fontSize: "13px",
                      }}
                    >
                      Low Risk
                    </p>

                    <h3
                      style={{
                        margin: "6px 0 0",
                        fontSize: "26px",
                        color: "#15803d",
                      }}
                    >
                      {regionalRisk.low_risk}
                    </h3>
                  </div>
                </div>
              )}

              {regionalRisk?.center && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "10px",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  <strong>Region Center</strong>
                  <br />
                  Latitude:{" "}
                  {regionalRisk.center.latitude}
                  <br />
                  Longitude:{" "}
                  {regionalRisk.center.longitude}
                </div>
              )}
            </section>

            {/* Prediction Summary */}
            <section
              style={{
                marginBottom: "25px",
              }}
            >
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
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "18px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "22px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                    }}
                  >
                    Total Mapped
                  </p>

                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontSize: "30px",
                      color: "#111827",
                    }}
                  >
                    {locatedPredictions.length}
                  </h3>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "22px",
                    borderRadius: "12px",
                    border: "1px solid #fecaca",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#b91c1c",
                    }}
                  >
                    High Risk
                  </p>

                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontSize: "30px",
                      color: "#b91c1c",
                    }}
                  >
                    {highRiskCount}
                  </h3>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "22px",
                    borderRadius: "12px",
                    border: "1px solid #fed7aa",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#c2410c",
                    }}
                  >
                    Medium Risk
                  </p>

                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontSize: "30px",
                      color: "#c2410c",
                    }}
                  >
                    {mediumRiskCount}
                  </h3>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "22px",
                    borderRadius: "12px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#15803d",
                    }}
                  >
                    Low Risk
                  </p>

                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontSize: "30px",
                      color: "#15803d",
                    }}
                  >
                    {lowRiskCount}
                  </h3>
                </div>
              </div>
            </section>

            {/* Map */}
            <section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "22px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: "0 0 5px",
                      color: "#111827",
                    }}
                  >
                    Risk Distribution Map
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Click a marker to view prediction
                    details.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    fontSize: "14px",
                  }}
                >
                  <span>
                    <span style={{ color: "green" }}>
                      ●
                    </span>{" "}
                    Low
                  </span>

                  <span>
                    <span style={{ color: "orange" }}>
                      ●
                    </span>{" "}
                    Medium
                  </span>

                  <span>
                    <span style={{ color: "red" }}>
                      ●
                    </span>{" "}
                    High
                  </span>
                </div>
              </div>

              <MapContainer
                center={[
                  locatedPredictions[0].latitude,
                  locatedPredictions[0].longitude,
                ]}
                zoom={15}
                style={{
                  height: "600px",
                  width: "100%",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locatedPredictions.map((item) => {
                  const riskColor =
                    getRiskColor(
                      item.predicted_risk
                    );

                  return (
                    <CircleMarker
                      key={item.id}
                      center={[
                        item.latitude,
                        item.longitude,
                      ]}
                      radius={12}
                      pathOptions={{
                        color: riskColor,
                        fillColor: riskColor,
                        fillOpacity: 0.7,
                      }}
                    >
                      <Popup>
                        <div
                          style={{
                            minWidth: "210px",
                          }}
                        >
                          <h3
                            style={{
                              marginTop: 0,
                              color: riskColor,
                            }}
                          >
                            {item.predicted_risk} Risk
                          </h3>

                          <p>
                            <strong>
                              Confidence:
                            </strong>{" "}
                            {item.confidence}%
                          </p>

                          <p>
                            <strong>
                              Traffic Density:
                            </strong>{" "}
                            {item.traffic_density}
                          </p>

                          <p>
                            <strong>
                              Average Speed:
                            </strong>{" "}
                            {item.avg_speed}
                          </p>

                          <p>
                            <strong>
                              Weather:
                            </strong>{" "}
                            {item.weather_condition}
                          </p>

                          <p>
                            <strong>
                              Road Quality:
                            </strong>{" "}
                            {item.road_quality_score}
                          </p>

                          <p>
                            <strong>
                              Stress Index:
                            </strong>{" "}
                            {item.stress_index}
                          </p>

                          <p>
                            <strong>
                              Location:
                            </strong>
                            <br />
                            {item.latitude},{" "}
                            {item.longitude}
                          </p>

                          <p>
                            <strong>
                              Recorded:
                            </strong>
                            <br />
                            {item.created_at}
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default RiskMap;