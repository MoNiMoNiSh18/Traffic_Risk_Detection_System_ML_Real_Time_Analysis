import { useState } from "react";
import Navbar from "../components/Navbar";

function Prediction() {
  const [trafficDensity, setTrafficDensity] = useState(50);
  const [hornEvents, setHornEvents] = useState(2);
  const [avgSpeed, setAvgSpeed] = useState(60);
  const [signalWaitTime, setSignalWaitTime] = useState(30);
  const [weather, setWeather] = useState("Clear");
  const [roadQuality, setRoadQuality] = useState(7);
  const [experience, setExperience] = useState("Intermediate");
  const [stressIndex, setStressIndex] = useState(40);

  const [location, setLocation] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

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

  const getPrediction = async () => {
    setError("");
    setPrediction(null);

    if (!location) {
      setError("Please get your current location before predicting risk.");
      return;
    }

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
            latitude: location.latitude,
            longitude: location.longitude,
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
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = () => {
    if (!prediction) {
      return "";
    }

    return prediction.predicted_risk.toLowerCase();
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Traffic Risk Prediction</h1>

        <p>
          Enter the current traffic and road conditions to
          generate a risk prediction.
        </p>

        <section>
          <h2>Current Location</h2>

          <button onClick={getLocation}>
            {location ? "Update Location" : "Get Current Location"}
          </button>

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

              <p>Location captured successfully.</p>
            </div>
          )}
        </section>

        <section>
          <h2>Traffic Conditions</h2>

          <div>
            <label>
              Traffic Density
              <br />
              <input
                type="number"
                min="0"
                max="100"
                value={trafficDensity}
                onChange={(e) =>
                  setTrafficDensity(Number(e.target.value))
                }
              />
            </label>
          </div>

          <br />

          <div>
            <label>
              Horn Events per Minute
              <br />
              <input
                type="number"
                min="0"
                value={hornEvents}
                onChange={(e) =>
                  setHornEvents(Number(e.target.value))
                }
              />
            </label>
          </div>

          <br />

          <div>
            <label>
              Average Speed
              <br />
              <input
                type="number"
                min="0"
                max="200"
                value={avgSpeed}
                onChange={(e) =>
                  setAvgSpeed(Number(e.target.value))
                }
              />
            </label>
          </div>

          <br />

          <div>
            <label>
              Signal Wait Time
              <br />
              <input
                type="number"
                min="0"
                value={signalWaitTime}
                onChange={(e) =>
                  setSignalWaitTime(Number(e.target.value))
                }
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Road and Environment</h2>

          <div>
            <label>
              Weather Condition
              <br />
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              >
                <option value="Clear">Clear</option>
                <option value="Foggy">Foggy</option>
                <option value="Hot">Hot</option>
                <option value="Rainy">Rainy</option>
              </select>
            </label>
          </div>

          <br />

          <div>
            <label>
              Road Quality Score
              <br />
              <input
                type="number"
                min="0"
                max="10"
                value={roadQuality}
                onChange={(e) =>
                  setRoadQuality(Number(e.target.value))
                }
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Driver Conditions</h2>

          <div>
            <label>
              Driver Experience
              <br />
              <select
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Expert">Expert</option>
              </select>
            </label>
          </div>

          <br />

          <div>
            <label>
              Stress Index
              <br />
              <input
                type="number"
                min="0"
                max="100"
                value={stressIndex}
                onChange={(e) =>
                  setStressIndex(Number(e.target.value))
                }
              />
            </label>
          </div>
        </section>

        <section>
          <button
            onClick={getPrediction}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Predict Risk"}
          </button>
        </section>

        {error && (
          <section>
            <h2>Prediction Error</h2>
            <p>{error}</p>
          </section>
        )}

        {prediction && (
          <section>
            <h2>Prediction Result</h2>

            <div className={getRiskClass()}>
              <h3>{prediction.predicted_risk} Risk</h3>

              <p>
                <strong>
                  Confidence: {prediction.confidence}%
                </strong>
              </p>
            </div>

            <p>
              Prediction generated successfully for the
              current location.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default Prediction;