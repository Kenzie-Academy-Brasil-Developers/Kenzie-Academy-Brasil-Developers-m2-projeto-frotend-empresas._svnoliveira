import { handleHeader, routeProtection } from "./render.js";
import { loginUser } from "./request.js";

const handleLogin = () => {
    routeProtection()

    const buttonList = document.querySelectorAll('form > button')
    const loginButton = buttonList[0]
    const registerButton = buttonList[1]
    
    loginButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const inputList = document.querySelectorAll('form > input')
        const email = inputList[0].value
        const password = inputList[1].value

        await loginUser(email, password)
    })

    registerButton.addEventListener('click', (event)=>{
        event.preventDefault()
        location.replace('./register.html')
    })
}

handleHeader()
handleLogin()