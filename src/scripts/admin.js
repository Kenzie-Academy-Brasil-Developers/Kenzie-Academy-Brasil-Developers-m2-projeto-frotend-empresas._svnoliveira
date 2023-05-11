import { handleModal } from "./modal.js";
import { renderAdminUsers, renderSelectCompany, handleHeader } from "./render.js";


export const handleAdminSelect = async () => {
    renderSelectCompany('#department__select')
}
handleHeader()
handleAdminSelect()
renderAdminUsers('default')
handleModal()
