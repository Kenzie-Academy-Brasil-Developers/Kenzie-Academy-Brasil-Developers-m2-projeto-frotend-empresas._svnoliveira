import { handleModal } from "./modal.js";
import { renderAdminUsers, renderSelectCompany, handleHeader } from "./render.js";

const isAdmin = localStorage.getItem("@Kenzie-Empresas: admin")
if(isAdmin == "no"){
    location.replace("../pages/user.html")
} else if (!isAdmin){
    location.replace("../../index.html")
}

renderSelectCompany('#department__select')
handleHeader()
renderAdminUsers('default')
handleModal()
