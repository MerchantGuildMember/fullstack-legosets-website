import React from 'react';
import LoginForm from "../components/LoginForm";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants"
import { useNavigate } from "react-router-dom";

export default function LoginPage({ isLoggedIn, setIsLoggedIn, ...props }) {

    const [email, setEmail] = React.useState(props.email)
    const [password, setPassword] = React.useState(props.password)
    const navigate = useNavigate()
    const handleSubmit = e => {
        e.preventDefault()

        axios.post(`${SERVER_HOST}/users/login`, {email, password})
            .then(res =>
            {
                localStorage.name = res.data.name
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token
                setIsLoggedIn(true)
                navigate('/')
            })
            .catch(err => console.log(`${err.response.data}\n${err}`))
    }

    return (
        <div className="ac_loginPage">
            <div className="ac_loginDiv">
                {!isLoggedIn && (
                    <LoginForm
                        handleSubmit={handleSubmit}
                        setEmail={setEmail}
                        setPassword={setPassword}
                    />
                )}
            </div>
        </div>
    )
}
