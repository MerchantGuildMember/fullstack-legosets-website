import React from 'react'
import { ChevronDown, Check, X, Eye, EyeOff, ImagePlus } from "lucide-react";

export default function Row({ label, current, isOpen, onToggle, secure }) {
    return (
        <button type="button" className="ac_row" onClick={onToggle} aria-expanded={isOpen}>
      <span className="ac_rowText">
        <span className="ac_rowLabel">{label}</span>
        <span className="ac_rowCurrent">{current}</span>
      </span>
            <span className="ac_rowRight">
                <ChevronDown className={"ac_chevron" + (isOpen ? " ac_chevronOpen" : "")} size={18} strokeWidth={2} />
      </span>
        </button>
    );
}