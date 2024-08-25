import React, { useContext, useEffect, useState } from 'react'
import styles from './FeaturedProducts.module.css'
import axios from 'axios';
import Loader from '../Loader/Loader.jsx';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { productsContext } from '../../Context/ProductsContext.js';
import { useNavigate } from 'react-router-dom';

export default function FeaturedProducts() {

    let { getAllProducts } = useContext(productsContext);
    const [products, setProducts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getProducts() {
        setIsLoading(true);
        let res = await getAllProducts('limit=18');
        if (res?.data?.results > 0) {
            setProducts(res?.data?.data);
        }
        else {
            if(res?.response?.data?.message == 'Expired Token. please login again') getOut();
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, []);


    if (isLoading) {
        return <Loader />
    }

    return <>
        <div className="row">
            {products?.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
    </>
}
