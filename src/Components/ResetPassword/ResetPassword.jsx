import React, { useContext, useState } from 'react'
import styles from './ResetPassword.module.css'
import * as Yup from 'yup'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast';
import { authenticationContext } from '../../Context/AuthenticationContext.js';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {

    let { resetPasswordApi, email } = useContext(authenticationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetCode, setIsResetCode] = useState(false);
    let navigate = useNavigate();

    async function handleResetPassword(values) {
        setIsLoading(true);
        let res = await resetPasswordApi(values);
        if (res?.data?.token) {
            setIsResetCode(true);
            toast.success('Password reset successfully');
            navigate('/login')
        }
        else {
            setIsResetCode(false);
            toast.error(res?.response?.data?.message ? res?.response?.data?.message : "Failed Operation");
        }
        setIsLoading(false);
    }
    
    let validationMail = Yup.object({
        email: Yup.string().required("email is required").email("email is invalid"),
        newPassword: Yup.string().required("password is required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'password must have spiacl characters, capital letters, small letters, numbers, and min 8 characters'),
    });

    let formik1 = useFormik({
        initialValues: {
            email: email!=null? email : '',
        },
        onSubmit: handleResetPassword,
        validationSchema: validationMail,
    });


    return <>
        <Helmet>
            <title>Reset Password</title>
        </Helmet>
        <div className="w-75 mx-auto py-5 my-5">
            <h3 className='mb-4'>Forget Password : </h3>

                <form onSubmit={formik1.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input className='form-control mb-2' onBlur={formik1.handleBlur} onChange={formik1.handleChange} value={formik1.values.email} type="text" name='email' id='email' />
                    {formik1.errors.email && formik1.touched.email ? <div className="alert alert-danger">{formik1.errors.email}</div> : ""}
                    
                    <label htmlFor="newPassword">new password</label>
                    <input className='form-control mb-2' onBlur={formik1.handleBlur} onChange={formik1.handleChange} value={formik1.values.newPassword} type="password" name='newPassword' id='newPassword' />
                    {formik1.errors.newPassword && formik1.touched.newPassword ? <div className="alert alert-danger">{formik1.errors.newPassword}</div> : ""}

                    {isLoading ? <button className='btn bg-main text-white mt-1'><i className='fas fa-spinner fa-spin'></i></button> : <button disabled={!(formik1.isValid && formik1.dirty)} type='submit' className='btn bg-main text-white mt-1'>
                        Confirm</button>}
                </form>

        </div>
    </>
}
