import React from 'react';
// import './App.css';
import './style/styles.css'

import RegistrationPage from './pages/registrationpage';
import LoginPage from './pages/loginpage';
// import Dashboard from './pages/userdashboard';
// import EcommerceDashboard from './pages/userdashboard';
import { Router, BrowserRouter,Route, Routes } from 'react-router-dom';
import ShopPage from './pages/shoppage';
// import CartPage from './pages/cartpage';
import UserDashboard from './pages/userdashboard';
import ProtectedRoute from './components/Protectedroutes';


function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/user/dashboard" element={
          <ProtectedRoute><UserDashboard/></ProtectedRoute>
         } />
        <Route path="/shop/:shopId" element={<ProtectedRoute>
          <ShopPage/>
        </ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
