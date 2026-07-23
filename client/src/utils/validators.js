export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z][A-Za-z '-]*$/

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024

export function validateName(value) {
    const trimmed = value.trim()
    if (trimmed.length < 2) return "Name must be at least 2 characters."
    if (trimmed.length > 50) return "Name must be under 50 characters."
    if (!NAME_REGEX.test(trimmed)) return "Name can only contain letters, spaces, hyphens, and apostrophes."
    return null
}

export function validateEmail(value) {
    const trimmed = value.trim()
    if (!trimmed) return "Email is required."
    if (trimmed.length > 254) return "Email is too long."
    if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address."
    return null
}

export function validatePassword(value) {
    if (value.length < 8) return "Password must be at least 8 characters."
    if (value.length > 128) return "Password must be under 128 characters."
    if (/\s/.test(value)) return "Password cannot contain spaces."
    if (!/[A-Za-z]/.test(value)) return "Password must include at least one letter."
    if (!/[0-9]/.test(value)) return "Password must include at least one number."
    return null
}

export function validatePhotoFile(file) {
    if (!file.type || !file.type.startsWith("image/")) return "Please choose an image file."
    if (file.size > MAX_PHOTO_BYTES) return "Image must be smaller than 5MB."
    return null
}