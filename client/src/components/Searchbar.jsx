import React from 'react';
import { Search, X } from "lucide-react";

export default function Searchbar({ search, setSearch, isOpen, onToggle }) {

    return (
        <div className={`ac_searchbar${isOpen ? ' ac_searchbarOpen' : ''}`}>
            <button type="button" className="ac_searchToggle" onClick={onToggle} aria-label="Toggle search">
                {isOpen ? <X size={28} /> : <Search size={28} />}
            </button>
            <div className="ac_searchInputWrapper">
                <Search className="ac_searchIcon" size={18} />
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