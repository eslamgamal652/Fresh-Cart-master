import React, { useContext, useEffect, useState } from 'react'
import styles from './CategoryProducts.module.css'
import { productsContext } from '../../Context/ProductsContext.js';
import Loader from '../Loader/Loader.jsx';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { useNavigate } from 'react-router-dom';
import ResponsivePagination from 'react-responsive-pagination';

export default function CategoryProducts({ categoryId }) {

    let { getProductsInCustemList } = useContext(productsContext);
    const [products, setProducts] = useState(null);
    const [showSubcategory, setShowSubcategory] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getProducts(categoryId) {
        setIsLoading(true);
        let res = await getProductsInCustemList(categoryId, 'category');
        if (res?.data?.results > 0) {
            setProducts(res?.data?.data);
            setTotalPages(res?.data?.metadata?.numberOfPages);
        }
        else {
            if (res?.response?.data?.message === 'Expired Token. please login again') getOut();
            else{
                setProducts(null);
                setTotalPages(1);
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getProducts(categoryId);
    }, []);


    function handlePageChange(page) {
        setCurrentPage(page);
    }

    if(currentPage > totalPages) setCurrentPage(1);

    if (isLoading) {
        return <Loader />
    }

    return <>
        <div className='row my-4'>
            {products?.map((product) => <ProductCard key={product._id} product={product} showSubcategory={showSubcategory} />)}
        </div>

        {totalPages > 1? <ResponsivePagination
                total={totalPages}
                current={currentPage}
                onPageChange={page => handlePageChange(page)}
                maxWidth={''}
                extraClassName='justify-content-center'
            />: null}
    </>
}
