import React from 'react';
// import './App.css';

import RegistrationPage from './components/registrationpage';
import LoginPage from './components/loginpage';
import Dashboard from './components/userdashboard';
import EcommerceDashboard from './components/userdashboard';
import { Router, BrowserRouter,Route, Routes } from 'react-router-dom';


function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<EcommerceDashboard />} />
        {/* <Route path="/shop/:id" element={<ShopPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
