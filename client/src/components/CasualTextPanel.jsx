import {useState} from "react";
import useCountdown from "./useCountdown";

export default function CasualTextPanel({ oldValue, fieldLabel, placeholder, onClose }) {
    const [value, setValue] = useState("");
    const [saved, setSaved] = useState(false);
    const ready = value.trim().length > 0 && value.trim() !== oldValue;
    const remaining = useCountdown(ready, 4);
    const canSave = ready && remaining <= 0;

    const handleSave = () => {
        if (!canSave) return;
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1100);
    };

    const pct = ready ? ((4 - remaining) / 4) * 100 : 0;

    return (
        <div className="Panel">
            <div className="Field">
                <label className="FieldLabel">Current {fieldLabel}</label>
                <div className="Static">{oldValue}</div>
            </div>

            <div className="Field">
                <label className="FieldLabel">New {fieldLabel}</label>
                <input
                    className="Input"
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <div className="Actions">
                <button type="button" className="GhostButton" onClick={onClose}>
                    Cancel
                </button>

                <button
                    type="button"
                    className={"RingButton" + (canSave ? " RingButtonReady" : "") + (saved ? " RingButtonSaved" : "")}
                    onClick={handleSave}
                    disabled={!canSave}
                >
                    <svg className="RingSVG" viewBox="0 0 40 40">
                        <circle className="RingTrack" cx="20" cy="20" r="17" />
                        {ready && !canSave && (
                            <circle
                                className="RingProgress"
                                cx="20"
                                cy="20"
                                r="17"
                                strokeDasharray={2 * Math.PI * 17}
                                strokeDashoffset={2 * Math.PI * 17 * (1 - pct / 100)}
                            />
                        )}
                    </svg>
                    <span className="RingButtonLabel">
            {saved ? (
                <>
                    <Check size={14} strokeWidth={2.5} /> Saved
                </>
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