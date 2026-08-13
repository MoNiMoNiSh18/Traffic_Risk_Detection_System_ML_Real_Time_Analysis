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
  const [risk, setRisk] = useState("Low");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState("");

  const getLocation = () => {
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Location Details</h1>

        <button onClick={getLocation}>
          Get My Location
        </button>

        {error && <p>{error}</p>}

        {location && (
          <>
            <h2>Current Location</h2>

            <p>
              Latitude: {location.latitude}
            </p>

            <p>
              Longitude: {location.longitude}
            </p>

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
                radius={15}
                pathOptions={{
                  color:
                    risk === "High"
                      ? "red"
                      : risk === "Medium"
                      ? "orange"
                      : "green",

                  fillColor:
                    risk === "High"
                      ? "red"
                      : risk === "Medium"
                      ? "orange"
                      : "green",

                  fillOpacity: 0.7,
                }}
              >
                <Popup>
                  Current Traffic Risk: {risk}
                  <br />
                  Confidence: {confidence}%
                </Popup>
              </CircleMarker>
            </MapContainer>
          </>
        )}
      </main>
    </div>
  );
}

export default Location;