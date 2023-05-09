import { getAllCategories, getCompany } from "./request.js";
import { handleHomeSelect, renderHomeCompanies, handleHeader } from "./render.js";

handleHomeSelect()
renderHomeCompanies('all')
handleHeader()