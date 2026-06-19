import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

ReactDOM.render(<App />, document.getElementById("root"))

window.addEventListener("load", function() {
    if("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service worker successfully registered"))
            .catch((error) => console.log(error))
    }
})

