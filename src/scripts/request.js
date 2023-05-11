const localToken = JSON.parse(localStorage.getItem("@Kenzie-Empresas: token")) || ""
const baseUrl = 'http://localhost:3333';
const requestHeaders = {
    'Content-Type': 'application/json',
    Authorization : `Bearer ${localToken}`
}

import { toast } from "./render.js";

// general requests

export const getAllCategories = async () => {
    const categoryList = fetch(`${baseUrl}/categories/readAll`, {
        method: 'GET'
    })
    .then( async (res) => {
        const response = await res.json()
        return response
    })
    return categoryList;
}

export const getCategoryID = async (category) =>{
    const categoryList = await getAllCategories()
    let categoryID = ''
        categoryList.forEach(categoryObject => {
            if (categoryObject.name === category){
                categoryID = categoryObject.id
            }
        });
        return categoryID
}

export const getCategoryName = async (categoryID) =>{
    const categoryList = await getAllCategories()
    let categoryName = ''
        categoryList.forEach(categoryObject => {
            if (categoryObject.id === categoryID){
                categoryName = categoryObject.name
            }
        });
        return categoryName
}

export const getCompany = async (category) => {
    const companyList = await fetch(`${baseUrl}/companies/readAll`, {
        method: 'GET'
    })
    .then( async (res) => {
    if (res.ok){
        const response = await res.json()
        return response;
    }})
    
    if (category == 'all'){
        return companyList
    } else {
        const categoryID = await getCategoryID(category)
        let filteredCompanies = []
        companyList.map(company => {
            if (company.category_id === categoryID){
                filteredCompanies.push(company)
            }
        });
        return filteredCompanies
    }
}

export const getCompanyAdmin = async (id) => {
    const company = await fetch(`${baseUrl}/companies/readById/${id}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then(async (res) => {
        if (res.ok){
            const response = await res.json()
            return response;
        }
    })
    return company
}

export const getUserInfo = async () => {
    const userData = fetch(`${baseUrl}/employees/profile`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then(async (res) => {
        if (res.ok){
            const response = await res.json()
            return response;
        } else {
            location.replace('../../index.html')
        }
    })
    return userData;
}

export const getCompanyByID = async (id) => {
    const companyList = await getCompany('all')
        let company = ''
        companyList.forEach(tentativeCompany => {
            if (tentativeCompany.id === id){
                company = tentativeCompany
            }
        });
    return company
}

export const getDepartmentByID = async (id) => {
    const department = fetch(`${baseUrl}/departments/readById/${id}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then(async (res) => {
        if (res.ok) {
            const response = await res.json()
            return response
        }
    })
    return department
}

export const getCompanyDepartments = async (companyID) => {
    const departmentList = fetch(`${baseUrl}/departments/readByCompany/${companyID}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then(async (res) => {
        if (res.ok) {
            const response = await res.json()
            return response
        }
    })
    return departmentList
}

export const getAllEmployees = async () => {
    const employeeList = fetch(`${baseUrl}/employees/readAll`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (async (res) => {
        if (res.ok){
            const response = await res.json()
            return response
        }
    })
    return employeeList
}

export const getUserByID = async (userID) => {
    const userList = await getAllEmployees()
    let filteredUser = ''
    userList.map(user => {
        if (user.id === userID){
            filteredUser = user
        }
    });
    return filteredUser
}

// register request
export const registerNewUser = async (userName, userEmail, userPassword) => {
    
    fetch(`${baseUrl}/employees/create`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            password: userPassword
        })
    })
    .then( async (res) => {
    if (res.ok){
        toast('green', 'Registrado com sucesso')
        setTimeout(() => { 
            location.replace('./login.html')
        }, 2000);
    }else {
        const response = await res.json()
        toast('red', response.message)
    }})
}

//login request
export const loginUser = async (userEmail, userPassword) =>{
    const token = fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        })
    })
    .then(async (res) => {
        if (res.ok){
            const response = await res.json()
            if (response.isAdm){
                localStorage.setItem("@Kenzie-Empresas: admin", "yes")
                localStorage.setItem("@Kenzie-Empresas: token", JSON.stringify(response.authToken))
                toast('green', 'Login efetuado com sucesso')
                setTimeout(() => { 
                    location.replace('./admin.html')
                    return response.authToken
                }, 3000);
            } else {
                localStorage.setItem("@Kenzie-Empresas: admin", "no")
                localStorage.setItem("@Kenzie-Empresas: token", JSON.stringify(response.authToken))
                toast('green', 'Login efetuado com sucesso')
                setTimeout(() => { 
                    location.replace('./user.html')
                    return response.authToken
                }, 3000);
            }
        } else {
            const response = await res.json()
            toast('red', response.message)
        }
    })
    return token
}

//modal requests

export const createNewDepartment = async (department, description, companyID) => {
    let result = true
    fetch(`${baseUrl}/departments/create`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            name: department,
            description: description,
            company_id: companyID
          })
    })
    .then (async (res) =>{
        if (res.ok){
            toast('green', 'Departamento criado com sucesso')
            return
        } else {
            result = false
            toast('red', 'Departamento já existente ou inválido')
            return
        }
    })
    return result
}

export const deleteDepartment = async (id) => {  //little bug when deleting last department
    fetch(`${baseUrl}/departments/delete/${id}`, {
        method: 'DELETE',
        headers: requestHeaders
    })
    .then ( async (res) => {
        if (res.ok){
            const response = await res.json()
            toast('green', response.message)
        }
    })
}

export const deleteUser = async (id) => {  
    fetch(`${baseUrl}/employees/deleteEmployee/${id}`, {
        method: 'DELETE',
        headers: requestHeaders
    })
    .then ( async (res) => {
        if (res.ok){
            const response = await res.json()
            toast('green', response.message)
            setTimeout(()=>{
                location.reload()
            },800)
        }
    })
}

export const editDepartment = async (departmentID, newDescription) => {
    fetch(`${baseUrl}/departments/update/${departmentID}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({
            description: newDescription
        })
    })
    .then ( async (res) => {
        if (res.ok){
            const response = await res.json()
            toast('green', 'Departamento Atualizado com sucesso')
            return response
        } else {
            toast('red', 'Descrição Inválida')
        }
    })
}

export const editUser = async (userID, newName, newEmail) => {
    let currentBody = ''
    const regularBody = {
        name: newName,
        email: newEmail
    }
    const nameOnlyBody = {
        name: newName
    }
    const emailOnlyBody = {
        email: newEmail
    }

    if (!newName.trim() && !newEmail.trim()){
        toast('red', 'Nada Alterado')
        return
    } else if (!newName.trim() && newEmail.trim()){
        currentBody = emailOnlyBody
    } else if (newName.trim() && !newEmail.trim()){
        currentBody = nameOnlyBody
    } else {
        currentBody = regularBody
    }

    fetch(`${baseUrl}/employees/updateEmployee/${userID}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify(currentBody)
    })
    .then ( async (res) => {
        if (res.ok){
            const response = await res.json()
            toast('green', 'Dados alterados com sucesso')
            return response
        } else {
            toast('red', 'informações Inválidas')
        }
    })
}

export const getCompanyEmployees = async (companyID) => {
    const list = await getAllEmployees()

    let employeeList = []
    list.map(employee => {
        if( employee.company_id === companyID){
            employeeList.push(employee)
        }
    });

    return employeeList
}

export const hireUser = async (userID, departmentID) => {
    fetch(`${baseUrl}/employees/hireEmployee/${userID}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({
            department_id: departmentID
        })
    })
    .then ( async (res) => {
        if (res.ok){
            const response = await res.json()
            toast('green', response.message)
            setTimeout(()=>{
                location.reload()
            }, 800)
            return response
        } else {
            toast('red', 'Erro ao cadastrar usuário')
        }
    })
}

export const getFreeEmployees = async () => {
    const employeeList = await fetch(`${baseUrl}/employees/outOfWork`, {
        method: "GET",
        headers: requestHeaders
    })
    .then( async (res) => {
        if (res.ok){
            const response = res.json()
            return response
        }
    })
    return employeeList
 }