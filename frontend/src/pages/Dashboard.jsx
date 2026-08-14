import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="page">
      <Navbar />

      <main className="dashboard">
        {/* Hero */}
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">ROADSENSE</span>

            <h1>Welcome to RoadSense</h1>

            <p>
              AI-based road risk prediction and location analysis
              for proactive traffic safety monitoring.
            </p>
          </div>

          <div className="hero-badge">
            <span>●</span>
            <div>
              <strong>System Active</strong>
              <small>Risk monitoring ready</small>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE</span>
              <h2>Quick Access</h2>
            </div>

            <p>
              Access the main RoadSense monitoring and analysis tools.
            </p>
          </div>

          <div className="dashboard-grid">
            {/* Location */}
            <div className="dashboard-card">
              <div className="card-icon">⌖</div>

              <div className="card-content">
                <h3>Location</h3>

                <p>
                  Detect your current location and view it
                  on the interactive map.
                </p>

                <Link to="/location" className="card-link">
                  View Location <span>→</span>
                </Link>
              </div>
            </div>

            {/* Prediction */}
            <div className="dashboard-card featured-card">
              <div className="card-icon">◈</div>

              <div className="card-content">
                <h3>Risk Prediction</h3>

                <p>
                  Analyze traffic, road, environmental and
                  driver conditions using the AI model.
                </p>

                <Link to="/prediction" className="card-link">
                  Predict Risk <span>→</span>
                </Link>
              </div>
            </div>

            {/* History */}
            <div className="dashboard-card">
              <div className="card-icon">◷</div>

              <div className="card-content">
                <h3>Prediction History</h3>

                <p>
                  Review previously generated road risk
                  predictions and their details.
                </p>

                <Link to="/history" className="card-link">
                  View History <span>→</span>
                </Link>
              </div>
            </div>

            {/* Risk Map */}
            <div className="dashboard-card">
              <div className="card-icon">◎</div>

              <div className="card-content">
                <h3>Risk Map</h3>

                <p>
                  Explore geographical risk predictions
                  and regional risk information.
                </p>

                <Link to="/risk-map" className="card-link">
                  Open Risk Map <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="dashboard-about">
          <div>
            <span className="section-label">ABOUT THE SYSTEM</span>

            <h2>Proactive road safety through AI</h2>
          </div>

          <p>
            RoadSense combines driving behaviour, traffic
            conditions, environmental factors, and location
            information to support proactive road risk
            assessment.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;