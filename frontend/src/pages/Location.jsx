import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";

function Location() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setError("");
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
          maxWidth: "1100px",
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
            LOCATION MONITORING
          </p>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontSize: "34px",
            }}
          >
            Location Details
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Detect and visualize your current geographical
            location using browser-based GPS services.
          </p>
        </section>

        {/* Location Card */}
        <section
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "28px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#111827",
                }}
              >
                Current Location
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                Capture your current GPS coordinates.
              </p>
            </div>

            <button
              onClick={getLocation}
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
                ? "Detecting Location..."
                : location
                ? "Update Location"
                : "Get My Location"}
            </button>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "20px",
              }}
            >
              <strong>Location Error:</strong> {error}
            </div>
          )}

          {location && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "18px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 7px",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Latitude
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "18px",
                      fontWeight: "600",
                      wordBreak: "break-word",
                    }}
                  >
                    {location.latitude}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "18px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 7px",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Longitude
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "18px",
                      fontWeight: "600",
                      wordBreak: "break-word",
                    }}
                  >
                    {location.longitude}
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  padding: "12px 15px",
                  backgroundColor: "#ecfdf5",
                  color: "#047857",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✓ Location detected successfully.
              </div>
            </>
          )}
        </section>

        {/* Map */}
        {location && (
          <section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              padding: "28px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#111827",
                }}
              >
                Location Map
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                Your current position is marked on the map.
              </p>
            </div>

            <div
              style={{
                overflow: "hidden",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
              }}
            >
              <MapContainer
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                zoom={15}
                style={{
                  height: "500px",
                  width: "100%",
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <CircleMarker
                  center={[
                    location.latitude,
                    location.longitude,
                  ]}
                  radius={12}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#2563eb",
                    fillOpacity: 0.6,
                  }}
                >
                  <Popup>
                    <strong>Current Location</strong>
                    <br />
                    Latitude: {location.latitude}
                    <br />
                    Longitude: {location.longitude}
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Location;