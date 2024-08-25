import React, { useContext, useEffect, useState } from 'react'
import styles from './AllOrders.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { cartContext } from '../../Context/CartContext.js';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';
import Loader from '../Loader/Loader.jsx';
import { authenticationContext } from '../../Context/AuthenticationContext.js';
import { Helmet } from 'react-helmet';
import noOrders from '../../assets/Empty-Orders.svg'

export default function AllOrders() {

    let { getLoggedUserOrders } = useContext(cartContext);

    const [isLoading, setIsLoading] = useState(false);
    const [ordersList, setOrdersList] = useState(null);
    const [cartIsLoading, setCartIsLoading] = useState(false);

    let { getLoggedUserCart,
        setNumOfCartItems,
        setCartId } = useContext(cartContext);

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getCartInfo() {
        // setCartIsLoading(true);
        let res = await getLoggedUserCart();
        if (res?.data?.status === 'success') {
            setNumOfCartItems(res?.data?.numOfCartItems);
            setCartId(res?.data?.data?._id);
        }
        else {
            if (res?.response?.data?.message === 'Expired Token. please login again' || res?.request?.statusText === 'Unauthorized') {
                getOut();
            }
            else {
                setNumOfCartItems(0);
                setCartId(null);
            }
        }
        // setCartIsLoading(false);
    }


    async function getOrders(userId) {
        setIsLoading(true);
        let res = await getLoggedUserOrders(userId);
        // console.log(res);
        if (res?.data?.length > 0) {
            setOrdersList(res?.data);
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() : setOrdersList(null);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getCartInfo();
        getOrders(jwtDecode(localStorage.getItem('userToken')).id);
    }, []);


    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>Orders</title>
        </Helmet>

        <div className='pt-4 pb-5'>
            {ordersList?.length > 0 ? <>
                <h1>All Orders</h1>
                <div className="accordion" id="accordionExample">

                    {ordersList?.reverse().map((order) => <div key={order?._id} className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${order?._id}`} aria-expanded="true" aria-controls={order?._id}>

                                <div className='row w-100 position-relative'>
                                    <div className='col-7 col-md-4 col-lg-3 d-flex row justify-content-center'>
                                        <span>ORDER PLACED</span>
                                        <span>{order?.updatedAt?.slice(0, 10)}</span>
                                    </div>
                                    <div className='col-5 col-md-4 col-lg-3 d-flex row justify-content-center'>
                                        <span>TOTAL</span>
                                        <span>EGP {order?.totalOrderPrice}</span>
                                    </div>
                                    <div className='position-absolute end-0 me-3 drop-down-order' style={{ width: 'fit-content' }}>
                                        ORDER # {order._id}
                                    </div>
                                </div>

                            </button>
                        </h2>

                        <div id={order?._id} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">

                                <div className='d-flex row'>
                                    <div className='h6 col-md-6'>
                                        <h4>Order Details: </h4>
                                        {order?.user?.name}
                                        <br />
                                        {order?.shippingAddress?.phone}
                                        <br />
                                        {order?.shippingAddress?.details}, {order?.shippingAddress?.city}
                                    </div>

                                    <div className='h5 col-md-6 row justify-content-end'>
                                        <span className='badge bg-main text-white m-2' style={{ height: 'fit-content', width: 'fit-content' }}>
                                            {order?.paymentMethodType === 'card' ? 'Card' : 'Cash'}
                                        </span>
                                        <span className='badge bg-main text-white m-2' style={{ height: 'fit-content', width: 'fit-content' }}>
                                            {order?.isPaid ? 'Paid' : 'Not Paid'}
                                        </span>
                                        <span className='badge bg-main text-white m-2' style={{ height: 'fit-content', width: 'fit-content' }}>
                                            {order?.isDelivered ? 'Delivered' : 'In Way'}
                                        </span>
                                        {/* <span className='badge bg-main text-white m-2' style={{height: 'fit-content', width: 'fit-content'}}>
                                    EGP {order?.totalOrderPrice}
                                </span> */}
                                        {/* <span className='badge bg-main text-white m-2'>No. {order?.cartItems?.length}</span> */}
                                    </div>
                                </div>

                                <h4 className='mt-3'>Products : <span className='h6 ms-4'>No. {order?.cartItems?.length}</span></h4>
                                <div className='row'>
                                    {order?.cartItems?.map((item, index) => <div key={index} className='col-md-6 col-lg-4 mt-4 '>
                                        <div className='border-bottom row pb-1 mx-1'>
                                            <div className='col-5 col-md-4 col-lg-3'>
                                                <img className='w-100' src={item?.product?.imageCover} alt="" />
                                            </div>
                                            <div className='col-7 col-md-8 col-lg-9'>
                                                <Link className='d-block fw-normal product-order-name' to={`/productdetails/${item?.product?._id}`}>
                                                    {item?.product?.title?.split(' ').slice(0, 3).join(' ')}
                                                </Link>
                                                <span>
                                                    {item?.count} x EGP {item?.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>)}
                                </div>

                            </div>
                        </div>
                    </div>)}

                </div>
            </> : <>
                <div className='row justify-content-center my-5'>
                    <div className='col-md-8'>
                        <img className='w-100' height={500} src={noOrders} alt="" />
                    </div>
                </div>
            </>}
        </div>

    </>


}
