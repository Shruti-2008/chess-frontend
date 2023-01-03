import React from 'react';
import Referee from './components/Referee';
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Home from './components/Home';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route element={<Navbar />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="game" element={<Referee />} />
            </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;