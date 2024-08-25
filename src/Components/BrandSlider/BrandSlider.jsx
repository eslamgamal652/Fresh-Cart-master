import React, { useContext, useEffect, useState } from 'react'
import styles from './BrandSlider.module.css'
import Loader from '../Loader/Loader.jsx';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import { productsContext } from '../../Context/ProductsContext.js';

export default function BrandSlider() {
    
    let { getAllBrands } = useContext(productsContext);

    const [brands, setBrands] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    let navigate = useNavigate();
    function getOut() {
        localStorage.removeItem('userToken');
        navigate('/');
    }

    async function getbrands() {
        setIsLoading(true);
        let res = await getAllBrands();
        if (res?.data?.results > 0) {
            setBrands(res?.data?.data);
        }
        else {
            if(res?.response?.data?.message == 'Expired Token. please login again') getOut();
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getbrands();
    }, []);

    const settings = {
        dots: true,
        infinity: true,
        speed: 500,
        slidesToShow: 12,
        slidesToScroll: 8,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 10,
                    slidesToScroll: 8,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 8,
                    slidesToScroll: 6,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                    dots: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false,
                }
            },
        ]
    }


    if (isLoading) {
        return <Loader />
    }

    return <>
        <Slider {...settings}>
            {brands?.map((brand) => <Link className='d-flex justify-content-center' key={brand._id} to={`brands/${brand._id}`}>
                <img height={60} className='w-75 slide-box' src={brand.image} alt="" />
            </Link>)}
        </Slider>
    </>
}
