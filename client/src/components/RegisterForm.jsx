export default function RegisterForm({
                                         name, email, confirmEmail, password, confirmPassword,
                                         setName, setEmail, setConfirmEmail, setPassword, setConfirmPassword,
                                         handleSubmit, handleBlur, errors
                                     }) {
    return (
        <div className="registerDiv">
            <h1 className="registerHeading">Create an account</h1>

            <a href="/"> &lt;&lt; I've changed my mind, take me back &gt;&gt; </a>

            <form className="registerForm" onSubmit={handleSubmit} noValidate>
                <input
                    type="text" className={`name ${errors.name ? "inputError" : ""}`} placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name")}
                />
                {errors.name && <span className="fieldError">{errors.name}</span>}

                <input
                    type="email" className={`email ${errors.email ? "inputError" : ""}`} placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                />
                <input
                    type="email" className={`email ${errors.confirmEmail ? "inputError" : ""}`} placeholder="Confirm Email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    onBlur={() => handleBlur("confirmEmail")}
                />
                {(errors.email || errors.confirmEmail) &&
                    <span className="fieldError">{errors.email || errors.confirmEmail}</span>}

                <input
                    type="password" className={`password ${errors.password ? "inputError" : ""}`} placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                />
                <input
                    type="password" className={`password ${errors.confirmPassword ? "inputError" : ""}`} placeholder="Repeat Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                />
                {(errors.password || errors.confirmPassword) &&
                    <span className="fieldError">{errors.password || errors.confirmPassword}</span>}

                <input type="submit" value="Register"/>

                {errors.form && <span className="formError">{errors.form}</span>}
            </form>

            <a href="/login"> &lt;&lt; Login instead? &gt;&gt; </a>
        </div>
    )
}