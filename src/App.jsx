import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './landingPage/Landing';
import Login from './loginPage/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />  {/* Landing page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
      </Routes>
    </Router>
  );
};

export default App;