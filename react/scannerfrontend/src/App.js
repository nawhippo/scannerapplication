import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import MedicationTable from './Pages/MedicationTable';
import TransactionTable from './Pages/TransactionTable';
import Scanner from './Pages/Scanner';
import { useUserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
function App() {
  const [userState, setUserState] = useState(null);
  const userContext = useUserContext();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/Scanner");

    }
  }, [navigate]);




  return (
    <div className="App">
      <canvas ref={canvasRef} />
      <Navbar bg="dark" expand="lg" text="light">
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/Transactions">Transactions</Nav.Link>
            {userContext && (
              <Nav.Link as={Link} to="/Scanner">Scanner</Nav.Link>
            )}
            <Nav.Link as={Link} to="/MedicationTable">Medication Table</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>





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