import React, {useState} from 'react'
import { Check, X, Eye, EyeOff } from "lucide-react";

export default function SecurePanel({ kind, oldValue, onClose, onSave, validate }) {
    const isPassword = kind === "password";
    const [value, setValue] = useState("");
    const [repeat, setRepeat] = useState("");
    const [reveal, setReveal] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validationError = value.length > 0 && validate ? validate(value) : null;
    const filled = value.length > 0 && repeat.length > 0;
    const matches = filled && value === repeat;
    const changed = value.length > 0 && value !== oldValue;
    const canSave = matches && changed && !validationError && !saving;

    const matchState = !filled ? "idle" : matches ? "match" : "mismatch";
    const matchDotClass = matchState === "match" ? "ac_matchMatch" : matchState === "mismatch" ? "ac_matchMismatch" : "";
    const matchTextClass = matchState === "match" ? "ac_matchTextMatch" : matchState === "mismatch" ? "ac_matchTextMismatch" : "";

    const handleValueChange = (e) => {
        setValue(e.target.value);
        if (submitError) setSubmitError("");
    };

    const handleRepeatChange = (e) => {
        setRepeat(e.target.value);
        if (submitError) setSubmitError("");
    };

    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        setSubmitError("");
        try {
            if (onSave) await onSave(value);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 1100);
        } catch (err) {
            setSubmitError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const label = isPassword ? "password" : "email";
    const inputType = isPassword ? (reveal ? "text" : "password") : "email";

    return (
        <div className="ac_panel">
            <div className="ac_field">
                <label className="ac_fieldLabel">Current {label}</label>
                <div className="ac_static">
                    {isPassword ? "•".repeat(10) : oldValue}
                </div>
            </div>

            <div className="ac_field">
                <label className="ac_fieldLabel">New {label}</label>
                <div className="ac_inputWrap">
                    <input
                        className={"ac_input" + (validationError ? " ac_inputError" : "")}
                        type={inputType}
                        placeholder={isPassword ? "Enter new password" : "Enter new email"}
                        value={value}
                        onChange={handleValueChange}
                        autoComplete="new-password"
                    />
                    {isPassword && (
                        <button
                            type="button"
                            className="ac_reveal"
                            onClick={() => setReveal((r) => !r)}
                            aria-label={reveal ? "Hide password" : "Show password"}
                        >
                            {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                </div>
                {validationError && <span className="ac_fieldError">{validationError}</span>}
            </div>

            <div className="ac_field">
                <label className="ac_fieldLabel">Retype {label}</label>
                <div className="ac_inputWrap">
                    <input
                        className={
                            "ac_input" +
                            (matchState === "mismatch" ? " ac_inputMismatch" : "") +
                            (matchState === "match" ? " ac_inputMatch" : "")
                        }
                        type={inputType}
                        placeholder={isPassword ? "Retype new password" : "Retype new email"}
                        value={repeat}
                        onChange={handleRepeatChange}
                        autoComplete="new-password"
                    />
                    <span className={"ac_matchDot " + matchDotClass}>
            {matchState === "match" && <Check size={13} strokeWidth={3} />}
                        {matchState === "mismatch" && <X size={13} strokeWidth={3} />}
          </span>
                </div>
                <span className={"ac_matchText " + matchTextClass}>
          {matchState === "idle" && "Both entries must be identical."}
                    {matchState === "mismatch" && "Doesn't match yet."}
                    {matchState === "match" && "Matches."}
        </span>
            </div>

            {submitError && <div className="ac_formError">{submitError}</div>}

            <div className="ac_actions">
                <button type="button" className="ac_ghostButton" onClick={onClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    className={"ac_secureButton" + (canSave ? " ac_secureButtonReady" : "") + (saved ? " ac_secureButtonSaved" : "")}
                    onClick={handleSave}
                    disabled={!canSave}
                >
                    {saved ? (
                        <>
                            <Check size={14} strokeWidth={2.5} /> Saved
                        </>
                    ) : saving ? (
                        "Updating..."
                    ) : (
                        `Update ${label}`
                    )}
                </button>
            </div>
        </div>
    );
}