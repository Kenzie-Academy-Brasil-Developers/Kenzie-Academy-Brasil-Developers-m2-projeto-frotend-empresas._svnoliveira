import { getAllCategories, getCategoryID, getCategoryName, getCompany } from "./request.js"

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
            }
        })
    });
}