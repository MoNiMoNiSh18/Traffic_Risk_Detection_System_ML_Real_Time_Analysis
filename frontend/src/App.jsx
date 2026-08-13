import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
function App(){
  const [history, setHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);

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

const [trafficDensity, setTrafficDensity] = useState(50);
const [hornEvents, setHornEvents] = useState(2);
const [avgSpeed, setAvgSpeed] = useState(60);
const [signalWaitTime, setSignalWaitTime] = useState(30);
const [weather, setWeather] = useState("Clear");
const [roadQuality, setRoadQuality] = useState(7);
const [experience, setExperience] = useState("Intermediate");
const [stressIndex, setStressIndex] = useState(40);

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
  traffic_density: trafficDensity,
  horn_events_per_min: hornEvents,
  avg_speed: avgSpeed,
  signal_wait_time: signalWaitTime,
  weather_condition: weather,
  road_quality_score: roadQuality,
  driver_experience_level: experience,
  stress_index: stressIndex,
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
const getHistory = async () => {
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
    setShowHistory(true);
  } catch (error) {
    console.error(error);
    setError(error.message);
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
<div>
  <h2>Traffic Conditions</h2>

  <label>
    Traffic Density:
    <input
      type="number"
      value={trafficDensity}
      onChange={(e) => setTrafficDensity(Number(e.target.value))}
    />
  </label>

  <br />

  <label>
    Horn Events per Minute:
    <input
      type="number"
      value={hornEvents}
      onChange={(e) => setHornEvents(Number(e.target.value))}
    />
  </label>

  <br />

  <label>
    Average Speed:
    <input
      type="number"
      value={avgSpeed}
      onChange={(e) => setAvgSpeed(Number(e.target.value))}
    />
  </label>

  <br />

  <label>
    Signal Wait Time:
    <input
      type="number"
      value={signalWaitTime}
      onChange={(e) => setSignalWaitTime(Number(e.target.value))}
    />
  </label>

  <br />

  <label>
    Weather:
    <select
      value={weather}
      onChange={(e) => setWeather(e.target.value)}
    >
      <option value="Clear">Clear</option>
      <option value="Rainy">Rainy</option>
      <option value="Foggy">Foggy</option>
    </select>
  </label>

  <br />

  <label>
    Road Quality:
    <input
      type="number"
      min="1"
      max="10"
      value={roadQuality}
      onChange={(e) => setRoadQuality(Number(e.target.value))}
    />
  </label>

  <br />

  <label>
    Driver Experience:
    <select
      value={experience}
      onChange={(e) => setExperience(e.target.value)}
    >
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Expert">Expert</option>
    </select>
  </label>

  <br />

  <label>
    Stress Index:
    <input
      type="number"
      min="0"
      max="100"
      value={stressIndex}
      onChange={(e) => setStressIndex(Number(e.target.value))}
    />
  </label>
</div>
      <button onClick={getLocation}>
        Get My Location
      </button>
    <button onClick={getPrediction}>
  Predict Risk
</button>
<button onClick={getHistory}>
  View Prediction History
</button>
{showHistory && (
  <div>
    <h2>Prediction History</h2>

    {history.length === 0 ? (
      <p>No prediction history found.</p>
    ) : (
      history.map((item) => (
        <div key={item.id}>
          <hr />

          <p>
            <strong>Risk:</strong> {item.predicted_risk}
          </p>

          <p>
            <strong>Confidence:</strong> {item.confidence}%
          </p>

          <p>
            <strong>Traffic Density:</strong> {item.traffic_density}
          </p>

          <p>
            <strong>Average Speed:</strong> {item.avg_speed}
          </p>

          <p>
            <strong>Weather:</strong> {item.weather_condition}
          </p>

          <p>
            <strong>Created:</strong> {item.created_at}
          </p>
        </div>
      ))
    )}
  </div>
)}
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
    </div>
  );
}

export default App;