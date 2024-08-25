import axios from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useState } from "react";

export let authenticationContext = createContext();

export function AuthenticationContextProvider(props) {

    const [email, setEmail] = useState('');

    let headers = {
        token: localStorage.getItem('userToken'),
    }

    async function loginApi(values) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values, { headers })
            .then((res) => res).catch((error) => error);
    }

    async function registerApi(values) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values, { headers })
            .then((res) => res).catch((error) => error);
    }

    async function forgetPasswordApi(values) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`, values, { headers })
            .then((res) => res).catch((error) => error);
    }

    async function verifyResetCodeApi(values) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`, values, { headers })
            .then((res) => res).catch((error) => error);
    }

    async function resetPasswordApi(values) {
        return axios.put(`https://ecommerce.routemisr.com/api/v1/auth/resetPassword`, values, { headers })
            .then((res) => res).catch((error) => error);
    }


    return <authenticationContext.Provider value={{
        email,
        setEmail,
        loginApi,
        registerApi,
        forgetPasswordApi,
        verifyResetCodeApi,
        resetPasswordApi,
    }} >
        {props.children}
    </authenticationContext.Provider>
}