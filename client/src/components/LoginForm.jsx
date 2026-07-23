export default function LoginForm( {handleSubmit, setEmail, setPassword, isLoggedIn } ) {

    console.log(isLoggedIn)
    return (
        <div className="ac_loginDiv">
            <h1 className="ac_loginHeading">Welcome back</h1>

            <a href="/"> &lt;&lt; I've changed my mind, take me back &gt;&gt; </a>

            {isLoggedIn &&
                <form className="ac_loginForm ac_blur" onSubmit={handleSubmit}>
                    <input type="text" className="ac_email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" className="ac_password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="Login" />
                </form>
            }
            {!isLoggedIn &&
                <form className="ac_loginForm" onSubmit={handleSubmit}>
                    <input type="text" className="ac_email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" className="ac_password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="Login" />
                </form>
            }

            <a href="/register"> &lt;&lt; Don't have an account? &gt;&gt; </a>
        </div>
    )
}