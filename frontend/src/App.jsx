import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
function App(){
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [token, setToken] = useState(
  localStorage.getItem("token")
);
const [risk, setRisk] = useState("Low");
const [confidence, setConfidence] = useState(0);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
const [prediction, setPrediction] = useState(null);
const [loading, setLoading] = useState(false);
  const login = async () => {
  try {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();

    localStorage.setItem("token", result.access_token);
    setToken(result.access_token);

    setError("Login successful!");
  } catch (error) {
    setError(error.message);
  }
};
const getLocation = () => {
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
});

setRisk("High");
setConfidence(91);
      },
      (error) => {
        setError(error.message);
      }
    );
  };
const getPrediction = async () => {
  setLoading(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          traffic_density: 95,
          horn_events_per_min: 3,
          avg_speed: 150,
          signal_wait_time: 20,
          weather_condition: "Foggy",
          road_quality_score: 5,
          driver_experience_level: "Expert",
          stress_index: 75,
        }),
      }
    );

    if (!response.ok) {
  const errorText = await response.text();
  throw new Error(
    `Prediction failed (${response.status}): ${errorText}`
  );
}

    const result = await response.json();

    setPrediction(result);
    setRisk(result.predicted_risk);
    setConfidence(result.confidence);
} catch (error) {
  console.error(error);
  setError(error.message);
} finally {
    setLoading(false);
  }
};
  return (
    <div>
      <h1>🚦 Traffic Risk Detection System</h1>
      <div>
  <h2>Login</h2>

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button onClick={login}>
    Login
  </button>
</div>
      <button onClick={getLocation}>
        Get My Location
      </button>
    <button onClick={getPrediction}>
  Predict Risk
</button>
      {error && <p>{error}</p>}

      {location && (
        <>
          <h2>Current Location</h2>

          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <div>
          <h2>Current Risk</h2>

          <h3>{risk}</h3>

          <p>Confidence: {confidence}%</p>
        </div>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={15}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                location.latitude,
                location.longitude,
              ]}
            >
              <Popup>
                📍 Your Current Location
              </Popup>
            </Marker>
          </MapContainer>
        </>
      )}
    </div>
  );
}

export default App;