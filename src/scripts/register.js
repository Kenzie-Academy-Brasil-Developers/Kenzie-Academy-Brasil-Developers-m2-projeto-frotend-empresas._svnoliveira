import { registerNewUser, toast } from "./request.js";
import { handleHeader, routeProtection } from "./render.js";


const handleRegistration = () => {
    routeProtection()

    const inputs = document.querySelectorAll('input')
    const button = document.querySelectorAll('form > button')

    
    const registerButton = button[0]
    const returnButton = button[1]
    
    registerButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const name = inputs[0].value
        const email = inputs[1].value
        const password = inputs[2].value

        if (name === '' || email === '' || password === ''){
            toast('red', 'Não deixe campos em branco');
        } else {
            const message = await registerNewUser(name, email, password);
            console.log(message);
        }
    })

    returnButton.addEventListener('click', (event) => {
        event.preventDefault()
        location.replace('../../index.html')
    })
}

handleRegistration()
handleHeader()
