import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import Searchbar from "./Searchbar";
import { MdAccountCircle, MdOutlineShoppingCart } from "react-icons/md";

export default function NavBar( {search, setSearch, setIsLoggedIn, ...rest } ) {

    const isLoggedIn = rest.isLoggedIn ?? false
    const navigate = useNavigate()

    const handleLogout = () => {
        delete localStorage.token
        delete localStorage.name
        delete localStorage.accessLevel
        setIsLoggedIn(false)
        navigate('/login')
    }

    return (
        <div className="ac_header">
            <ul className="ac_nav">
                <li><Link to="/">Home</Link></li>
                {!isLoggedIn &&
                    <li><Link to="/login">Log in</Link></li>
                }
                {isLoggedIn &&
                    <li><button className="ac_linkButton" onClick={handleLogout}>Log out</button></li>
                }
            </ul>
            <Searchbar
                search={search}
                setSearch={setSearch}
            />
            <div className="ac_rightIcons">
                <a className="ac_shoppingCart" href="/cart">
                    <MdOutlineShoppingCart color="white" size={48} />
                </a>

                <a className="ac_profileHolder" href="/profile">
                    <MdAccountCircle color="white" size={48} />
                </a>
            </div>
        </div>
    )
}
