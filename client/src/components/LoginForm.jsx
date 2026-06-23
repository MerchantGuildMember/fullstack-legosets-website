export default function LoginForm() {
    return (
        <div className="loginDiv">
            <a href="/client/public"> &lt;&lt; I've changed my mind, take me back &gt;&gt; </a>

            <form className="loginForm">
                <input type="text" className="email" placeholder="Email" />
                <input type="password" className="password" placeholder="Password" />

                <input type="submit" value="Login" />
            </form>

            <a href="/register"> &lt;&lt; Don't have an account? &gt;&gt; </a>
        </div>
    )
}