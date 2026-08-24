import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

export default function AdminUserTable({ users, authHeaders, onDelete }) {
    const [expandedId, setExpandedId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersStatus, setOrdersStatus] = useState('idle');

    if (users.length === 0) {
        return <p className="ac_adminStatus">No users found.</p>;
    }

    const toggleExpand = (user) => {
        if (expandedId === user._id) {
            setExpandedId(null);
            return;
        }

        setExpandedId(user._id);
        setOrdersStatus('loading');
        axios.get(`${SERVER_HOST}/orders/user/${user._id}`, authHeaders)
            .then(res => {
                setOrders(res.data);
                setOrdersStatus('ready');
            })
            .catch(() => setOrdersStatus('error'));
    };

    return (
        <table className="ac_adminTable">
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Access level</th>
                <th>Purchase history</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <React.Fragment key={user._id}>
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.accessLevel}</td>
                        <td>
                            <button className="ac_adminSmallButton" onClick={() => toggleExpand(user)}>
                                {expandedId === user._id ? 'Hide' : 'View orders'}
                            </button>
                        </td>
                        <td>
                            <button className="ac_adminSmallButtonDanger" onClick={() => onDelete(user)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                    {expandedId === user._id && (
                        <tr>
                            <td colSpan={5}>
                                <div className="ac_adminOrderHistory">
                                    {ordersStatus === 'loading' && <p className="ac_adminStatus">Loading orders…</p>}
                                    {ordersStatus === 'error' && <p className="ac_adminStatus ac_adminStatusError">Could not load this user's orders.</p>}
                                    {ordersStatus === 'ready' && orders.length === 0 && (
                                        <p className="ac_adminStatus">No purchases yet.</p>
                                    )}
                                    {ordersStatus === 'ready' && orders.length > 0 && (
                                        <ul className="ac_adminOrderList">
                                            {orders.map(order => (
                                                <li key={order._id} className="ac_adminOrderRow">
                                                    <span>{order.productID?.name || 'Deleted product'}</span>
                                                    <span>× {order.amount}</span>
                                                    <span>€{Number(order.total_price).toFixed(2)}</span>
                                                    <span>{new Date(order.createdAt).toLocaleDateString()}{order.status === 'returned' ? ' (Returned)' : ''}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
            </tbody>
        </table>
    );
}