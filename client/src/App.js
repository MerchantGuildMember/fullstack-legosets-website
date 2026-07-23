import logo from './logo.svg';
import './App.css';
import "@fontsource/ubuntu";
import ContentPage from './pages/ContentPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import {ACCESS_LEVEL_GUEST, SERVER_HOST} from "./config/global_constants"

import { Route, Routes, BrowserRouter } from 'react-router-dom'
import {useEffect, useState} from "react";
import axios from "axios";

if(typeof localStorage.accessLevel === "undefined")
{
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = localStorage.token;
        return Boolean(token && token !== "null");
    });

    useEffect(() => {
        axios.get(`${SERVER_HOST}/users/verify`, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        })
            .then(res => setIsLoggedIn(res.data.isLoggedIn))
            .catch(err => {
                console.log(err);
                setIsLoggedIn(false);
            });
    }, []);


    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<ContentPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route exact path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route exact path="/product/:_id" element={<ProductPage isLoggedIn={isLoggedIn}/>}/>
                <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                <Route exact path="/register" element={<RegisterPage isLoggedIn={isLoggedIn}/>}/>
                <Route exact path="/cart" element={<CartPage isLoggedIn={isLoggedIn}/>}/>
                <Route exact path="/checkout" element={<CheckoutPage isLoggedIn={isLoggedIn}/>}/>
                <Route exact path="/order-confirmation" element={<OrderConfirmationPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}/>

                <Route exact path="/addProduct" element={<addProduct />}/>
                <Route exact path="/editProduct/:id" element={<editProduct />}/>
                <Route exact path="/deleteProduct/:id" element={<deleteProduct />}/>

                <Route exact path="*" element={<h3>Invalid URL.</h3>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;