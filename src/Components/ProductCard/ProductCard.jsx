import React, { useContext, useEffect, useState } from 'react'
import styles from './ProductCard.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { cartContext } from '../../Context/CartContext.js';
import toast from 'react-hot-toast';

export default function ProductCard({ product, showSubcategory }) {

    let { addToCart,
        setNumOfCartItems,
        addToWishList,
        removeItemFromWishList,
        setNumOfFavoriteItems,
        numOfFavoriteItems,
        wishListDetails,
        getLoggedWishList,
        setWishListDetails, } = useContext(cartContext);

    const [isFavorite, setIsFavorite] = useState(false);

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function addProductToCart(productId) {
        let res = await addToCart(productId);
        if (res?.data?.status === 'success') {
            setNumOfCartItems(res?.data?.numOfCartItems);
            toast.success(res?.data?.message, {
                duration: 2000,
                position: 'top-center'
            });
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() :
                toast.error("Failed to add Product", { duration: 2000, });
        }
    }

    function checkFavorite() {
        wishListDetails?.forEach(element => {
            if (element?._id == product._id) {
                setIsFavorite(true);
            }
        });
    }

    async function deleteProductFromWishList(productId) {
        let res = await removeItemFromWishList(productId);
        if (res?.data?.status === 'success') {
            // setNumOfFavoriteItems(res?.data?.count);
            setIsFavorite(false);
            toast.success('Item removed Successfuly');
            getWishListInfo();
        }
        else {
            (res?.response?.data?.message === 'Expired Token. please login again') ? getOut() : toast.error("Failed to remove item");
        }
    }

    async function addProductToWishList(productId) {
        let res = await addToWishList(productId);
        if (res?.data?.status === 'success') {
            // setNumOfFavoriteItems(res?.data?.data?.length);
            setIsFavorite(true);
            toast.success(res?.data?.message);
            getWishListInfo();
        }
        else {
            (res?.response?.data?.message === 'Expired Token. please login again') ? getOut() : toast.error("Failed to remove item");
        }
    }

    async function getWishListInfo() {
        let res = await getLoggedWishList();
        if (res?.data?.status === 'success') {
            setNumOfFavoriteItems(res?.data?.count);
            setWishListDetails(res?.data?.data);
        }
        else {
            (res?.response?.data?.message === 'Expired Token. please login again' || res?.request?.statusText === 'Unauthorized') ? 
                getOut() : setNumOfFavoriteItems(0);
        }
    }

    useEffect(() => {
        checkFavorite();
    }, []);


    return <>
        <div className='col-6 col-md-4 col-lg-3 col-xl-2 my-3'>
            <div className="product cursor-pointer px-2 pt-2 pb-3">
                <Link to={`/productdetails/${product._id}`}>
                    <img className='w-100' src={product.imageCover} alt="" />
                </Link>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <div>
                        <div className="text-main fw-bold font-sm">{showSubcategory ? product.subcategory[0]?.name : product.category.name}</div>
                        <h3 className='h6 fw-bolder'>{product.title.split(' ').slice(0, 2).join(' ')}</h3>
                    </div>
                    <i className="d-block fa-solid fa-heart fa-lg pe-1 heart"
                        style={{ color: isFavorite ? '#dc3545' : '#bdbdbd' }}
                        onClick={() => {
                            isFavorite ? deleteProductFromWishList(product._id) : addProductToWishList(product._id);
                        }}></i>
                </div>
                <div className='d-flex justify-content-between mb-2'>
                    <span className='text-muted'>{product.price} EGP</span>
                    <span>
                        <i className='fas fa-star rating-color me-1'></i>
                        {product.ratingsAverage}
                    </span>
                </div>
                <button onClick={() => addProductToCart(product.id)} className='btn bg-main text-white w-100 px-0'>
                    <i className="fa-solid fa-cart-plus fa-lg pe-2"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    </>
}
