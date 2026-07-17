import {useRef, useState} from "react";
import useCountdown from "./useCountdown";
import { ChevronDown, Check, X, Eye, EyeOff, ImagePlus } from "lucide-react";

export default function PhotoPanel({ onClose }) {
    const [preview, setPreview] = useState(null);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef(null);
    const ready = !!preview;
    const remaining = useCountdown(ready, 4);
    const canSave = ready && remaining <= 0;
    const pct = ready ? ((4 - remaining) / 4) * 100 : 0;

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(f);
    };

    const handleSave = () => {
        if (!canSave) return;
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1100);
    };

    return (
        <div className="Panel">
            <div className="PhotoRow">
                <div className="Field PhotoCol">
                    <label className="FieldLabel">Current photo</label>
                    <div className="Avatar AvatarOld">U</div>
                </div>

                <div className="PhotoArrow">&rarr;</div>

                <div className="Field PhotoCol">
                    <label className="FieldLabel">New photo</label>
                    <button
                        type="button"
                        className="Avatar AvatarNew"
                        onClick={() => fileRef.current?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="New profile" />
                        ) : (
                            <ImagePlus size={18} strokeWidth={1.75} />
                        )}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
                </div>
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
                "Save photo"
            )}
          </span>
                </button>
            </div>
        </div>
    );
}