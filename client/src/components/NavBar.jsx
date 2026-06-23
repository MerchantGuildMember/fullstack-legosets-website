import React from 'react'
import {Link} from "react-router-dom";

export default function NavBar() {
    return(
        <div className="Header">
            <ul className="nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
            <div className="profileHolder">
                <div className="miniPicture">

                </div>
                <div className="chevron"></div>
            </div>
        </div>

    )
}
