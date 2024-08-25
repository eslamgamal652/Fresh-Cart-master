import React, { useContext, useEffect, useState } from 'react'
import styles from './ProductDetails.module.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { cartContext } from '../../Context/CartContext.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import Loader from '../Loader/Loader.jsx';
import { productsContext } from '../../Context/ProductsContext.js';
import NotFound from '../NotFound/NotFound.jsx';


export default function ProductDetails() {

    let { getProductDeatails } = useContext(productsContext);
    let { addToCart,
        getLoggedWishList,
        addToWishList,
        removeItemFromWishList,
        setNumOfFavoriteItems,
        numOfFavoriteItems,
        wishListDetails,
        setWishListDetails, } = useContext(cartContext);

    const [productDetails, setProductDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    let params = useParams();

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function addProductToCart(productId) {
        let res = await addToCart(productId);
        if (res?.data?.status === 'success') {
            toast.success(res?.data?.message);
        }
        else {
            (res?.response?.data?.message == 'Expired Token. please login again') ? getOut() : toast.error("Failed to add Product");
        }
    }

    async function getDetails(id) {
        setIsLoading(true);
        let res = await getProductDeatails(id);
        if (res?.data?.data?._id !== null) {
            setProductDetails(res?.data?.data);
        }
        setIsLoading(false);
    }

    function checkFavorite() {
        wishListDetails?.forEach(element => {
            if (element?._id == params.id) {
                setIsFavorite(true);
            }
        });
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

    async function deleteProductFromWishList(productId) {
        let res = await removeItemFromWishList(productId);
        if (res?.data?.status === 'success') {
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
            setIsFavorite(true);
            toast.success(res?.data?.message);
            getWishListInfo();
        }
        else {
            (res?.response?.data?.message === 'Expired Token. please login again') ? getOut() : toast.error("Failed to remove item");
        }
    }

    useEffect(() => {
        getDetails(params.id);
        checkFavorite();
    }, []);


    const settings = {
        dots: true,
        infinity: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    }

    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>{productDetails?.title ? productDetails?.title : 'Product Details'}</title>
        </Helmet>
        <div className="row justify-content-center align-items-center py-5">
            {productDetails == null ? <NotFound /> : <>
                <div className="col-md-4 mb-5">
                    <Slider {...settings}>
                        {productDetails?.images?.map((img, index) => <img key={index} className='w-100' src={img} alt="" />)}
                    </Slider>
                </div>
                <div className="col-md-8">
                    <h3>{productDetails?.title}</h3>
                    <p className='text-muted p-2'>{productDetails?.description}</p>
                    <div className='d-flex justify-content-between align-items-center'>
                        <span className='text-muted fs-4'>{productDetails?.price} EGP</span>
                        <span className='d-flex align-items-center'>
                            <i className='fas fa-star rating-color fs-4 pe-2'></i>
                            {productDetails?.ratingsAverage}
                        </span>
                    </div>
                    <div className='row mt-3 px-3'>
                        <button onClick={() => addProductToCart(productDetails._id)} className='col-10 col-md-11 btn bg-main text-white px-0 position-relative'>
                            <i className="fa-solid fa-cart-plus fa-xl ms-3 position-absolute start-0 top-50 bottom-50"></i>
                            Add to Cart
                        </button>
                        <div className='col-2 col-md-1 d-flex justify-content-center px-0'>
                            <button onClick={() => {
                                isFavorite ? deleteProductFromWishList(productDetails._id) : addProductToWishList(productDetails._id);
                            }} className='btn text-white w-100 p-0'>
                                <i className="fa-solid fa-heart fa-2xl heart" style={{ color: isFavorite ? '#dc3545' : '#bdbdbd' }}></i>
                            </button>
                        </div>
                    </div>
                    <div className='text-muted mt-4'>
                        <h6 className='mb-3'>
                            Category:
                            <Link className='ps-2' to={`/categories/${productDetails?.category?._id}`}>
                                {productDetails?.category?.name}
                            </Link>
                        </h6>
                        <h6 className='mb-3'>
                            Brand:
                            <Link className='ps-2' to={`/brands/${productDetails?.brand?._id}`}>
                                {productDetails?.brand?.name}
                            </Link>
                        </h6>
                    </div>
                </div>
            </>}
        </div>
    </>
}
