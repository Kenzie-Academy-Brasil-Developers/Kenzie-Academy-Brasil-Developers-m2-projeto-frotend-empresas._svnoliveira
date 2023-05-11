import { handleHeader, renderUserPage } from "./render.js";

const isAdmin = localStorage.getItem("@Kenzie-Empresas: admin")
if(isAdmin == "yes"){
    location.replace("../pages/admin.html")
}

handleHeader()
renderUserPage()
