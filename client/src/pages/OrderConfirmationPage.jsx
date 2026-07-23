import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function OrderConfirmationPage({ isLoggedIn, setIsLoggedIn }) {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

    if (!state || !state.orders) {
        return (
            <div className="ac_confirmationPage">
                <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <div className="ac_confirmationContent">
                    <p className="ac_confirmationMessage">
                        We don't have an order to show here. If you just checked out, check your order history instead.
                    </p>
                    <button className="ac_confirmationContinue" onClick={() => navigate('/')}>
                        Back to shop
                    </button>
                </div>
            </div>
        );
    }

    const { orders, total, items = [], address } = state;
    const orderNumbers = orders.map(o => o._id.slice(-8).toUpperCase());

    return (
        <div className="ac_confirmationPage">
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div className="ac_confirmationContent">
                <div className="ac_confirmationBadge">✓</div>
                <h1 className="ac_confirmationHeading">Order placed</h1>
                <p className="ac_confirmationSubheading">
                    Thanks for your order — a confirmation has been recorded under
                    reference{orderNumbers.length > 1 ? 's' : ''}{' '}
                    <span className="ac_confirmationRef">{orderNumbers.join(', ')}</span>.
                </p>

                <div className="ac_confirmationSummary">
                    <h2>Order Summary</h2>
                    {items.map(item => (
                        <div className="ac_confirmationSummaryItem" key={item.productId}>
                            <span>{item.title} x{item.quantity}</span>
                            <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="ac_confirmationSummaryTotal">
                        <span>Total</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>

                    {address && (
                        <div className="ac_confirmationAddress">
                            <h2>Delivering to</h2>
                            <p>{address}</p>
                        </div>
                    )}
                </div>

                <button className="ac_confirmationContinue" onClick={() => navigate('/')}>
                    Continue shopping
                </button>
            </div>
        </div>
    );
}