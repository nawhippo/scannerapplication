import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import MedicationTable from './Pages/MedicationTable';
import TransactionTable from './Pages/TransactionTable';
import Scanner from './Pages/Scanner';
import { useUserContext } from './UserContext';

function App() {
  const [userState, setUserState] = useState(null);
  const userContext = useUserContext();
  const url = "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/Scanner");
    }
  }, [navigate]);

  return (
    <div className="App">
      <nav className="navbar">
        <ul>
          <li className="nav-item">
            <Link className="nav-link" to="/Scanner">Scanner</Link>
          </li>
          {userContext && (
            <li className="nav-item">
              <Link className="nav-link" to="/MedicationTable">MedicationTable</Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/Transactions">Transactions</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">Orders</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/Scanner" element={<Scanner />} />
        <Route path="/MedicationTable" element={<MedicationTable />} />
        <Route path="/Transactions" element={<TransactionTable />} />
      </Routes>
    </div>
  );
}

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;