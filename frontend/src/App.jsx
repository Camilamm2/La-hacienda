import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./pages/header";
import MilkProductionChart from "./pages/totals";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/totals" element={<MilkProductionChart />} />
      </Routes>
    </Router>
  );
}

export default App;
