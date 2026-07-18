import React, { useState } from 'react';
import axios from 'axios';
import { getGuestId } from '../utils/guestID';

export default function BuyButton({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState('idle'); // idle | loading | added | error
    const [errorMessage, setErrorMessage] = useState('');

    const outOfStock = !product || product.stock <= 0;

    async function handleAddToCart() {
        if (outOfStock || status === 'loading') return;

        setStatus('loading');
        setErrorMessage('');

        const token = localStorage.getItem('token');
        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : { 'x-guest-id': getGuestId() };

        try {
            await axios.post(
                'http://localhost:5000/cart/add',
                { productId: product._id, quantity },
                { headers }
            );
            setStatus('added');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Could not add to cart');
        }
    }

    return (
        <div className="buyButtonWrapper">
            <div className="quantityControls">
                <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={outOfStock}
                >
                    −
                </button>
                <span>{quantity}</span>
                <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product?.stock ?? q, q + 1))}
                    disabled={outOfStock}
                >
                    +
                </button>
            </div>

            <button
                className="BuyButton"
                onClick={handleAddToCart}
                disabled={outOfStock || status === 'loading'}
            >
                {outOfStock
                    ? 'Out of stock'
                    : status === 'loading'
                        ? 'Adding...'
                        : status === 'added'
                            ? 'Added to Cart ✓'
                            : 'Add to Cart'}
            </button>

            {status === 'error' && (
                <p className="buyButtonError">{errorMessage}</p>
            )}
        </div>
    );
}