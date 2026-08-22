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
    <div className="location-page">
      <Navbar />

      <main className="location-container">

        {/* Header */}
        <section className="location-header">
          <span className="eyebrow">
            LOCATION MONITORING
          </span>

          <h1>Location Details</h1>

          <p>
            Detect and visualize your current geographical
            location using browser-based GPS services.
          </p>
        </section>

        {/* Current Location */}
        <section className="location-card">

          <div className="location-card-header">
            <div>
              <span className="section-label">
                GPS POSITION
              </span>

              <h2>Current Location</h2>

              <p>
                Capture your current GPS coordinates.
              </p>
            </div>

            <button
              onClick={getLocation}
              disabled={loading}
              className="location-button"
            >
              {loading
                ? "Detecting Location..."
                : location
                ? "Update Location"
                : "Get My Location"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="location-error">
              <strong>Location Error</strong>
              <p>{error}</p>
            </div>
          )}

          {/* Coordinates */}
          {location && (
            <>
              <div className="location-stats">

                <div className="location-stat">
                  <span>LATITUDE</span>

                  <strong>
                    {location.latitude.toFixed(6)}
                  </strong>
                </div>

                <div className="location-stat">
                  <span>LONGITUDE</span>

                  <strong>
                    {location.longitude.toFixed(6)}
                  </strong>
                </div>

              </div>

              <div className="location-success">
                <span>●</span>

                <div>
                  <strong>Location detected successfully</strong>
                  <p>
                    Your current GPS coordinates are available
                    for road risk prediction.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!location && !error && !loading && (
            <div className="location-empty-state">
              <div className="location-empty-icon">
                ◎
              </div>

              <div>
                <strong>No location detected</strong>

                <p>
                  Click "Get My Location" to detect your
                  current GPS position.
                </p>
              </div>
            </div>
          )}

        </section>

        {/* Map */}
        {location && (
          <section className="location-map-card">

            <div className="location-map-header">
              <div>
                <span className="section-label">
                  GEOSPATIAL VIEW
                </span>

                <h2>Location Map</h2>

                <p>
                  Your current position is marked on the map.
                </p>
              </div>

              <div className="location-coordinates">
                {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </div>
            </div>

            <div className="location-map-wrapper">

              <MapContainer
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                zoom={15}
                className="location-leaflet-map"
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
                    color: "#ffffff",
                    fillColor: "#22c55e",
                    fillOpacity: 0.85,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="location-popup">
                      <h3>Current Location</h3>

                      <p>
                        <strong>Latitude:</strong>{" "}
                        {location.latitude.toFixed(6)}
                      </p>

                      <p>
                        <strong>Longitude:</strong>{" "}
                        {location.longitude.toFixed(6)}
                      </p>
                    </div>
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