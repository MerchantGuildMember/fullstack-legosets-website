import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import Searchbar from "./Searchbar";
import { CircleUserRound, ShoppingCart, Menu, X } from "lucide-react";

export default function NavBar( {search, setSearch, setIsLoggedIn, ...rest } ) {

    const isLoggedIn = rest.isLoggedIn ?? false
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    const handleLogout = () => {
        delete localStorage.token
        delete localStorage.name
        delete localStorage.accessLevel
        setIsLoggedIn(false)
        navigate('/login')
    }

    return (
        <div className="ac_header">
            <button
                type="button"
                className="ac_menuToggle"
                onClick={() => setMenuOpen(open => !open)}
                aria-label="Toggle menu"
            >
                {menuOpen ? <X color="white" size={28} /> : <Menu color="white" size={28} />}
            </button>

            <div className={`ac_navOuter${menuOpen ? ' ac_navOuterOpen' : ''}`}>
                <div className="ac_navInner">
                    <ul className="ac_nav">
                        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                        <li className="ac_navMobileOnly"><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link></li>
                        <li className="ac_navMobileOnly"><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
                        {!isLoggedIn &&
                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link></li>
                        }
                        {isLoggedIn &&
                            <li><button className="ac_linkButton" onClick={() => { setMenuOpen(false); handleLogout(); }}>Log out</button></li>
                        }
                    </ul>
                </div>
            </div>

            <Searchbar
                search={search}
                setSearch={setSearch}
                isOpen={searchOpen}
                onToggle={() => setSearchOpen(open => !open)}
            />

            <div className="ac_rightIcons">
                <a className="ac_shoppingCart" href="/cart">
                    <ShoppingCart color="white" size={48} />
                </a>

                <a className="ac_profileHolder" href="/profile">
                    <CircleUserRound color="white" size={48} />
                </a>
            </div>
        </div>
    )
}
