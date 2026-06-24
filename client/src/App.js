import logo from './logo.svg';
import './App.css';
import "@fontsource/ubuntu";
import ContentPage from './pages/ContentPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"

import { Route, Routes, BrowserRouter } from 'react-router-dom'
import {useState} from "react";

if(typeof localStorage.accessLevel === "undefined")
{
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
}

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<ContentPage />}/>
            <Route exact path="/profile" element={<ProfilePage />}/>
            <Route exact path="/product/:_id" element={<ProductPage />}/>
            <Route exact path="/login" element={<LoginPage />}/>
            <Route exact path="/register" element={<RegisterPage />}/>

            <Route exact path="*" element={<h3>Invalid URL.</h3>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
