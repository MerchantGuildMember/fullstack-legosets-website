import React, { useState } from 'react';
import axios from 'axios';
import { getGuestId } from '../utils/guestID';

export default function BuyButton({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const outOfStock = !product || product.stock <= 0;

    async function handleAddToCart() {
        if (outOfStock || status === 'loading') return;

        setStatus('loading');
        setErrorMessage('');

        const token = localStorage.getItem('token');
        const headers = token && token !== 'null'
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
        <div className="ac_buyButtonWrapper">
            <div className="ac_quantityControls">
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
                className="ac_buyButton"
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
                <p className="ac_buyButtonError">{errorMessage}</p>
            )}
        </div>
    );
}