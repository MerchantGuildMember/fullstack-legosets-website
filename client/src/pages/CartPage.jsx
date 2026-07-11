import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import CartItem from '../components/CartItem';
import { SERVER_HOST } from '../config/global_constants';
import { getGuestId } from '../utils/guestID';

function getCartHeaders() {
    if (localStorage.token) {
        return { Authorization: `Bearer ${localStorage.token}` };
    }
    return { 'x-guest-id': getGuestId() };
}

export default function CartPage({ isLoggedIn, setIsLoggedIn }) {
    const [search, setSearch] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${SERVER_HOST}/cart`, { headers: getCartHeaders() })
            .then(res => {
                setCartItems(res.data.items);
                setLoading(false);
            })
            .catch(err => {
                console.log(`${err.response?.data}\n${err}`);
                setLoading(false);
            });
    }, []);

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;

        axios.put(`${SERVER_HOST}/cart/${productId}`, { quantity }, { headers: getCartHeaders() })
            .then(() => {
                setCartItems(prev =>
                    prev.map(item => item.productId === productId ? { ...item, quantity } : item)
                );
            })
            .catch(err => console.log(`${err.response?.data}\n${err}`));
    };

    const removeItem = (productId) => {
        axios.delete(`${SERVER_HOST}/cart/${productId}`, { headers: getCartHeaders() })
            .then(() => {
                setCartItems(prev => prev.filter(item => item.productId !== productId));
            })
            .catch(err => console.log(`${err.response?.data}\n${err}`));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="CartPage">
            <NavBar search={search} setSearch={setSearch} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div className="cartContent">
                <h1 className="cartHeading">Your Cart</h1>

                {loading && <p className="cartMessage">Loading cart...</p>}
                {!loading && cartItems.length === 0 && <p className="cartMessage">Your cart is empty.</p>}

                {!loading && cartItems.length > 0 && (
                    <>
                        <div className="cartList">
                            {cartItems.map(item => (
                                <CartItem key={item.productId} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
                            ))}
                        </div>
                        <div className="cartSummary">
                            <p className="cartTotal">Total: €{total.toFixed(2)}</p>
                            <button className="checkoutButton" onClick={() => navigate('/checkout')}>Checkout</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}