export default function RegisterForm() {
    return (
        <div className="registerDiv">
            <form className="registerForm">
                <input type="text" className="email" placeholder="Email" />
                <input type="text" className="email" placeholder="Confirm Email" />
                <input type="password" className="password" placeholder="Password" />
                <input type="password" className="password" placeholder="Repeat Password" />

                <input type="submit" value="Login" />
            </form>

            <a href="/login"> &lt;&lt; Login instead? &gt;&gt; </a>
        </div>
    )
}