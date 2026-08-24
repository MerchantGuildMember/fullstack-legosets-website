import RegisterForm from "../components/RegisterForm";
import {SERVER_HOST} from "../config/global_constants"
import axios from "axios"
import {useState, useEffect} from "react";
import {EMAIL_REGEX} from "../utils/validators";

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isRegistered, setIsRegistered] = useState(false)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const computeErrors = () => {
        const newErrors = {}

        if (touched.name && !name.trim()) {
            newErrors.name = "Name is required."
        }

        if (touched.email) {
            if (!email) {
                newErrors.email = "Email is required."
            } else if (!EMAIL_REGEX.test(email)) {
                newErrors.email = "Please enter a valid email address."
            }
        }

        if (touched.confirmEmail) {
            if (!confirmEmail) {
                newErrors.confirmEmail = "Please confirm your email."
            } else if (!EMAIL_REGEX.test(confirmEmail)) {
                newErrors.confirmEmail = "Please enter a valid email address."
            } else if (!newErrors.email && email !== confirmEmail) {
                newErrors.confirmEmail = "Emails do not match."
            }
        }

        if (touched.password) {
            if (!password) {
                newErrors.password = "Password is required."
            } else if (password.length < 8) {
                newErrors.password = "Password must be at least 8 characters."
            }
        }

        if (touched.confirmPassword) {
            if (!confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password."
            } else if (!newErrors.password && password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match."
            }
        }

        return newErrors
    }

    useEffect(() => {
        setErrors(prev => ({ ...computeErrors(), form: prev.form }))
    }, [name, email, confirmEmail, password, confirmPassword, touched])

    const validateAll = () => {
        setTouched({ name: true, email: true, confirmEmail: true, password: true, confirmPassword: true })
        const newErrors = computeErrors()
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateAll()) return

        axios.post(`${SERVER_HOST}/users/register`, {name, email, password})
            .then(res => {
                localStorage.name = res.data.name
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token

                setIsRegistered(true)
            })
            .catch(err => {
                const message = err.response?.data?.message || err.response?.data || "Registration failed. Please try again."
                setErrors(prev => ({ ...prev, form: message }))
            })
    }

    return (
        <div className="ac_registerPage">
            <div className="ac_registerDiv">
                {isRegistered ? (
                    <div className="ac_registerSuccess">
                        <h1 className="ac_registerHeading">You're all set!</h1>
                        <p>Your account has been created successfully.</p>
                        <a href="/">&lt;&lt; Continue &gt;&gt;</a>
                    </div>
                ) : (
                    <RegisterForm
                        name={name}
                        email={email}
                        confirmEmail={confirmEmail}
                        password={password}
                        confirmPassword={confirmPassword}
                        setName={setName}
                        setEmail={setEmail}
                        setConfirmEmail={setConfirmEmail}
                        setPassword={setPassword}
                        setConfirmPassword={setConfirmPassword}
                        handleSubmit={handleSubmit}
                        handleBlur={handleBlur}
                        errors={errors}
                    />
                )}
            </div>
        </div>
    )
}