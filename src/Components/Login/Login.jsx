import React, { useContext, useState } from 'react'
import styles from './Login.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { authenticationContext } from '../../Context/AuthenticationContext.js'
import toast from 'react-hot-toast'

export default function Login({ saveUserDate }) {

    let { loginApi } = useContext(authenticationContext);
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [messageError, setMessageError] = useState('');

    async function handleLogin(values) {
        setIsLoading(true);
        let res = await loginApi(values);
        if (res?.data?.message === 'success') {
            localStorage.setItem('userToken', res?.data.token);
            saveUserDate();
            toast("Welcome 😍", { duration:1000 });
            navigate('/');
        }
        else {
            res?.response?.data?.errors? setMessageError(`${res?.response?.data?.errors?.param} : ${res?.response?.data?.errors?.msg}`) :
            setMessageError(`${res?.response?.data?.message}`);
        }
        setIsLoading(false);
    }

    let validation = Yup.object({
        email: Yup.string().required("email is required").email("email is invalid"),
        password: Yup.string().required("password is required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'password must have spiacl characters, capital letters, small letters, numbers, and min 8 characters'),
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validation,
        onSubmit: handleLogin,
    });

    return <>
        <Helmet>
            <title>Login</title>
        </Helmet>
        <div className="w-75 mx-auto py-5 my-5">
            <h3>Login Now : </h3>
            {messageError.length > 0 ? <div className="alert alert-danger">{messageError}</div> : null}

            <form onSubmit={formik.handleSubmit}>

                <label htmlFor="email">Email</label>
                <input className='form-control mb-2' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} type="text" name='email' id='email' />
                {formik.errors.email && formik.touched.email ? <div className="alert alert-danger">{formik.errors.email}</div> : ""}

                <label htmlFor="password">Password</label>
                <input className='form-control mb-2' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} type="password" name='password' id='password' />
                {formik.errors.password && formik.touched.password ? <div className="alert alert-danger">{formik.errors.password}</div> : ""}

                {isLoading ? <button className='btn bg-main text-white mt-2'><i className='fas fa-spinner fa-spin'></i></button> :
                    <div className='d-flex justify-content-between'>
                        <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn bg-main text-white mt-2'>Login</button>
                        <Link className='mt-2' to={`/forgetpassword`}>ForgetPassword ?</Link>
                    </div>}

            </form>
        </div>
    </>
}
