import { 
    toast, 
    renderAdminDepartments,
    renderSelectCompany, 
    renderDeleteDepartmentModal,
    renderEditDepartmentModal,
    renderViewDepartmentModal,
    renderDeleteUserModal,
    renderEditUserModal } from "./render.js"
import { createNewDepartment, fireUser } from "./request.js"

export const handleCreateDepartmentButton = () => {
    const controller = document.querySelector('#modal__container--department-create__controller')
    const closeButton = document.querySelector('#modal__container--department-create > .modal__header > button')
    const createButton = document.querySelector('#admin__header > button')
    const submitButton = document.querySelector('#modal__container--department-create > form > button')

    createButton.addEventListener('click', () => {
        renderSelectCompany('#company-select')
        controller.showModal()
    })
    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        controller.close()
    })
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault()

        const inputList = document.querySelectorAll('#modal__container--department-create > form > input')
        const departmentName = inputList[0].value
        const departmentDescription = inputList[1].value
        const companySelect = document.querySelector('#modal__container--department-create > form > select')
        const companyID = companySelect.value
        if (   departmentName.trim() === '' || 
        departmentDescription.trim() === '' ||
        companyID === 'default'){
            toast('red', 'Há campos não Preenchidos')
            return
        } else {
            const atemptCreation = await createNewDepartment(departmentName, departmentDescription, companyID)
            console.log(atemptCreation)
            if (atemptCreation){
                controller.close()
                const currentDepartments = document.querySelector('#department__select').value
                await renderAdminDepartments(currentDepartments)
            }
        }
    })
}

export const handleDepartmentViewButtons = () => {
    const buttonList = document.querySelectorAll('.department__card > .button-container > .eye')
    const viewController = document.querySelector('#modal__container--department-visualize__controller')

    buttonList.forEach(button => {
        const departmentID = button.dataset.departmentID
        button.addEventListener('click', async ()=> {
            await renderViewDepartmentModal(departmentID)
            viewController.showModal()
        })
    });
}

export const handleDepartmentEditButtons = () => {
    const buttonList = document.querySelectorAll('.department__card > .button-container > .pen')
    const editController = document.querySelector('#modal__container--department-edit__controller')
    const submitButton = document.querySelector('#modal__container--department-edit > form > button')

    buttonList.forEach(button => {
        const departmentID = button.dataset.departmentID
        button.addEventListener('click', async ()=> {
            submitButton.dataset.departmentID = departmentID
            await renderEditDepartmentModal()
            editController.showModal()
        })
    });
}

export const handleUserEditButtons = () => {
    const buttonList = document.querySelectorAll('.user__card > .button-container > .pen')
    const editController = document.querySelector('#modal__container--user-edit__controller')
    const submitButton = document.querySelector('#modal__container--user-edit > form > button')

    buttonList.forEach(button => {
        const userID = button.dataset.userID
        button.addEventListener('click', async ()=> {
            submitButton.dataset.userID = userID
            await renderEditUserModal()
            editController.showModal()
        })
    });
}

export const handleDepartmentDeleteButtons = () => {
    const buttonList = document.querySelectorAll('.department__card > .button-container > .bin')
    const deleteController = document.querySelector('#modal__container--department-delete__controller')
    const removeButton = document.querySelector('#modal__container--department-delete > button')

    buttonList.forEach(button => {
        const departmentID = button.dataset.departmentID
        button.addEventListener('click', async ()=> {
            removeButton.dataset.departmentID = departmentID
            await renderDeleteDepartmentModal()
            deleteController.showModal()
        })
    });
}

export const handleUserDeleteButtons = () => {
    const buttonList = document.querySelectorAll('.user__card > .button-container > .bin')
    const deleteController = document.querySelector('#modal__container--user-delete__controller')
    const removeButton = document.querySelector('#modal__container--user-delete > button')

    buttonList.forEach(button => {
        const userID = button.dataset.userID
        button.addEventListener('click', async ()=> {
            removeButton.dataset.userID = userID
            await renderDeleteUserModal()
            deleteController.showModal()
        })
    });
}

export const handleFireButton = () => {
    const buttonList = document.querySelectorAll('#users__card-list > li > button')
    buttonList.forEach(button => {
        const userID = button.dataset.userID
        button.addEventListener('click', async ()=> {
            await fireUser(userID)
            button.parentElement.remove()
        })
    });
}

export const handleModal = () => {
    handleCreateDepartmentButton()
}