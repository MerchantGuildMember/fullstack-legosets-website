import React from 'react'
import {Navigate} from "react-router-dom";

export default function LoggedInRoute({ component: Component, ...rest }) {

    const { user } = useAuth()
    const accessToken = user?.accessToken ?? null
    const needAuthentication = rest.needAuthentication

    if (!accessToken) return <Navigate to="/login" />
    if(needAuthentication && parseJWT(accessToken).isExpired) {
        return <Navigate to="/login" />
    }

    return Component
}