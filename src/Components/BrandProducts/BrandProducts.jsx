import React, { useContext, useEffect, useState } from 'react'
import styles from './BrandProducts.module.css'
import { productsContext } from '../../Context/ProductsContext.js';
import Loader from '../Loader/Loader.jsx';
import ProductCard from '../ProductCard/ProductCard.jsx';

export default function BrandProducts({ brandId }) {
    
    let { getProductsInCustemList } = useContext(productsContext);
    const [prodcuts, setProdcuts] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    async function getProducts(brandId) {
        setIsLoading(true);
        let res = await getProductsInCustemList(brandId, 'brand');
        if (res?.data?.results > 0) {
            setProdcuts(res?.data?.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getProducts(brandId);
    }, []);


    if (isLoading) {
        return <Loader />
    }

    return <>
        <div className='row my-4'>
            {prodcuts?.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
    </>
}
