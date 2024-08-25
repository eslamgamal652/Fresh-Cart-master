import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let productsContext = createContext();

export function ProductsContextProvider(props) {

    const [categories, setCategories] = useState(null)

    let headers = {
        token: localStorage.getItem('userToken'),
    }

    async function getAllProducts(fields = '') {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/products?${fields}`)
            .then((res) => res).catch((error) => error);
    }

    async function getProductDeatails(id) {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
            .then((res) => res).catch((error) => error);
    }

    async function getProductsInCustemList(id, listName) {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/products?${listName}=${id}`)
            .then((res) => res).catch((error) => error);
    }


    async function getAllCategories() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/categories?limit=100`)
            .then((res) => res).catch((error) => error);
    }

    async function getCategoryDeatails(id) {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}`)
            .then((res) => res).catch((error) => error);
    }
    
    async function getSubcatrgoriesForCategory(id) {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`)
        .then((res) => res).catch((error) => error);
    }
    
    async function getAllBrands() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/brands/`)
            .then((res) => res).catch((error) => error);
    }

    async function getBrandDeatails(id) {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`)
            .then((res) => res).catch((error) => error);
    }






    return <productsContext.Provider value={{
        getAllProducts,
        getProductDeatails,
        categories,
        setCategories,
        getAllCategories,
        getCategoryDeatails,
        getProductsInCustemList,
        getSubcatrgoriesForCategory,
        getAllBrands,
        getBrandDeatails,
    }} >
        {props.children}
    </productsContext.Provider>
}