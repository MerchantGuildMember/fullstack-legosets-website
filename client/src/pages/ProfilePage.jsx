import React, {useState} from 'react';
import ProfileMenu from "../components/ProfileMenu";
import Row from "../components/Row";
import PhotoPanel from "../components/PhotoPanel";
import SecurePanel from "../components/SecurePanel";
import CasualTextPanel from "../components/CasualTextPanel";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants";

export default function ProfilePage() {
    const [openKey, setOpenKey] = useState(null);

    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [photo, setPhoto] = React.useState("")

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

    React.useEffect(() => {
        getInfo()
    }, [])

    const FIELDS = [
        { key: "name", label: "Name", current: name || "guest", secure: false },
        { key: "email", label: "Email", current: email || "guest", secure: true },
        { key: "password", label: "Password", current: "set", secure: true },
        { key: "pfp", label: "Profile photo", current: photo || "default", secure: false },
    ];


    const toggle = (key) => setOpenKey((k) => (k === key ? null : key));
    const close = () => setOpenKey(null);

    return (
        <div className="ProfilePage">
            <div className="ProfilePageWrapper">
                <h1 className="Greeting">
                    Hello, <span className="GreetingName">{name}</span>
                </h1>

                <div className="ProfileMenu">
                    {FIELDS.map((f) => {
                        const isOpen = openKey === f.key;
                        return (
                            <div className="entry" key={f.key}>
                                <Row
                                    label={f.label}
                                    current={f.key === "password" ? "••••••••" : f.current}
                                    isOpen={isOpen}
                                    secure={f.secure}
                                    onToggle={() => toggle(f.key)}
                                />
                                <div className={"OuterPanel" + (isOpen ? " OuterPanelOpen" : "")}>
                                    <div className="InnerPanel">
                                        {isOpen && f.key === "name" && (
                                            <CasualTextPanel
                                                oldValue={f.current}
                                                fieldLabel="name"
                                                placeholder="Enter new name"
                                                onClose={close}
                                            />
                                        )}
                                        {isOpen && f.key === "pfp" && <PhotoPanel onClose={close} />}
                                        {isOpen && (f.key === "email" || f.key === "password") && (
                                            <SecurePanel kind={f.key} oldValue={f.current} onClose={close} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


