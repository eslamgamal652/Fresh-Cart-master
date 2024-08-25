import React from 'react'
import styles from './MainSlider.module.css'

import slide_1 from '../../assets/images/slider-image-1.jpeg'
import slide_2 from '../../assets/images/slider-image-2.jpeg'
import slide_3 from '../../assets/images/slider-image-3.jpeg'
import slide_4 from '../../assets/images/slider-image-4.jpeg'
import Slider from 'react-slick'

export default function MainSlider() {

    const settings = {
        dots: true,
        infinity: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    }

    return <>
        <div className="row g-0 mb-5">
            <div className="col-md-9">
            <Slider {...settings} >
                <img height={400} className='w-100 main-img-slide' src={slide_1} alt="" />
                <img height={400} className='w-100 main-img-slide' src={slide_2} alt="" />
                <img height={400} className='w-100 main-img-slide' src={slide_3} alt="" />
            </Slider>
            </div>
            <div className="col-md-3 d-none d-md-block">
                <img height={200} className='w-100' src={slide_1} alt="" />
                <img height={200} className='w-100' src={slide_4} alt="" />
            </div>
        </div>
    </>
}
