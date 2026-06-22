export default function LoginForm() {
    return (
        <div className="loginDiv">
            <form className="loginForm">
                <input type="text" className="email" placeholder="Email" />
                <input type="password" className="password" placeholder="Password" />

                <input type="submit" value="Login" />
            </form>

            <a href="/register"> &lt;&lt; Don't have an account? &gt;&gt; </a>
        </div>
    )
}