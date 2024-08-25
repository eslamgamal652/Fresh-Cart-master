import React, { useContext, useEffect, useState } from 'react'
import styles from './WishList.module.css'
import { cartContext } from '../../Context/CartContext.js'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../Loader/Loader.jsx';
import emptyWishList from '../../assets/WishList.svg'
import ProductCard from '../ProductCard/ProductCard.jsx';
export default function WishList() {

    let { getLoggedWishList, 
        removeItemFromWishList, 
        setNumOfFavoriteItems, 
        numOfFavoriteItems, 
        setWishListDetails, 
        wishListDetails } = useContext(cartContext);

    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }


    async function getWishList() {
        setIsLoading(true);
        let res = await getLoggedWishList();
        if (res?.data?.status === 'success') {
            setWishListDetails(res?.data?.data);
            setNumOfFavoriteItems(res?.data?.count);
            getWishList();
        }
        else {
            if (res?.response?.data?.message == 'Expired Token. please login again') getOut();
        }
        setIsLoading(false);
    }

    async function deleteItem(productId) {
        let res = await removeItemFromWishList(productId);
        if (res?.data?.status === 'success') {
            setNumOfFavoriteItems(res?.data?.count);
            toast.success('Item removed Successfuly');
            getWishList();
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() : toast.error("Failed to remove item");
        }
    }
    

    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>Wish List</title>
        </Helmet>
        {
            wishListDetails !== null && wishListDetails?.length > 0 ? <div className="row bg-main-light p-3 p-md-4 my-4 position-relative">
                <h3>Wish List: </h3>
                {/* {wishListDetails?.map((product) => <div key={product._id} className='col-md-6'>
                    <div className='row d-flex justify-content-center align-items-center border-bottom py-2 my-3 mx-1 category-slider'>
                        <Link to={`/productdetails/${product._id}`} className="col-9 col-md-3 col-lg-2 mb-2">
                            <img src={product.imageCover} className='w-100' alt="" />
                        </Link>
                        <div className="col-9 col-md-9 col-lg-10 ">
                            <div className='row d-flex justify-content-between'>
                                <div className='col-10'>
                                    <Link to={`/productdetails/${product._id}`}>
                                        <h6>
                                            {product?.title?.split(' ').length > 5? product?.title?.split(' ').slice(0, 5).join(' '): product?.title} 
                                        </h6>
                                    </Link>
                                    <h6 className='text-main'>price: {product.price}</h6>
                                </div>
                                <div className='col-2'>
                                    <button onClick={() => { deleteItem(product._id) }} className='btn border-0' style={{ height: 'fit-content' }}>
                                        <i className="fa-solid fa-heart-circle-xmark fa-2xl heart-remove"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)} */}
                {wishListDetails?.map((product) => <ProductCard key={product.id} product={product} />)}
            </div> : <>
                <div className='row justify-content-center my-5'>
                    <div className='col-md-8'>
                        <img className='w-100' height={500} src={emptyWishList} alt="" />
                    </div>
                </div>
            </>
        }
    </>
}
