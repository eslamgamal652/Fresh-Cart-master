import React, { useContext, useState } from 'react'
import styles from './Checkout.module.css'
import { useFormik } from 'formik'
import { cartContext } from '../../Context/CartContext.js';
import * as Yup from 'yup'
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Checkout() {

    let { onlinePayment, cashPayment, cartId } = useContext(cartContext);
    const [isLoading, setIsLoading] = useState(false);
    const [selectButton, setSelectButton] = useState('');

    let navigate = useNavigate();


    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function handleCashSubmit(values) {
        setIsLoading(true);
        let res = await cashPayment(cartId, values);
        if (res?.data?.status === 'success') {
            toast.success('Successfuly Order');
            navigate('/allorders');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again' ||
                res?.response?.data?.message == 'You are not logged in. Please login to get access') ?
                getOut() : toast.error('Failed Order');
        }
        setIsLoading(false);
    }
    
    async function handleOnlineSubmit(values) {
        setIsLoading(true);
        let res = await onlinePayment(cartId, values);
        if (res?.data?.status === 'success') {
            toast.success('Successfuly Order');
            window.location.href = res?.data?.session?.url;
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again' ||
                res?.response?.data?.message == 'You are not logged in. Please login to get access') ?
                getOut() : toast.error('Failed Order');
        }
        setIsLoading(false);
    }

    let validation = Yup.object({
        details: Yup.string().required("Address is required").min(3, 'Minimum letter is 3').max(100, 'Maximum letters is 100'),
        city: Yup.string().required("City is required").min(2, 'Minimum letter is 2').max(10, 'Maximum letters is 10'),
        phone: Yup.string().required("phone is required").matches(/^01[0125][0-9]{8}$/, 'phone must be valid number'),
    });

    function handleSubmit(values) {
        if(selectButton==='Cash') handleCashSubmit(formik.values)
        else handleOnlineSubmit(formik.values)
    }

    let formik = useFormik({
        initialValues: {
            details: '',
            city: '',
            phone: '',
        },
        validationSchema: validation,
        onSubmit: handleSubmit
    });

    return <>
        <Helmet>
            <title>Checkout Details</title>
        </Helmet>
        <div className='row py-5'>
            <div className='col-md-8 mx-auto '>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="details">Address: </label>
                    <input type="text" className='form-control mb-3' onBlur={formik.handleBlur} value={formik.values.details} onChange={formik.handleChange} name='details' id='details' />
                    {formik.errors.details && formik.touched.details ? <div className="alert alert-danger">{formik.errors.details}</div> : ""}

                    <label htmlFor="phone">phone: </label>
                    <input type="text" className='form-control mb-3' onBlur={formik.handleBlur} value={formik.values.phone} onChange={formik.handleChange} name='phone' id='phone' />
                    {formik.errors.phone && formik.touched.phone ? <div className="alert alert-danger">{formik.errors.phone}</div> : ""}

                    <label htmlFor="city">city: </label>
                    <input type="text" className='form-control mb-3' onBlur={formik.handleBlur} value={formik.values.city} onChange={formik.handleChange} name='city' id='city' />
                    {formik.errors.city && formik.touched.city ? <div className="alert alert-danger">{formik.errors.city}</div> : ""}


                    <button disabled={isLoading || !(formik.isValid && formik.dirty)}
                        className='col-12 btn bg-main text-white mt-1' style={{ width: '49%', marginLeft: '1%'}} 
                        onClick={()=> setSelectButton('Cash')} type='submit'> 
                        {isLoading ? <i className='fas fa-spinner fa-spin'></i> :
                            <>
                                <i className="fa-solid fa-money-bills fa-lg pe-2"></i>
                                Pay Cash
                            </>
                        }
                    </button>
                    <button disabled={isLoading || !(formik.isValid && formik.dirty)} 
                        className='btn bg-main text-white mt-1' style={{ width: '49%', marginLeft: '1%'}} 
                        onClick={()=> setSelectButton('Visa')} type='submit'>
                        {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 
                        <>
                            <i className="fa-brands fa-cc-visa fa-lg pe-2"></i>
                            Pay Visa
                        </>}
                    </button>
                </form>
            </div>
        </div>
    </>
}
