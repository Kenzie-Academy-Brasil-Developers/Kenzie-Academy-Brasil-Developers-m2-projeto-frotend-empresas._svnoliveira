export const baseUrl = 'http://localhost:3333';

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

export const registerNewUser = async (userName, userEmail, userPassword) => {
    
    fetch(`${baseUrl}/employees/create`, {
        method: 'POST',
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            password: userPassword})
})
    .then( async (res) => {
    if (res.ok){
        const response = await res.json()
        return response;
    }else {
        return 'houve um erro em seu cadastro';
    }})
}

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