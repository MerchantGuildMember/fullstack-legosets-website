export default function RegisterForm({
                                         name, email, confirmEmail, password, confirmPassword,
                                         setName, setEmail, setConfirmEmail, setPassword, setConfirmPassword,
                                         handleSubmit, handleBlur, errors
                                     }) {
    return (
        <div className="ac_registerDiv">
            <h1 className="ac_registerHeading">Create an account</h1>

            <a href="/"> &lt;&lt; I've changed my mind, take me back &gt;&gt; </a>

            <form className="ac_registerForm" onSubmit={handleSubmit} noValidate>
                <input
                    type="text" className={`ac_name ${errors.name ? "ac_inputError" : ""}`} placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name")}
                />
                {errors.name && <span className="ac_fieldError">{errors.name}</span>}

                <input
                    type="email" className={`ac_email ${errors.email ? "ac_inputError" : ""}`} placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                />
                <input
                    type="email" className={`ac_email ${errors.confirmEmail ? "ac_inputError" : ""}`} placeholder="Confirm Email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    onBlur={() => handleBlur("confirmEmail")}
                />
                {(errors.email || errors.confirmEmail) &&
                    <span className="ac_fieldError">{errors.email || errors.confirmEmail}</span>}

                <input
                    type="password" className={`ac_password ${errors.password ? "ac_inputError" : ""}`} placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                />
                <input
                    type="password" className={`ac_password ${errors.confirmPassword ? "ac_inputError" : ""}`} placeholder="Repeat Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                />
                {(errors.password || errors.confirmPassword) &&
                    <span className="ac_fieldError">{errors.password || errors.confirmPassword}</span>}

                <input type="submit" value="Register"/>

                {errors.form && <span className="ac_formError">{errors.form}</span>}
            </form>

            <a href="/login"> &lt;&lt; Login instead? &gt;&gt; </a>
        </div>
    )
}