import React, {useState} from 'react'
import { ChevronDown, Check, X, Eye, EyeOff, ImagePlus } from "lucide-react";

export default function SecurePanel({ kind, oldValue, onClose }) {
    const isPassword = kind === "password";
    const [value, setValue] = useState("");
    const [repeat, setRepeat] = useState("");
    const [reveal, setReveal] = useState(false);
    const [saved, setSaved] = useState(false);

    const filled = value.length > 0 && repeat.length > 0;
    const matches = filled && value === repeat;
    const changed = value.length > 0 && value !== oldValue;
    const canSave = matches && changed;

    const matchState = !filled ? "idle" : matches ? "match" : "mismatch";

    const handleSave = () => {
        if (!canSave) return;
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1100);
    };

    const label = isPassword ? "password" : "email";
    const inputType = isPassword ? (reveal ? "text" : "password") : "email";

    return (
        <div className="Panel">
            <div className="Field">
                <label className="FieldLabel">Current {label}</label>
                <div className="Static">
                    {isPassword ? "•".repeat(10) : oldValue}
                </div>
            </div>

            <div className="Field">
                <label className="FieldLabel">New {label}</label>
                <div className="InputWrap">
                    <input
                        className="Input"
                        type={inputType}
                        placeholder={isPassword ? "Enter new password" : "Enter new email"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="new-password"
                    />
                    {isPassword && (
                        <button
                            type="button"
                            className="Reveal"
                            onClick={() => setReveal((r) => !r)}
                            aria-label={reveal ? "Hide password" : "Show password"}
                        >
                            {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                </div>
            </div>

            <div className="Field">
                <label className="FieldLabel">Retype {label}</label>
                <div className="InputWrap">
                    <input
                        className={
                            "Input" +
                            (matchState === "mismatch" ? " inputMismatch" : "") +
                            (matchState === "match" ? " inputMatch" : "")
                        }
                        type={inputType}
                        placeholder={isPassword ? "Retype new password" : "Retype new email"}
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        autoComplete="new-password"
                    />
                    <span className={"MatchDot Match-" + matchState}>
            {matchState === "match" && <Check size={13} strokeWidth={3} />}
                        {matchState === "mismatch" && <X size={13} strokeWidth={3} />}
          </span>
                </div>
                <span className={"MatchText MatchText-" + matchState}>
          {matchState === "idle" && "Both entries must be identical."}
                    {matchState === "mismatch" && "Doesn't match yet."}
                    {matchState === "match" && "Matches."}
        </span>
            </div>

            <div className="Actions">
                <button type="button" className="GhostButton" onClick={onClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    className={"SecureButton" + (canSave ? " SecureButtonReady" : "") + (saved ? " SecureButtonSaved" : "")}
                    onClick={handleSave}
                    disabled={!canSave}
                >
                    {saved ? (
                        <>
                            <Check size={14} strokeWidth={2.5} /> Saved
                        </>
                    ) : (
                        `Update ${label}`
                    )}
                </button>
            </div>
        </div>
    );
}