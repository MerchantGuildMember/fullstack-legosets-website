export default function LoginForm( {handleSubmit, setEmail, setPassword, isLoggedIn } ) {

    console.log(isLoggedIn)
    return (
        <div className="loginDiv">
            <h1 className="loginHeading">Welcome back</h1>

            <a href="/"> &lt;&lt; I've changed my mind, take me back &gt;&gt; </a>

            {isLoggedIn &&
                <form className="loginForm blur" onSubmit={handleSubmit}>
                    <input type="text" className="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" className="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="Login" />
                </form>
            }
            {!isLoggedIn &&
                <form className="loginForm" onSubmit={handleSubmit}>
                    <input type="text" className="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" className="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="Login" />
                </form>
            }

            <a href="/register"> &lt;&lt; Don't have an account? &gt;&gt; </a>
        </div>
    )
}