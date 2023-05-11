import { 
    getAllCategories,  
    getCategoryName, 
    getCompany, 
    getCompanyByID, 
    getUserInfo, 
    getCompanyDepartments,
    getCompanyAdmin,
    getAllEmployees,
    getDepartmentByID,
    deleteDepartment,
    editDepartment,
    getCompanyEmployees,
    getFreeEmployees,
    hireUser,
    getUserByID,
    deleteUser,
    editUser } from "./request.js"

import { 
    handleDepartmentDeleteButtons, 
    handleDepartmentEditButtons, 
    handleDepartmentViewButtons,
    handleFireButton,
    handleUserEditButtons,
    handleUserDeleteButtons } from "./modal.js";

//general functions

export const toast = (color, message) => {
    const red = '#FF5630';
    const green = '#36B37E';
    let selectedColor = '';
    
    if (color == `red`){
        selectedColor = red
    } else if (color == 'green'){
        selectedColor = green
    }

    const toastContainer = document.createElement(`div`)
    const main = document.querySelector('body')
    toastContainer.classList.add(`toast`)
    toastContainer.innerText = message
    toastContainer.style.backgroundColor = selectedColor
    main.appendChild(toastContainer);

    setTimeout( function(){ 
        toastContainer.remove(); 
    }, 3000);
}

export const handleHeader = () => {
    const buttonList = document.querySelectorAll('#header__container--right > button')

    buttonList.forEach(button => {
        button.addEventListener('click', () => {
            if (button.innerText === 'Login'){
                location.replace('../pages/login.html')
            } else if (button.innerText === 'Cadastro'){
                location.replace('../pages/register.html')
            } else if (button.innerText === 'Home'){
                location.replace('../../index.html')
            } else if (button.innerText === 'Logout'){
                toast('green', 'Desconectando')
                localStorage.clear()
                setTimeout(() =>{
                    location.replace('./login.html')
                },1500)
            }
        })
    });
}

export const routeProtection = () => {
    const isAdmin = localStorage.getItem("@Kenzie-Empresas: admin")
    const userToken = localStorage.getItem("@Kenzie-Empresas: token")
    if(isAdmin == "yes"){
        location.replace("../pages/admin.html")
    }else if (userToken){
        location.replace('../pages/user.html')
    }
}

//home page renders

export const handleHomeSelect = async () =>{
    const select = document.querySelector('#company-select')
    const categoryList = await getAllCategories()
    select.innerHTML = ''
    const defaultOption = document.createElement('option')

    defaultOption.value = 'all'
    defaultOption.innerText = 'Selecionar Setor'
    select.appendChild(defaultOption)

    categoryList.forEach(category => {
        const option = document.createElement('option')
        option.value = category.name
        option.innerText = category.name
        select.appendChild(option)

    });
    select.addEventListener('change', () => {
        renderHomeCompanies(select.value)
    })
}

export const renderHomeCompanies = async (category) => {
    const listContainer = document.querySelector('#filter__list-container')
    const companyList = await getCompany(category)
    listContainer.innerHTML = ''
    const title = document.createElement('h2')
    title.innerText = 'Lista de Empresas'
    listContainer.appendChild(title)

    companyList.forEach(async company => {
        const card = document.createElement('div')
        const companyName = document.createElement('h3')
        const categoryName = document.createElement('span')

        card.classList.add('filter__card')
        companyName.innerText = company.name
        categoryName.innerText = await getCategoryName(company.category_id)

        listContainer.appendChild(card)
        card.append(companyName, categoryName)
    });
}

// user page renders

export const renderUserPage = async () =>{
    const userInfo = await getUserInfo()
    
    const userInfoContainer = document.querySelector('#user__info-container')
    userInfoContainer.innerHTML = ''
    const userName = document.createElement('h3')
    const userEmail = document.createElement('p')
    userName.innerText = `${userInfo.name}`
    userEmail.innerText = `${userInfo.email}`
    userInfoContainer.append(userName, userEmail)

    const companyInfoContainer = document.querySelector('#company__info-container')
    companyInfoContainer.innerHTML = ''

    if(userInfo.company_id){
        const company = await getCompanyByID(userInfo.company_id)
        const department = await getDepartmentByID(userInfo.department_id)
        userInfoContainer.insertAdjacentHTML("afterend",
        `<div><h2>${company.name} - ${department.name}</h2></div>` )
        companyInfoContainer.classList.add('company__info-container')

        const cardContainer = document.createElement('ul')
        cardContainer.id = 'employee__cards-container'

        const employeeList = department.employees
        employeeList.forEach(employee => {
            const card = document.createElement('li')
            const employeeName = document.createElement('h3')
            
            card.classList.add('employee__card')
            employeeName.innerText = employee.name

            companyInfoContainer.appendChild(card)
            card.appendChild(employeeName)
        });
        return
    } else {
        companyInfoContainer.classList.add('company__info-container--empty')
        const emptyMessage = document.createElement('h2')
        emptyMessage.innerText = 'Você ainda não foi Contratado'
        companyInfoContainer.appendChild(emptyMessage)

        const companyHeader = document.querySelector('main > div')
        if(companyHeader){
            companyHeader.remove()
        }
        return
    }
}

//Admin renders

const getCompanyFromList = (userId, companyList) => {
    let company = ''
    companyList.forEach(tentativeCompany => {
        if (tentativeCompany.id === userId){
            company = tentativeCompany
        }
    });
    return company
}

export const renderAdminUsers = async (companyID) => {
    const usersContainer = document.querySelector('#admin__users-container')
    usersContainer.innerHTML = ''
    usersContainer.classList.remove('admin__users-container')
    usersContainer.classList.remove('admin__users-container--empty')
    
    let employeeList = []
    if (companyID === 'default'){
        employeeList = await getAllEmployees()
    } else {
        const company = await getCompanyAdmin(companyID)
        employeeList = company.employees
        if (employeeList.length === 0){
            
            usersContainer.classList.add('admin__users-container--empty')
            const emptyMessage = document.createElement('h2')
            emptyMessage.innerText = `Empresa ${company.name} não possui usuários`
            usersContainer.appendChild(emptyMessage)
            return
        } 
    }

    const companyList = await getCompany('all')

    usersContainer.classList.add('admin__users-container')
    employeeList.forEach((employee)  => {
        let companyText = 'Não Contratado'
        if (employee.company_id){
            const company = getCompanyFromList(employee.company_id, companyList)
            companyText = company.name
        }
        const userCard = document.createElement('div')
        const textContainer = document.createElement('div')
        const userName = document.createElement('h2')
        const companyName = document.createElement('span')
        const buttonContainer = document.createElement('div')
        const editButton = document.createElement('img')
        const deleteButton = document.createElement('img')
        
        userCard.classList.add('user__card')
        textContainer.classList.add('text-container')
        userName.innerText = employee.name
        companyName.innerText = companyText
        buttonContainer.classList.add('button-container')
        editButton.src = '../src/image/pen.svg'
        editButton.alt = 'pen icon'
        editButton.classList.add('pen')
        editButton.dataset.userID = employee.id
        deleteButton.src = '../src/image/bin.svg'
        deleteButton.alt = 'bin icon'
        deleteButton.classList.add('bin')
        deleteButton.dataset.userID = employee.id
        
        usersContainer.appendChild(userCard)
        userCard.append(textContainer, buttonContainer)
        textContainer.append(userName, companyName)
        buttonContainer.append(editButton, deleteButton)
    })
    handleUserEditButtons()
    handleUserDeleteButtons()
}

export const renderAdminDepartments = async (companyID) => {
    const departmentContainer = document.querySelector('#admin__department-container')
    const company = await getCompanyByID(companyID)
    departmentContainer.innerHTML = ''
    departmentContainer.classList.remove('admin__department-container--empty')
    departmentContainer.classList.remove('admin__department-container')

    if (companyID === 'default') {
        departmentContainer.classList.add('admin__department-container--empty')
        await renderAdminUsers('default')
        return
    }

    const departmentList = await getCompanyDepartments(companyID)

    if (departmentList.length === 0) {
        departmentContainer.classList.add('admin__department-container--empty')

        const emptyMessage = document.createElement('h2')
        emptyMessage.innerText = `Empresa ${company.name} não possui departamentos`
        departmentContainer.appendChild(emptyMessage)
        await renderAdminUsers(companyID)
    } else {
        departmentContainer.classList.add('admin__department-container')

        departmentList.forEach(department => {
            const departmentCard = document.createElement('div')
            const textContainer = document.createElement('div')
            const departmentName = document.createElement('h2')
            const departmentDescription = document.createElement('p')
            const companyName = document.createElement('span')
            const buttonContainer = document.createElement('div')
            const showButton = document.createElement('img')
            const editButton = document.createElement('img')
            const deleteButton = document.createElement('img')
            
            departmentCard.classList.add('department__card')
            textContainer.classList.add('text-container')
            departmentName.innerText = `${department.name}`
            departmentDescription.innerText = `${department.description}`
            companyName.innerText = `${company.name}`
            buttonContainer.classList.add('button-container')
            showButton.src = '../src/image/eye.svg'
            showButton.alt = 'eye icon'
            showButton.classList.add('eye')
            showButton.dataset.departmentID = department.id
            editButton.src = '../src/image/pen.svg'
            editButton.alt = 'pen icon'
            editButton.classList.add('pen')
            editButton.dataset.departmentID = department.id
            deleteButton.src = '../src/image/bin.svg'
            deleteButton.alt = 'bin icon'
            deleteButton.classList.add('bin')
            deleteButton.dataset.departmentID = department.id

            departmentContainer.appendChild(departmentCard)
            departmentCard.append(textContainer, buttonContainer)
            textContainer.append(departmentName, departmentDescription, companyName)
            buttonContainer.append(showButton, editButton, deleteButton)
        });
        await renderAdminUsers(companyID)
        handleDepartmentDeleteButtons()
        handleDepartmentEditButtons()
        handleDepartmentViewButtons()
    }
}

export const renderSelectCompany = async (selectID) => {
    const select = document.querySelector(selectID)
    const companyList = await getCompany('all')
    select.innerHTML = ''
    const defaultOption = document.createElement('option')
    
    defaultOption.value = 'default'
    defaultOption.innerText = 'Selecionar Empresa'
    select.appendChild(defaultOption)
    
    companyList.forEach(company => {
        const option = document.createElement('option')
        option.value = company.id
        option.innerText = company.name
        select.appendChild(option)
    });
    select.addEventListener('change', async () => {
        if (select.id === 'department__select'){
            await renderAdminDepartments(select.value)
        }
    })
}

//modal renders

export const renderDeleteUserModal = async () =>{
    const modalController = document.querySelector('#modal__container--user-delete__controller')
    const closeButton = document.querySelector('#modal__container--user-delete > .modal__header > button')
    const message = document.querySelector('#modal__container--user-delete > h1')
    const removeButton = document.querySelector('#modal__container--user-delete > button')
    const userID = removeButton.dataset.userID || ''
    if (userID === ''){
        return
    }

    const userData = await getUserByID(userID)
    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        modalController.close()
    })

    message.innerText = `Realmente deseja remover o usuário ${userData.name} ?`

    removeButton.addEventListener('click', async (event) => {
        event.preventDefault()
        await deleteUser(userID)
        const currentDepartments = document.querySelector('#department__select').value
        await renderAdminDepartments(currentDepartments)
        modalController.close()
    })
}

export const renderEmployeeList = async (companyID) => {
    const userCardsContainer = document.querySelector('#users__card-list')
    const userList = await getCompanyEmployees(companyID)
    const company = await getCompanyByID(companyID)
    userCardsContainer.innerHTML = ''
    
    userList.forEach(user => {
        const card = document.createElement('li')
        const userName = document.createElement('h2')
        const companyName = document.createElement('p')
        const fireButton = document.createElement('button')
        

        card.classList.add('modal__user-card')
        userName.innerText = user.name
        companyName.innerText = company.name
        fireButton.innerText = 'Desligar'
        fireButton.dataset.userID = user.id

        userCardsContainer.appendChild(card)
        card.append(userName, companyName, fireButton)
    });

    handleFireButton()
}

export const renderViewDepartmentModal = async (clickedDepartmentID) => {
    const modalController = document.querySelector('#modal__container--department-visualize__controller')
    const departmentName = document.querySelector('#modal__container--department-visualize > .modal__header > h1')
    const closeButton = document.querySelector('#modal__container--department-visualize > .modal__header > button')
    const departmentDescription = document.querySelector('#modal__container--department-visualize > h2')
    const companyName = document.querySelector('#modal__container--department-visualize > p')
    const select = document.querySelector('#select-user')
    const selectUserButton = document.querySelector('#search__user-container > button')

    const departmentID = clickedDepartmentID || ''
    if (departmentID === ''){
        return
    }

    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        modalController.close()
    })

    const department = await getDepartmentByID(departmentID)

    departmentName.innerText = department.name
    departmentDescription.innerText = department.description
    companyName.innerText = department.company.name

    const freeUserList = await getFreeEmployees()
    select.innerHTML = ''
    const defaultOption = document.createElement('option')

    defaultOption.value = 'Default'
    defaultOption.innerText = 'Selecionar Usuário'
    select.appendChild(defaultOption)

    freeUserList.forEach(user => {
        const option = document.createElement('option')
        option.value = user.id
        option.innerText = user.name
        select.appendChild(option)
    });
    
    selectUserButton.dataset.departmentID = departmentID
    selectUserButton.addEventListener('click', async (event) => {
        event.preventDefault()
        if (event.value === 'default'){
            toast('red', 'Selecione um usuário')
            return
        } else {
            const currentDepartmentId = selectUserButton.dataset.departmentID
            await hireUser(select.value, currentDepartmentId) //page update done with reloading the page
            return
        }
    })
    renderEmployeeList(department.company.id)
}

export const renderDeleteDepartmentModal = async () => {
    const modalController = document.querySelector('#modal__container--department-delete__controller')
    const closeButton = document.querySelector('#modal__container--department-delete > .modal__header > button')
    const message = document.querySelector('#modal__container--department-delete > h1')
    const removeButton = document.querySelector('#modal__container--department-delete > button')
    const departmentID = removeButton.dataset.departmentID || ''
    if (departmentID === ''){
        return
    }
    
    const departmentName = await getDepartmentByID(departmentID).name

    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        modalController.close()
    })

    message.innerText = `Realmente deseja remover o departamento ${departmentName} e demitir seus funcionários?`

    removeButton.addEventListener('click', async (event) => {
        event.preventDefault()
        await deleteDepartment(departmentID)
        const currentDepartments = document.querySelector('#department__select').value
        await renderAdminDepartments(currentDepartments)
        modalController.close()
    })
}

export const renderEditDepartmentModal = async () => {
    const modalController = document.querySelector('#modal__container--department-edit__controller')
    const closeButton = document.querySelector('#modal__container--department-edit > .modal__header > button')
    const descriptionLocation = document.querySelector('#modal__container--department-edit > form > textarea')
    const submitButton = document.querySelector('#modal__container--department-edit > form > button')
    const departmentID = submitButton.dataset.departmentID || ''
    if (departmentID === ''){
        return
    }

    const department = await getDepartmentByID(departmentID)
    const oldDescription = department.description

    descriptionLocation.placeholder = oldDescription

    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        modalController.close()
    })

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const newDescription = descriptionLocation.value

        if(newDescription.trim() === ''){
            toast('red', 'Informe uma nova Descrição')
        } else {
            await editDepartment(departmentID, newDescription)
            setTimeout(()=>{
                location.reload()
            }, 300)
        }
    })
}

export const renderEditUserModal = async () => {
    const modalController = document.querySelector('#modal__container--user-edit__controller')
    const closeButton = document.querySelector('#modal__container--user-edit > .modal__header > button')
    const inputList = document.querySelectorAll('#modal__container--user-edit > form > input')
    const submitButton = document.querySelector('#modal__container--user-edit > form > button')

    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        modalController.close()
    })
    
    submitButton.addEventListener('click', async (event) => {
        const userID = submitButton.dataset.userID
        event.preventDefault()
        const newName = inputList[0].value
        const newEmail = inputList[1].value

        await editUser(userID, newName, newEmail)
        setTimeout(()=>{
            location.reload()
        }, 300)
    })
}