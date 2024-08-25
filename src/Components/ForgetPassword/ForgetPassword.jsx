import React, { useState } from 'react'
import styles from './ForgetPassword.module.css'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Helmet } from 'react-helmet';
import { useContext } from 'react';
import { authenticationContext } from '../../Context/AuthenticationContext.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ForgetPassword() {

    let { forgetPasswordApi, verifyResetCodeApi, setEmail } = useContext(authenticationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetCode, setIsResetCode] = useState(false);
    let navigate = useNavigate();

    async function handleForgetPassword(values) {
        setIsLoading(true);
        let res = await forgetPasswordApi(values);
        if (res?.data?.statusMsg === 'success') {
            setIsResetCode(true);
            setEmail(values.email);
            toast.success(res?.data?.message);
        }
        else {
            setIsResetCode(false);
            toast.error(res?.response?.data?.message ? res?.response?.data?.message : "Failed Operation");
        }
        setIsLoading(false);
    }
    
    let validationMail = Yup.object({
        email: Yup.string().required("email is required").email("email is invalid"),
    })
    let formik1 = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: handleForgetPassword,
        validationSchema: validationMail,
    });
    


    async function handleResetCode(values) {
        setIsLoading(true);
        let res = await verifyResetCodeApi(values);
        console.log(res);
        if (res?.data?.status === 'Success') {
            toast.success('Correct Code');
            navigate('/resetpassword')
        }
        else {
            toast.error(res?.response?.data?.message ? res?.response?.data?.message : "Failed Operation");
        }
        setIsLoading(false);
    }

    let validationCode = Yup.object({
        resetCode: Yup.number("resetCode must be numbers").required("resetCode is required"),
    })
    let formik2 = useFormik({
        initialValues: {
            resetCode: '',
        },
        onSubmit: handleResetCode,
        validationSchema: validationCode,
    });


    return <>
        <Helmet>
            <title>Forget Password</title>
        </Helmet>
        <div className="w-75 mx-auto py-5 my-5">
            <h3 className='mb-4'>Forget Password : </h3>

            {isResetCode ? <>
                <form onSubmit={formik2.handleSubmit}>
                    <label htmlFor="resetCode">ResetCode</label>
                    <input className='form-control mb-2' onBlur={formik2.handleBlur} onChange={formik2.handleChange} value={formik2.values.resetCode} type="text" name='resetCode' id='resetCode' />
                    {formik2.errors.resetCode && formik2.touched.resetCode ? <div className="alert alert-danger">{formik2.errors.resetCode}</div> : ""}

                    {isLoading ? <button className='btn bg-main text-white mt-1'><i className='fas fa-spinner fa-spin'></i></button> : <button disabled={!(formik1.isValid && formik1.dirty)} type='submit' className='btn bg-main text-white mt-1'>
                        Send</button>}
                </form>
            </> : <>
                <form onSubmit={formik1.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input className='form-control mb-2' onBlur={formik1.handleBlur} onChange={formik1.handleChange} value={formik1.values.email} type="text" name='email' id='email' />
                    {formik1.errors.email && formik1.touched.email ? <div className="alert alert-danger">{formik1.errors.email}</div> : ""}

                    {isLoading ? <button className='btn bg-main text-white mt-1'><i className='fas fa-spinner fa-spin'></i></button> : <button disabled={!(formik1.isValid && formik1.dirty)} type='submit' className='btn bg-main text-white mt-1'>
                        Send Mail</button>}
                </form>
            </>}

        </div>
    </>
}
