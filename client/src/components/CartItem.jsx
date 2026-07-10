import React from 'react';

export default function CartItem({ item, updateQuantity, removeItem }) {
    return (
        <div className="CartItem">
            <img src={item.image} alt={item.title} />

            <div className="cartItemInfo">
                <p className="cartItemTitle">{item.title}</p>
                <p className="cartItemPrice">€{item.price.toFixed(2)}</p>

                <div className="quantityControls">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>

                <button className="removeButton" onClick={() => removeItem(item.productId)}>
                    Remove
                </button>
            </div>
        </div>
    );
}