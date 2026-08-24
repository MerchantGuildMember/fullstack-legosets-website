import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { SERVER_HOST } from '../config/global_constants';
import { getGuestId } from '../utils/guestID';

function getCheckoutHeaders() {
    if (localStorage.token && localStorage.token !== "null") {
        return { Authorization: `Bearer ${localStorage.token}` };
    }
    return { 'x-guest-id': getGuestId() };
}

function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutPage({ isLoggedIn, setIsLoggedIn }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [address, setAddress] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${SERVER_HOST}/cart`, { headers: getCheckoutHeaders() })
            .then(res => {
                if (res.data.items.length === 0) {
                    navigate('/cart');
                    return;
                }
                setCartItems(res.data.items);
                setLoading(false);
            })
            .catch(err => {
                console.log(`${err.response?.data}\n${err}`);
                setLoading(false);
            });
    }, [navigate]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!address.trim()) return setError('Please enter a delivery address.');
        if (!cardName.trim()) return setError('Please enter the name on the card.');
        if (cardNumber.replace(/\s/g, '').length !== 16) return setError('Card number must be 16 digits.');
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return setError('Expiry must be in MM/YY format.');
        if (!/^\d{3,4}$/.test(cvv)) return setError('CVV must be 3 or 4 digits.');

        setSubmitting(true);

        axios.post(`${SERVER_HOST}/checkout`, { address }, { headers: getCheckoutHeaders() })
            .then(res => {
                navigate('/order-confirmation', { state: { orders: res.data.orders, total: res.data.total, items: cartItems, address } });
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Something went wrong placing your order.');
                setSubmitting(false);
            });
    };

    return (
        <div className="ac_checkoutPage">
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div className="ac_checkoutContent">
                <h1 className="ac_checkoutHeading">Checkout</h1>

                {loading && <p className="ac_checkoutMessage">Loading...</p>}

                {!loading && (
                    <div className="ac_checkoutLayout">
                        <form className="ac_checkoutForm" onSubmit={handleSubmit}>
                            <h2>Delivery Address</h2>
                            <textarea
                                className="ac_checkoutAddress"
                                placeholder="Street, city, postcode, country"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                rows={3}
                            />

                            <h2>Payment Details</h2>

                            <label>
                                Name on card
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={e => setCardName(e.target.value)}
                                    placeholder="Jane Doe"
                                />
                            </label>

                            <label>
                                Card number
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="1234 5678 9012 3456"
                                    inputMode="numeric"
                                />
                            </label>

                            <div className="ac_checkoutCardRow">
                                <label>
                                    Expiry
                                    <input
                                        type="text"
                                        value={expiry}
                                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                                        placeholder="MM/YY"
                                        inputMode="numeric"
                                    />
                                </label>

                                <label>
                                    CVV
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="123"
                                        inputMode="numeric"
                                    />
                                </label>
                            </div>

                            {error && <p className="ac_checkoutError">{error}</p>}

                            <button className="ac_checkoutSubmit" type="submit" disabled={submitting}>
                                {submitting ? 'Placing order...' : `Pay €${total.toFixed(2)}`}
                            </button>
                        </form>

                        <div className="ac_checkoutSummary">
                            <h2>Order Summary</h2>
                            {cartItems.map(item => (
                                <div className="ac_checkoutSummaryItem" key={item.productId}>
                                    <span>{item.title} x{item.quantity}</span>
                                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="ac_checkoutSummaryTotal">
                                <span>Total</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}