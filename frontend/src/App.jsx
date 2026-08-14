import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Location from "./pages/Location";
import Prediction from "./pages/Prediction";
import History from "./pages/History";
import RiskMap from "./pages/RiskMap";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/location" element={<Location />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/history" element={<History />} />
        <Route path="/risk-map" element={<RiskMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;