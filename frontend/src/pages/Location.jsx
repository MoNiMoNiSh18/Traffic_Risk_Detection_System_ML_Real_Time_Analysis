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
    <div>
      <Navbar />

      <main>
        <h1>Location Details</h1>

        <p>
          Detect and view your current location using
          browser-based GPS services.
        </p>

        <section>
          <h2>Current Location</h2>

          <button
            onClick={getLocation}
            disabled={loading}
          >
            {loading
              ? "Detecting Location..."
              : location
              ? "Update Location"
              : "Get My Location"}
          </button>

          {error && (
            <p>
              <strong>Location Error:</strong> {error}
            </p>
          )}

          {location && (
            <div>
              <p>
                <strong>Latitude:</strong>{" "}
                {location.latitude}
              </p>

              <p>
                <strong>Longitude:</strong>{" "}
                {location.longitude}
              </p>

              <p>
                Location detected successfully.
              </p>
            </div>
          )}
        </section>

        {location && (
          <section>
            <h2>Location Map</h2>

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
                  color: "blue",
                  fillColor: "blue",
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
          </section>
        )}
      </main>
    </div>
  );
}

export default Location;