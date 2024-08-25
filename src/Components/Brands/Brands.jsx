import React, { useContext, useEffect, useState } from 'react'
import styles from './Brands.module.css'
import { Helmet } from 'react-helmet'
import { productsContext } from '../../Context/ProductsContext.js';
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader.jsx';
import BrandProducts from '../BrandProducts/BrandProducts.jsx';

export default function Brands() {
    let { getBrandDeatails } = useContext(productsContext);
    const [isLoading, setIsLoading] = useState(true);
    const [brand, setBrand] = useState(null);
    let params = useParams();  // params.id

    async function getbrand() {
        let res = await getBrandDeatails(params.id);
        if (res?.data != null) {
            setBrand(res?.data?.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getbrand();
    }, []);


    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>{brand?.name}</title>
        </Helmet>
        <div className='row d-flex justify-content-evenly mt-4'>
            <div className='col-11 col-md-3 mt-2 card'>
                <img className='w-100 pt-2' src={brand?.image} alt="" />
                <h1 className='ms-2 text-center'>{brand?.name}</h1>
            </div>
            <BrandProducts brandId={params.id} />
        </div>
    </>
}
