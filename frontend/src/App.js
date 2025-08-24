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
import CartPage from './pages/cartpage';
import ProfilePage from './pages/profilepage';
import { Toaster } from 'react-hot-toast';
import OrderHistoryPage from './pages/userhistory';
import ShopOwnerDashboard from './pages/shopdashboard';
import OrderCard from './components/ordercard';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/admindashboard';
import PasswordUpdatePage from './pages/updatepasswordpage';


function App() {
  

  return (
     <BrowserRouter>
     <Toaster position='top-right'/>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/user/dashboard" element={
          <ProtectedRoute><UserDashboard/></ProtectedRoute>
         } />
        <Route path="/shop/:shopId" element={<ProtectedRoute>
          <ShopPage/>
        </ProtectedRoute>}/>

        <Route path="/cart" element={<ProtectedRoute>
          <CartPage/>
        </ProtectedRoute>}/>
          
           <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
           <Route path='/orders' element={<ProtectedRoute><OrderHistoryPage/></ProtectedRoute>}/>
           <Route path="/shopdashboard" element={<ProtectedRoute><ShopOwnerDashboard/></ProtectedRoute>}/>
           
         <Route path="/admindashboard" element={<AdminDashboard />} />   

         <Route path='/reset-password' element={<PasswordUpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
