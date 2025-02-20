import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import NewsletterDetail from "./pages/NewsletterDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/newsletter/:id" element={<NewsletterDetail />} />
        {/* Redirect any unknown routes to the dashboard */}
        <Route path="" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
