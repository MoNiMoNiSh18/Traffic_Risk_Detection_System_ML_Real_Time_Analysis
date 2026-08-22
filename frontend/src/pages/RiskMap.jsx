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

        const historyResult = await historyResponse.json();

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
    <div className="page">
      <Navbar />

      <main className="risk-map-page">

        {/* Header */}
        <section className="risk-map-header">
          <p className="section-label">
            GEOSPATIAL ANALYSIS
          </p>

          <h1>RoadSense Risk Map</h1>

          <p>
            Geographic view of previous road risk
            predictions and regional risk analysis.
          </p>
        </section>

        {/* Loading */}
        {loading && (
          <section className="risk-map-message">
            <p>Loading risk data...</p>
          </section>
        )}

        {/* Error */}
        {error && (
          <section className="risk-map-error">
            <strong>Error:</strong> {error}
          </section>
        )}

        {/* Empty */}
        {!loading &&
          locatedPredictions.length === 0 && (
            <section className="risk-map-message">
              <h2>No Risk Data Available</h2>

              <p>
                No location-based predictions are
                available yet.
              </p>
            </section>
          )}

        {locatedPredictions.length > 0 && (
          <>

            {/* Regional Risk */}
            <section className="risk-regional-card">

              <div className="risk-card-header">

                <div>
                  <p className="risk-card-label">
                    REGIONAL ASSESSMENT
                  </p>

                  <h2>Regional Risk</h2>
                </div>

                {regionalRisk && (
                  <span
                    className="risk-badge"
                    style={getRiskBadgeStyle(
                      regionalRisk.regional_risk
                    )}
                  >
                    {regionalRisk.regional_risk} Risk
                  </span>
                )}

              </div>

              {regionalRisk && (
                <div className="regional-stats">

                  <div className="regional-stat">
                    <p>Total Predictions</p>

                    <h3>
                      {regionalRisk.total_predictions}
                    </h3>
                  </div>

                  <div className="regional-stat regional-high">
                    <p>High Risk</p>

                    <h3>
                      {regionalRisk.high_risk}
                    </h3>
                  </div>

                  <div className="regional-stat regional-medium">
                    <p>Medium Risk</p>

                    <h3>
                      {regionalRisk.medium_risk}
                    </h3>
                  </div>

                  <div className="regional-stat regional-low">
                    <p>Low Risk</p>

                    <h3>
                      {regionalRisk.low_risk}
                    </h3>
                  </div>

                </div>
              )}

              {regionalRisk?.center && (
                <div className="region-center">
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
            <section className="risk-summary">

              <div className="risk-section-title">
                <h2>Prediction Summary</h2>
              </div>

              <div className="risk-summary-grid">

                <div className="summary-stat">
                  <p>Total Mapped</p>

                  <h3>
                    {locatedPredictions.length}
                  </h3>
                </div>

                <div className="summary-stat summary-high">
                  <p>High Risk</p>

                  <h3>
                    {highRiskCount}
                  </h3>
                </div>

                <div className="summary-stat summary-medium">
                  <p>Medium Risk</p>

                  <h3>
                    {mediumRiskCount}
                  </h3>
                </div>

                <div className="summary-stat summary-low">
                  <p>Low Risk</p>

                  <h3>
                    {lowRiskCount}
                  </h3>
                </div>

              </div>

            </section>

            {/* Map */}
            <section className="risk-map-card">

              <div className="map-header">

                <div>
                  <h2>Risk Distribution Map</h2>

                  <p>
                    Click a marker to view prediction
                    details.
                  </p>
                </div>

                <div className="map-legend">

                  <span>
                    <span className="legend-dot low">
                      ●
                    </span>
                    Low
                  </span>

                  <span>
                    <span className="legend-dot medium">
                      ●
                    </span>
                    Medium
                  </span>

                  <span>
                    <span className="legend-dot high">
                      ●
                    </span>
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
                className="risk-leaflet-map"
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

                        <div className="risk-popup">

                          <h3
                            style={{
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