import React, { useContext, useEffect, useState } from 'react'
import styles from './Categories.module.css'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { productsContext } from '../../Context/ProductsContext.js'
import Loader from '../Loader/Loader.jsx'
import CategoryProducts from '../CategoryProducts/CategoryProducts.jsx'


export default function Categories() {

    let { getCategoryDeatails } = useContext(productsContext);
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState(null);
    let params = useParams();  // params.id

    async function getcategory() {
        let res = await getCategoryDeatails(params.id);
        if (res?.data != null) {
            setCategory(res?.data?.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getcategory();
    }, []);


    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>{category?.name}</title>
        </Helmet>
        <div className='row d-flex justify-content-evenly mt-4'>
            <div className='col-11 col-md-3 mt-2 card'>
                <img className='w-100 pt-2' src={category?.image} alt="" />
                <h1 className='ms-2 text-center'>{category?.name}</h1>
            </div>
            <CategoryProducts categoryId={params.id} />
        </div>
    </>
}
