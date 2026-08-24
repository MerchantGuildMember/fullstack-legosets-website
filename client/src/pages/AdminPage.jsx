import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import AdminProductTable from '../components/AdminProductTable';
import AdminProductForm from '../components/AdminProductForm';
import AdminUserTable from '../components/AdminUserTable';
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from '../config/global_constants';

export default function AdminPage({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('products');

    const [products, setProducts] = useState([]);
    const [productsStatus, setProductsStatus] = useState('idle');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);

    const [users, setUsers] = useState([]);
    const [usersStatus, setUsersStatus] = useState('idle');

    const isAdmin = Number(localStorage.accessLevel) === ACCESS_LEVEL_ADMIN;

    const authHeaders = {
        headers: { Authorization: `Bearer ${localStorage.token}` }
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const loadProducts = useCallback(() => {
        setProductsStatus('loading');
        axios.get(`${SERVER_HOST}/products`, { params: { limit: 100 } })
            .then(res => {
                setProducts(res.data.products);
                setProductsStatus('ready');
            })
            .catch(() => setProductsStatus('error'));
    }, []);

    const loadUsers = useCallback(() => {
        setUsersStatus('loading');
        axios.get(`${SERVER_HOST}/users`, authHeaders)
            .then(res => {
                setUsers(res.data);
                setUsersStatus('ready');
            })
            .catch(() => setUsersStatus('error'));
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        if (tab === 'products') loadProducts();
        if (tab === 'users') loadUsers();
    }, [tab, isAdmin, loadProducts, loadUsers]);

    if (!isAdmin) return null;

    const handleCreateClick = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleDeleteProduct = (product) => {
        if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
        axios.delete(`${SERVER_HOST}/product/${product._id}`, authHeaders)
            .then(() => setProducts(prev => prev.filter(p => p._id !== product._id)))
            .catch(err => window.alert(err.response?.data?.message || 'Failed to delete product'));
    };

    const handleStockChange = (product, newStock) => {
        axios.put(`${SERVER_HOST}/product/${product._id}`, { stock: newStock }, authHeaders)
            .then(res => {
                setProducts(prev => prev.map(p => p._id === product._id ? res.data : p));
            })
            .catch(err => window.alert(err.response?.data?.message || 'Failed to update stock'));
    };

    const handleProductSaved = (savedProduct) => {
        setShowProductForm(false);
        setEditingProduct(null);
        if (editingProduct) {
            setProducts(prev => prev.map(p => p._id === savedProduct._id ? savedProduct : p));
        } else {
            setProducts(prev => [savedProduct, ...prev]);
        }
    };

    const handleDeleteUser = (user) => {
        if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
        axios.delete(`${SERVER_HOST}/user/${user._id}`, authHeaders)
            .then(() => setUsers(prev => prev.filter(u => u._id !== user._id)))
            .catch(err => window.alert(err.response?.data?.message || 'Failed to delete user'));
    };

    return (
        <div className="ac_adminPage">
            <NavBar
                search={search}
                setSearch={setSearch}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />
            <div className="ac_adminContent">
                <h1 className="ac_adminHeading">Admin Console</h1>

                <div className="ac_adminTabs">
                    <button
                        className={`ac_adminTab ${tab === 'products' ? 'ac_adminTabActive' : ''}`}
                        onClick={() => setTab('products')}
                    >
                        Products
                    </button>
                    <button
                        className={`ac_adminTab ${tab === 'users' ? 'ac_adminTabActive' : ''}`}
                        onClick={() => setTab('users')}
                    >
                        Users
                    </button>
                </div>

                {tab === 'products' && (
                    <div className="ac_adminPanel">
                        <div className="ac_adminPanelHeader">
                            <h2>Products</h2>
                            <button className="ac_adminPrimaryButton" onClick={handleCreateClick}>
                                Add product
                            </button>
                        </div>

                        {productsStatus === 'loading' && <p className="ac_adminStatus">Loading products…</p>}
                        {productsStatus === 'error' && <p className="ac_adminStatus ac_adminStatusError">Could not load products.</p>}
                        {productsStatus === 'ready' && (
                            <AdminProductTable
                                products={products}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteProduct}
                                onStockChange={handleStockChange}
                            />
                        )}
                    </div>
                )}

                {tab === 'users' && (
                    <div className="ac_adminPanel">
                        <div className="ac_adminPanelHeader">
                            <h2>Users</h2>
                        </div>

                        {usersStatus === 'loading' && <p className="ac_adminStatus">Loading users…</p>}
                        {usersStatus === 'error' && <p className="ac_adminStatus ac_adminStatusError">Could not load users.</p>}
                        {usersStatus === 'ready' && (
                            <AdminUserTable
                                users={users}
                                authHeaders={authHeaders}
                                onDelete={handleDeleteUser}
                            />
                        )}
                    </div>
                )}
            </div>

            {showProductForm && (
                <AdminProductForm
                    product={editingProduct}
                    authHeaders={authHeaders}
                    onSaved={handleProductSaved}
                    onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
                />
            )}
        </div>
    );
}