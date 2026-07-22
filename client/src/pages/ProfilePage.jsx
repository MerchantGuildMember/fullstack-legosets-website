import React, {useState} from 'react';
import ProfileMenu from "../components/ProfileMenu";
import Row from "../components/Row";
import PhotoPanel from "../components/PhotoPanel";
import SecurePanel from "../components/SecurePanel";
import CasualTextPanel from "../components/CasualTextPanel";
import OrderHistoryPanel from "../components/OrderHistoryPanel";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants";
import NavBar from "../components/NavBar";
import {validateName, validateEmail, validatePassword} from "../utils/validators";

const authHeaders = () => ({
    headers: {Authorization: `Bearer ${localStorage.token}`}
});

const extractErrorMessage = (err, fallback) => {
    const data = err.response?.data;
    const looksLikeHtml = typeof data === "string" && /<\/?[a-z][\s\S]*>/i.test(data);
    const message = (data && typeof data === "object" && data.message)
        || (typeof data === "string" && !looksLikeHtml ? data : null)
        || fallback;
    return new Error(message);
};

export default function ProfilePage({ isLoggedIn, setIsLoggedIn }) {
    const [openKey, setOpenKey] = useState(null);

    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [photo, setPhoto] = React.useState("")

    const [orders, setOrders] = React.useState([])
    const [ordersLoading, setOrdersLoading] = React.useState(true)
    const [ordersError, setOrdersError] = React.useState(false)

    const getInfo = () => {
        axios.get(`${SERVER_HOST}/users/me`, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        })
            .then(res => {
                setName(res.data.name)
                setEmail(res.data.email)
                setPhoto(res.data.photo)
            })
            .catch(err => {
                console.log('GET /users/me failed:', err.response?.status, err.response?.data || err.message)
            })
    }

    const getOrders = () => {
        setOrdersLoading(true)
        setOrdersError(false)
        axios.get(`${SERVER_HOST}/orders/mine`, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        })
            .then(res => {
                setOrders(res.data || [])
            })
            .catch(err => {
                console.log('GET /orders/mine failed:', err.response?.status, err.response?.data || err.message)
                setOrdersError(true)
            })
            .finally(() => setOrdersLoading(false))
    }

    React.useEffect(() => {
        getInfo()
        getOrders()
    }, [])

    const saveName = (newName) =>
        axios.patch(`${SERVER_HOST}/users/me`, {name: newName}, authHeaders())
            .then(res => setName(res.data?.name ?? newName))
            .catch(err => { throw extractErrorMessage(err, "Couldn't update your name. Please try again.") })

    const saveEmail = (newEmail) =>
        axios.patch(`${SERVER_HOST}/users/me`, {email: newEmail}, authHeaders())
            .then(res => {
                setEmail(res.data?.email ?? newEmail)
                if (res.data?.token) localStorage.token = res.data.token
            })
            .catch(err => { throw extractErrorMessage(err, "Couldn't update your email. Please try again.") })

    const savePassword = (newPassword) =>
        axios.patch(`${SERVER_HOST}/users/me`, {password: newPassword}, authHeaders())
            .catch(err => { throw extractErrorMessage(err, "Couldn't update your password. Please try again.") })

    const savePhoto = (dataUrl) =>
        axios.patch(`${SERVER_HOST}/users/me`, {photo: dataUrl}, authHeaders())
            .then(res => setPhoto(res.data?.photo ?? dataUrl))
            .catch(err => { throw extractErrorMessage(err, "Couldn't update your photo. Please try again.") })

    const ordersLabel = ordersLoading
        ? "loading..."
        : ordersError
            ? "unavailable"
            : `${orders.length} order${orders.length === 1 ? "" : "s"}`;

    const FIELDS = [
        { key: "name", label: "Name", current: name || "guest", secure: false },
        { key: "email", label: "Email", current: email || "guest", secure: true },
        { key: "password", label: "Password", current: "set", secure: true },
        { key: "pfp", label: "Profile photo", current: photo || "default", secure: false },
        { key: "orders", label: "Order history", current: ordersLabel, secure: false },
    ];


    const toggle = (key) => setOpenKey((k) => (k === key ? null : key));
    const close = () => setOpenKey(null);

    return (
        <div className="ac_outerProfileWrapper">
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="ac_profilePage">
                <div className="ac_profilePageWrapper">
                    <h1 className="ac_greeting">
                        Hello, <span className="ac_greetingName">{name}</span>
                    </h1>

                    <div className="ac_profileMenu">
                        {FIELDS.map((f) => {
                            const isOpen = openKey === f.key;
                            return (

                                <div className="ac_entry" key={f.key}>
                                    <Row
                                        label={f.label}
                                        current={f.key === "password" ? "••••••••" : f.current}
                                        isOpen={isOpen}
                                        secure={f.secure}
                                        onToggle={() => toggle(f.key)}
                                    />
                                    <div className={"ac_outerPanel" + (isOpen ? " ac_outerPanelOpen" : "")}>
                                        <div className="ac_innerPanel">
                                            {isOpen && f.key === "name" && (
                                                <CasualTextPanel
                                                    oldValue={f.current}
                                                    fieldLabel="name"
                                                    placeholder="Enter new name"
                                                    onClose={close}
                                                    onSave={saveName}
                                                    validate={validateName}
                                                />
                                            )}
                                            {isOpen && f.key === "pfp" && (
                                                <PhotoPanel onClose={close} onSave={savePhoto} />
                                            )}
                                            {isOpen && (f.key === "email" || f.key === "password") && (
                                                <SecurePanel
                                                    kind={f.key}
                                                    oldValue={f.current}
                                                    onClose={close}
                                                    onSave={f.key === "email" ? saveEmail : savePassword}
                                                    validate={f.key === "email" ? validateEmail : validatePassword}
                                                />
                                            )}
                                            {isOpen && f.key === "orders" && (
                                                <OrderHistoryPanel
                                                    orders={orders}
                                                    loading={ordersLoading}
                                                    error={ordersError}
                                                    onClose={close}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}