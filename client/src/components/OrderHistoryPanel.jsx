import React from "react";
import { Package } from "lucide-react";

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatPrice(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function OrderHistoryPanel({ orders, loading, error, onClose }) {
    return (
        <div className="ac_panel">
            {loading && <div className="ac_orderStatus">Loading your orders&hellip;</div>}

            {!loading && error && (
                <div className="ac_orderStatus ac_orderStatusError">
                    Couldn&rsquo;t load your order history. Please try again later.
                </div>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="ac_orderStatus">You haven&rsquo;t placed any orders yet.</div>
            )}

            {!loading && !error && orders.length > 0 && (
                <div className="ac_orderList">
                    {orders.map((order) => {
                        const product = order.productID;
                        const productName =
                            (product && typeof product === "object" && (product.name || product.title)) ||
                            "Order item";

                        return (
                            <div className="ac_orderItem" key={order._id}>
                                <div className="ac_orderIcon">
                                    <Package size={18} strokeWidth={1.75} />
                                </div>
                                <div className="ac_orderDetails">
                                    <div className="ac_orderTopRow">
                                        <span className="ac_orderProduct">{productName}</span>
                                        <span className="ac_orderTotal">{formatPrice(order.total_price)}</span>
                                    </div>
                                    <div className="ac_orderMeta">
                                        <span>{formatDate(order.createdAt)}</span>
                                        <span>&middot;</span>
                                        <span>Qty {order.amount}</span>
                                    </div>
                                    <div className="ac_orderAddress">{order.address}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="ac_actions">
                <button type="button" className="ac_ghostButton" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}