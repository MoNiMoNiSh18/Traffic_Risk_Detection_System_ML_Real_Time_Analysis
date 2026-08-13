import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div>
      <Navbar />

      <main>
        <h1>Dashboard</h1>

        <p>
          Welcome to the Traffic Risk Detection System.
        </p>

        <p>
          Use the navigation above to view your location,
          predict traffic risk, or view previous predictions.
        </p>
      </main>
    </div>
  );
}

export default Dashboard;