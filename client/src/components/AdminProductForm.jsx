import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const emptyForm = {
    name: '',
    brand: '',
    price: '',
    stock: '',
    pieceCount: '',
    description: '',
    images: ''
};

export default function AdminProductForm({ product, authHeaders, onSaved, onClose }) {
    const isEditing = Boolean(product);

    const [form, setForm] = useState(() => product ? {
        name: product.name || '',
        brand: product.brand || '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        pieceCount: product.pieceCount ?? '',
        description: product.description || '',
        images: (product.images || []).join(', ')
    } : emptyForm);

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.name.trim()) nextErrors.name = 'Name is required';
        if (!form.brand.trim()) nextErrors.brand = 'Brand is required';

        const price = parseFloat(form.price);
        if (Number.isNaN(price) || price < 0) nextErrors.price = 'Enter a valid price';

        const stock = parseInt(form.stock, 10);
        if (Number.isNaN(stock) || stock < 0) nextErrors.stock = 'Enter a valid stock count';

        const images = form.images.split(',').map(i => i.trim()).filter(Boolean);
        if (images.length === 0) nextErrors.images = 'Provide at least one image URL';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!validate()) return;

        setSubmitting(true);

        const payload = {
            name: form.name.trim(),
            brand: form.brand.trim(),
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            description: form.description.trim(),
            images: form.images.split(',').map(i => i.trim()).filter(Boolean)
        };

        if (form.pieceCount !== '') {
            payload.pieceCount = parseInt(form.pieceCount, 10);
        }

        const request = isEditing
            ? axios.put(`${SERVER_HOST}/product/${product._id}`, payload, authHeaders)
            : axios.post(`${SERVER_HOST}/product`, payload, authHeaders);

        request
            .then(res => onSaved(res.data))
            .catch(err => setFormError(err.response?.data?.message || 'Failed to save product'))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="ac_adminModalOverlay" onClick={onClose}>
            <form
                className="ac_adminModal"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h2>{isEditing ? 'Edit product' : 'Add product'}</h2>

                <label>
                    Name
                    <input
                        type="text"
                        className={errors.name ? 'ac_inputError' : ''}
                        value={form.name}
                        onChange={handleChange('name')}
                    />
                    {errors.name && <span className="ac_fieldError">{errors.name}</span>}
                </label>

                <label>
                    Brand
                    <input
                        type="text"
                        className={errors.brand ? 'ac_inputError' : ''}
                        value={form.brand}
                        onChange={handleChange('brand')}
                    />
                    {errors.brand && <span className="ac_fieldError">{errors.brand}</span>}
                </label>

                <div className="ac_adminFormRow">
                    <label>
                        Price (€)
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className={errors.price ? 'ac_inputError' : ''}
                            value={form.price}
                            onChange={handleChange('price')}
                        />
                        {errors.price && <span className="ac_fieldError">{errors.price}</span>}
                    </label>

                    <label>
                        Stock
                        <input
                            type="number"
                            min="0"
                            className={errors.stock ? 'ac_inputError' : ''}
                            value={form.stock}
                            onChange={handleChange('stock')}
                        />
                        {errors.stock && <span className="ac_fieldError">{errors.stock}</span>}
                    </label>

                    <label>
                        Piece count
                        <input
                            type="number"
                            min="0"
                            value={form.pieceCount}
                            onChange={handleChange('pieceCount')}
                        />
                    </label>
                </div>

                <label>
                    Description
                    <textarea
                        value={form.description}
                        onChange={handleChange('description')}
                    />
                </label>

                <label>
                    Image URLs (comma separated)
                    <input
                        type="text"
                        className={errors.images ? 'ac_inputError' : ''}
                        value={form.images}
                        onChange={handleChange('images')}
                        placeholder="https://example.com/set-front.jpg, https://example.com/set-back.jpg"
                    />
                    {errors.images && <span className="ac_fieldError">{errors.images}</span>}
                </label>

                {formError && <p className="ac_formError">{formError}</p>}

                <div className="ac_adminModalActions">
                    <button type="button" className="ac_adminGhostButton" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="ac_adminPrimaryButton" disabled={submitting}>
                        {submitting ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}