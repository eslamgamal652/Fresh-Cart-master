import React, { useContext, useEffect, useState } from 'react'
import styles from './Products.module.css'
import { Helmet } from 'react-helmet'
import Loader from '../Loader/Loader.jsx';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { useNavigate } from 'react-router-dom';
import { productsContext } from '../../Context/ProductsContext.js';
import ResponsivePagination from 'react-responsive-pagination';
import noProductsImg from '../../assets/NoProducts.svg'

export default function Products() {

    let { getAllProducts, categories, setCategories } = useContext(productsContext);
    const [products, setProducts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterOption, setFilterOption] = useState('');
    const [selectedFilteredOption, setSelectedFilteredOption] = useState('select option');
    const [categoryOption, setCategoryOption] = useState('');
    const [selectedCategoryOption, setSelectedCategoryOption] = useState('select option');
    const sortOptions = {
        '&sort=': 'select option',
        '&sort=price': 'Lowest Price',
        '&sort=-price': 'Highest Price',
        '&sort=ratingsAverage': 'Lowest Rating',
        '&sort=-ratingsAverage': 'Highest Rating',
        '&sort=-sold': 'Best Seller',
    };
    const categoryOptions = {
        'all': 'All',
    }


    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getProducts(filter = '', category = '') {
        setIsLoading(true);
        let res = await getAllProducts(`page=${currentPage}&limit=24${filter}${category}`);
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
        getProducts(filterOption, categoryOption);
    }, [currentPage]);


    function handlePageChange(page) {
        setCurrentPage(page);
    }

    function handleSortSelection(e) {
        setSelectedFilteredOption(sortOptions[e.target.value]);
        setFilterOption(e.target.value)
        getProducts(e.target.value, categoryOption)
    }

    function handleCategorySelection(e) {
        categories?.forEach(category => {
            categoryOptions['&category[in]='+category?._id] = category.name;
        });
        setSelectedCategoryOption(categoryOptions[e.target.value]);
        setCategoryOption(e.target.value === 'all' ? '' : e.target.value)
        getProducts(filterOption, e.target.value === 'all' ? '' : e.target.value)
    }

    function resetAll(){
        setSelectedFilteredOption('select option');
        setFilterOption('')
        setSelectedCategoryOption('select option')
        setCategoryOption('');
        getProducts()
    }
    
    if(currentPage > totalPages) setCurrentPage(1);

    if (isLoading) {
        return <Loader />
    }

    return <>
        <Helmet>
            <title>Products</title>
        </Helmet>
        <div className="row py-5">
            <div className='row d-flex'>
                <h2 className='col-md-4 fw-simibold' >
                    <span className='cursor-pointer' onClick={resetAll}>All Products</span>
                </h2>
                <div className='col-md-8'>
                    <div className='row'>
                        <div className='col-md-6 d-flex align-items-center mb-2'>
                            <h5 className='my-0 mx-2'>Category</h5>
                            <div className="dropdown" >
                                <select className="form-control" onChange={handleCategorySelection} >
                                    <option value="">{selectedCategoryOption}</option>
                                    <option value="all">All</option>
                                    {categories?.map((category) =>
                                        <option key={category?._id} value={`&category[in]=${category?._id}`} h={category?.name} >{category?.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className='col-md-6 d-flex align-items-center mb-2'>
                            <h5 className='my-0 mx-2'>Sort by</h5>
                            <div className="dropdown" >
                                <select className="form-control" onChange={handleSortSelection} >
                                    <option value="">{selectedFilteredOption}</option>
                                    <option value="&sort=price">Lowest Price</option>
                                    <option value="&sort=-price">Highest Price</option>
                                    <option value="&sort=ratingsAverage">Lowest Rating</option>
                                    <option value="&sort=-ratingsAverage">Highest Rating</option>
                                    <option value="&sort=-sold">Best Seller</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {products?.length>0 ? products?.map((product) => <ProductCard key={product?._id} product={product} />): 
            <div className='d-flex justify-content-center pt-5 pb-2'>
                <img className='w-50' src={noProductsImg} alt="" />
            </div>
            }


            {totalPages > 1? <ResponsivePagination
                total={totalPages}
                current={currentPage}
                onPageChange={page => handlePageChange(page)}
                maxWidth={''}
                extraClassName='justify-content-center'
            />: null}
            
        </div>
    </>
}
