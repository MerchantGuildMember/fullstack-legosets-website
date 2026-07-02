export default function RegisterForm() {
    return (
        <div className="registerDiv">
            <h1 className="registerHeading">Create an account</h1>

            <a href="/"> &lt;&lt; I've changed my mind, take me back &gt;&gt; </a>

            <form className="registerForm">
                <input type="text" className="email" placeholder="Email" />
                <input type="text" className="email" placeholder="Confirm Email" />
                <input type="password" className="password" placeholder="Password" />
                <input type="password" className="password" placeholder="Repeat Password" />

                <input type="submit" value="Register" />
            </form>

            <a href="/login"> &lt;&lt; Login instead? &gt;&gt; </a>
        </div>
    )
}