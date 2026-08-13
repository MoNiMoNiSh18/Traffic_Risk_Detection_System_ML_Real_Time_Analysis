import { useState } from "react";
import Navbar from "../components/Navbar";

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getHistory = async () => {
    setLoading(true);
    setError("");

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
        <h1>Prediction History</h1>

        <button onClick={getHistory} disabled={loading}>
          {loading ? "Loading..." : "Load Prediction History"}
        </button>

        {error && <p>{error}</p>}

        {history.length === 0 && !loading ? (
          <p>No prediction history loaded.</p>
        ) : (
          history.map((item) => (
            <div key={item.id}>
              <hr />

              <p>
                <strong>Risk:</strong>{" "}
                {item.predicted_risk}
              </p>

              <p>
                <strong>Confidence:</strong>{" "}
                {item.confidence}%
              </p>

              <p>
                <strong>Traffic Density:</strong>{" "}
                {item.traffic_density}
              </p>

              <p>
                <strong>Average Speed:</strong>{" "}
                {item.avg_speed}
              </p>

              <p>
                <strong>Weather:</strong>{" "}
                {item.weather_condition}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {item.created_at}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default History;