import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectionPage from './pages/selection-page';
import DashboardPage from './pages/dashboard-page';
import './index.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
