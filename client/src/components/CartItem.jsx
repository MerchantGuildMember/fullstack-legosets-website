import React from 'react';

export default function CartItem({ item, updateQuantity, removeItem }) {
    return (
        <div className="ac_cartItem">
            <img src={item.image} alt={item.title} />

            <div className="ac_cartItemInfo">
                <p className="ac_cartItemTitle">{item.title}</p>
                <p className="ac_cartItemPrice">€{item.price.toFixed(2)}</p>

                <div className="ac_quantityControls">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>

                <button className="ac_removeButton" onClick={() => removeItem(item.productId)}>
                    Remove
                </button>
            </div>
        </div>
    );
}