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

  return (
    <div>
      <Navbar />

      <main>
        <h1>RoadSense Risk Map</h1>

        <p>
          Geographic view of previous road risk
          predictions and regional risk analysis.
        </p>

        {loading && (
          <p>Loading risk data...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading &&
          locatedPredictions.length === 0 && (
            <p>
              No location-based predictions available
              yet.
            </p>
          )}

        {locatedPredictions.length > 0 && (
          <>
            <section>
              <h2>Regional Risk Analysis</h2>

              {regionalRisk && (
                <>
                  <h3>
                    Regional Risk:{" "}
                    {regionalRisk.regional_risk}
                  </h3>

                  <p>
                    Total Predictions:{" "}
                    {regionalRisk.total_predictions}
                  </p>

                  <p>
                    High Risk:{" "}
                    {regionalRisk.high_risk}
                  </p>

                  <p>
                    Medium Risk:{" "}
                    {regionalRisk.medium_risk}
                  </p>

                  <p>
                    Low Risk:{" "}
                    {regionalRisk.low_risk}
                  </p>

                  {regionalRisk.center && (
                    <p>
                      <strong>
                        Region Center:
                      </strong>
                      <br />
                      Latitude:{" "}
                      {regionalRisk.center.latitude}
                      <br />
                      Longitude:{" "}
                      {regionalRisk.center.longitude}
                    </p>
                  )}
                </>
              )}
            </section>

            <section>
              <h2>Prediction Summary</h2>

              <p>
                Total Mapped Predictions:{" "}
                {locatedPredictions.length}
              </p>

              <p>
                High Risk: {highRiskCount}
              </p>

              <p>
                Medium Risk: {mediumRiskCount}
              </p>

              <p>
                Low Risk: {lowRiskCount}
              </p>
            </section>

            <section>
              <h2>Map Legend</h2>

              <p>
                <span style={{ color: "green" }}>
                  ●
                </span>{" "}
                Low Risk
              </p>

              <p>
                <span style={{ color: "orange" }}>
                  ●
                </span>{" "}
                Medium Risk
              </p>

              <p>
                <span style={{ color: "red" }}>
                  ●
                </span>{" "}
                High Risk
              </p>
            </section>

            <MapContainer
              center={[
                locatedPredictions[0].latitude,
                locatedPredictions[0].longitude,
              ]}
              zoom={15}
              style={{
                height: "600px",
                width: "100%",
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
                      <div>
                        <h3>
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
          </>
        )}
      </main>
    </div>
  );
}

export default RiskMap;