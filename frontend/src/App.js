import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SymptomChecker from "./SymptomChecker";
import LoginSignup from "./LoginSignup";
import MedicinePage from "./MedicinePage";
import PreventiveCare from "./PreventiveCare";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Placeholder for Symptom Checker page */}
        <Route path="/symptom-checker" element={<SymptomChecker/>} />
        <Route path="/login" element={<LoginSignup/>}/>
        <Route path="/medicine/:name" element={<MedicinePage/>}/>
        <Route path="/preventive" element={<PreventiveCare/>}/>
      </Routes>
    </Router>
  );
}

export default App;