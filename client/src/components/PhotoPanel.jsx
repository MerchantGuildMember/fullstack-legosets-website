import {useRef, useState} from "react";
import useCountdown from "./useCountdown";
import { Check, ImagePlus } from "lucide-react";
import { validatePhotoFile } from "../utils/validators";

export default function PhotoPanel({ onClose, onSave }) {
    const [preview, setPreview] = useState(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fileError, setFileError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const fileRef = useRef(null);
    const ready = !!preview && !fileError;
    const remaining = useCountdown(ready, 4);
    const canSave = ready && remaining <= 0 && !saving;
    const pct = ready ? ((4 - remaining) / 4) * 100 : 0;

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        e.target.value = ""; // allow re-selecting the same file after an error

        if (!f) return;

        const error = validatePhotoFile(f);
        if (error) {
            setFileError(error);
            setPreview(null);
            return;
        }

        setFileError("");
        setSubmitError("");
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.onerror = () => setFileError("Couldn't read that file. Please try another.");
        reader.readAsDataURL(f);
    };

    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        setSubmitError("");
        try {
            if (onSave) await onSave(preview);
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

    return (
        <div className="ac_panel">
            <div className="ac_photoRow">
                <div className="ac_field ac_photoCol">
                    <label className="ac_fieldLabel">Current photo</label>
                    <div className="ac_avatar ac_avatarOld">U</div>
                </div>

                <div className="ac_photoArrow">&rarr;</div>

                <div className="ac_field ac_photoCol">
                    <label className="ac_fieldLabel">New photo</label>
                    <button
                        type="button"
                        className="ac_avatar ac_avatarNew"
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

            {fileError && <span className="ac_fieldError">{fileError}</span>}
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
                "Save photo"
            )}
          </span>
                </button>
            </div>
        </div>
    );
}