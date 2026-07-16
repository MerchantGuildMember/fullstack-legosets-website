import React from 'react'
import { ChevronDown, Check, X, Eye, EyeOff, ImagePlus } from "lucide-react";

export default function Row({ label, current, isOpen, onToggle, secure }) {
    return (
        <button type="button" className="Row" onClick={onToggle} aria-expanded={isOpen}>
      <span className="RowText">
        <span className="RowLabel">{label}</span>
        <span className="RowCurrent">{current}</span>
      </span>
            <span className="RowRight">
                <ChevronDown className={"Chevron" + (isOpen ? " ChevronOpen" : "")} size={18} strokeWidth={2} />
      </span>
        </button>
    );
}