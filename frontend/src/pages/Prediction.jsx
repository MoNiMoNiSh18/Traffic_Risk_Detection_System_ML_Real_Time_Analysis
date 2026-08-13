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

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    setError("");

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
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Traffic Risk Prediction</h1>

        <h2>Traffic Conditions</h2>

        <label>
          Traffic Density:
          <input
            type="number"
            value={trafficDensity}
            onChange={(e) =>
              setTrafficDensity(Number(e.target.value))
            }
          />
        </label>

        <br />

        <label>
          Horn Events per Minute:
          <input
            type="number"
            value={hornEvents}
            onChange={(e) =>
              setHornEvents(Number(e.target.value))
            }
          />
        </label>

        <br />

        <label>
          Average Speed:
          <input
            type="number"
            value={avgSpeed}
            onChange={(e) =>
              setAvgSpeed(Number(e.target.value))
            }
          />
        </label>

        <br />

        <label>
          Signal Wait Time:
          <input
            type="number"
            value={signalWaitTime}
            onChange={(e) =>
              setSignalWaitTime(Number(e.target.value))
            }
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
            onChange={(e) =>
              setRoadQuality(Number(e.target.value))
            }
          />
        </label>

        <br />

        <label>
          Driver Experience:
          <select
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
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
            onChange={(e) =>
              setStressIndex(Number(e.target.value))
            }
          />
        </label>

        <br />
        <br />

        <button onClick={getPrediction} disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </button>

        {error && <p>{error}</p>}

        {prediction && (
          <div>
            <h2>Prediction Result</h2>

            <h3>
              Risk: {prediction.predicted_risk}
            </h3>

            <p>
              Confidence: {prediction.confidence}%
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Prediction;