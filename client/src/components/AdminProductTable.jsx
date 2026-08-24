import React, { useState } from 'react';

export default function AdminProductTable({ products, onEdit, onDelete, onStockChange }) {
    const [stockDrafts, setStockDrafts] = useState({});

    if (products.length === 0) {
        return <p className="ac_adminStatus">No products yet. Add your first Lego set above.</p>;
    }

    const stockValue = (product) => {
        return stockDrafts[product._id] !== undefined ? stockDrafts[product._id] : product.stock;
    };

    const handleStockInput = (product, value) => {
        setStockDrafts(prev => ({ ...prev, [product._id]: value }));
    };

    const handleStockSave = (product) => {
        const parsed = parseInt(stockValue(product), 10);
        if (Number.isNaN(parsed) || parsed < 0) return;
        onStockChange(product, parsed);
        setStockDrafts(prev => {
            const next = { ...prev };
            delete next[product._id];
            return next;
        });
    };

    return (
        <table className="ac_adminTable">
            <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map(product => (
                <tr key={product._id}>
                    <td>
                        <img
                            className="ac_adminThumb"
                            src={product.images?.[0] || ''}
                            alt={product.name}
                        />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>€{Number(product.price).toFixed(2)}</td>
                    <td>
                        <div className="ac_adminStockCell">
                            <input
                                type="number"
                                min="0"
                                className="ac_adminStockInput"
                                value={stockValue(product)}
                                onChange={(e) => handleStockInput(product, e.target.value)}
                            />
                            <button
                                className="ac_adminSmallButton"
                                onClick={() => handleStockSave(product)}
                                disabled={stockDrafts[product._id] === undefined}
                            >
                                Save
                            </button>
                        </div>
                    </td>
                    <td>
                        <div className="ac_adminRowActions">
                            <button className="ac_adminSmallButton" onClick={() => onEdit(product)}>
                                Edit
                            </button>
                            <button className="ac_adminSmallButtonDanger" onClick={() => onDelete(product)}>
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}