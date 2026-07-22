import {useState} from "react";
import { Check } from "lucide-react";
import useCountdown from "./useCountdown";

export default function CasualTextPanel({ oldValue, fieldLabel, placeholder, onClose, onSave, validate }) {
    const [value, setValue] = useState("");
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const trimmed = value.trim();
    const validationError = trimmed.length > 0 && validate ? validate(trimmed) : null;
    const ready = trimmed.length > 0 && trimmed !== oldValue && !validationError;
    const remaining = useCountdown(ready, 4);
    const canSave = ready && remaining <= 0 && !saving;

    const handleChange = (e) => {
        setValue(e.target.value);
        if (submitError) setSubmitError("");
    };

    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        setSubmitError("");
        try {
            if (onSave) await onSave(trimmed);
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

    const pct = ready ? ((4 - remaining) / 4) * 100 : 0;

    return (
        <div className="ac_panel">
            <div className="ac_field">
                <label className="ac_fieldLabel">Current {fieldLabel}</label>
                <div className="ac_static">{oldValue}</div>
            </div>

            <div className="ac_field">
                <label className="ac_fieldLabel">New {fieldLabel}</label>
                <input
                    className={"ac_input" + (validationError ? " ac_inputError" : "")}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                />
                {validationError && <span className="ac_fieldError">{validationError}</span>}
            </div>

            {submitError && <div className="ac_formError">{submitError}</div>}

            <div className="ac_actions">
                <button type="button" className="ac_ghostButton" onClick={onClose}>
                    Cancel
                </button>

                <button
                    type="button"
                    className={"ac_ringButton" + (canSave ? " ac_ringButtonReady" : "") + (saved ? " ac_ringButtonSaved" : "")}
                    onClick={handleSave}
                    disabled={!canSave}
                >
                    <svg className="ac_ringSvg" viewBox="0 0 40 40">
                        <circle className="ac_ringTrack" cx="20" cy="20" r="17" />
                        {ready && !canSave && !saving && (
                            <circle
                                className="ac_ringProgress"
                                cx="20"
                                cy="20"
                                r="17"
                                strokeDasharray={2 * Math.PI * 17}
                                strokeDashoffset={2 * Math.PI * 17 * (1 - pct / 100)}
                            />
                        )}
                    </svg>
                    <span className="ac_ringButtonLabel">
            {saved ? (
                <>
                    <Check size={14} strokeWidth={2.5} /> Saved
                </>
            ) : saving ? (
                "Saving..."
            ) : ready && !canSave ? (
                `Confirming in ${remaining}s`
            ) : (
                `Save ${fieldLabel}`
            )}
          </span>
                </button>
            </div>
        </div>
    );
}