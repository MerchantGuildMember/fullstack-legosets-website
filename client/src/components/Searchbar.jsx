import React, {useState} from 'react';
import { FaSearch } from "react-icons/fa";

export default function Searchbar({ search, setSearch }) {

    return (
        <div className="Searchbar">
            <div className="searchInputWrapper">
                <FaSearch className="searchIcon" />
                <input
                    className="navSearchBar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
            </div>
        </div>
    );
}