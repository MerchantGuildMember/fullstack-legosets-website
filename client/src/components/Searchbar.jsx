import React, {useState} from 'react';
import { FaSearch } from "react-icons/fa";

export default function Searchbar({ search, setSearch }) {

    return (
        <div className="ac_searchbar">
            <div className="ac_searchInputWrapper">
                <FaSearch className="ac_searchIcon" size={18} />
                <input
                    className="ac_navSearchBar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
            </div>
        </div>
    );
}