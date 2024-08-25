import React, { useContext, useEffect, useState } from 'react'
import styles from './Cart.module.css'
import { cartContext } from '../../Context/CartContext.js'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../Loader/Loader.jsx';
import emptyCart from '../../assets/Empty-cart.svg'
export default function Cart() {

    let { getLoggedUserCart, removeItemFromCart, updateProductCount, setNumOfCartItems, removeCart } = useContext(cartContext);
    const [cartDetails, setCartDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getCart() {
        setIsLoading(true);
        let res = await getLoggedUserCart();
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            // console.log(res.data.data);
        }
        else{
            if(res?.response?.data?.message == 'Expired Token. please login again'){
                getOut();
            }
        }
        setIsLoading(false);
    }

    async function deleteItem(productId) {
        let res = await removeItemFromCart(productId);
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            setNumOfCartItems(res?.data?.numOfCartItems);
            toast.success('Item removed Successfuly');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again')? getOut() : toast.error("Failed to remove item");
        }
    }

    async function updateProductQuantity(productId, count) {
        let res = await updateProductCount(productId, count);
        if (res?.data?.status === 'success') {
            setCartDetails(res.data.data);
            setNumOfCartItems(res?.data?.numOfCartItems);
            toast.success('Quantity updated Successfuly');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again')? getOut() : toast.error("Failed update quantity");
        }
    }

    async function clearCart() {
        let res = await removeCart();
        if (res?.data?.message === 'success') {
            setCartDetails(null);
            setNumOfCartItems(0);
            toast.success('Cleared Cart Successfuly');
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again')? getOut() : toast.error("Failed Operation");
        }
    }

    useEffect(() => {
        getCart();
    }, []);


    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>Cart Details</title>
        </Helmet>
        {
            cartDetails !== null && cartDetails?.products?.length > 0 ? <div className="bg-main-light p-3 p-md-4 my-4 position-relative">
                <div className='row d-flex justify-content-center align-items-center'>
                    <div className='col-11 col-md-9 col-lg-10'>
                        <h3>Shop Cart: </h3>
                        <h6 className='text-main'>Total Cart Price: {cartDetails?.totalCartPrice} EGP</h6>
                    </div>
                    <button className='col-11 col-md-3 col-lg-2 bg-main btn btn-lg ' style={{height: 'fit-content'}}>
                        <Link className='text-white h5' to={'/checkout'}>
                            Checkout
                            <i className="fa-solid fa-basket-shopping fa-lg ms-2"></i>
                        </Link>
                    </button>
                </div>


                {cartDetails?.products?.map((product) => <div key={product.product._id} className='row d-flex justify-content-center align-items-center border-bottom py-2 my-3'>
                    <Link to={`/productdetails/${product.product._id}`} className="col-9 col-md-2 col-lg-1 mb-2">
                        <img src={product.product.imageCover} className='w-100' alt="" />
                    </Link>
                    <div className="col-9 col-md-10 col-lg-11 ">
                        <div className='row d-flex justify-content-between'>
                            <div className='col-md-10'>
                                <Link to={`/productdetails/${product.product._id}`}><h6 >{product.product.title} </h6></Link>
                                <h6 className='text-main'>price: {product.price}</h6>
                                <button onClick={() => { deleteItem(product.product._id) }} className='btn m-0 p-0'>
                                    <i className='fa-regular fa-trash-can text-main me-1'></i>
                                    Remove
                                </button>
                            </div>
                            <div className='col-md-2 d-flex flex-row-reverse'>
                                <button onClick={() => { updateProductQuantity(product.product._id, product.count + 1) }} className='btn border-main btn-sm' style={{height: 'fit-content'}}>+</button>
                                <span className='mx-3'>{product.count}</span>
                                <button onClick={() => { product.count > 1 ? updateProductQuantity(product.product._id, product.count - 1) : deleteItem(product.product._id) }} className='btn border-main btn-sm' style={{height: 'fit-content'}}>-</button>
                            </div>
                        </div>
                    </div>
                </div>)}
                <div className='my-5'></div>
                <button onClick={clearCart} className='btn btn-danger p-2 position-absolute' style={{ bottom: '15px', right: '15px' }}>
                    Clear Cart
                    <i className='fa-regular fa-trash-can fa-lg ms-2'></i>
                </button>
            </div> : <>
                <div className='row justify-content-center my-5'>
                    <div className='col-md-8'>
                        <img className='w-100' height={500} src={emptyCart} alt="" />
                        {/* <h5 className='h3 text-main fw-bold text-center my-4 fs-lg'>Cart is empty</h5> */}
                    </div>
                </div>
            </>
        }
    </>
}
