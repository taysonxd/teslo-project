'use client'
import { useState } from 'react';
import Image from 'next/image';

import { Swiper as swiperObject } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
    title: string;
    images: string[];
    className?: string;
}

export const ProductMobileSlideshow = ({ title, images, className}: Props) => {
    const [ thumbsSwiper, setThumbsSwiper ] = useState<swiperObject>();

    return (
        <div className={ className }>
            <Swiper
                style={{                    
                    'width': '100vw',
                    'height': '500px'
                }}
                pagination
                autoplay={{
                    delay: 2500
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Autoplay, Pagination]}
                className="mySwiper2"
            >
            {
                images.map( image => (
                    <SwiperSlide key={image}>
                        <ProductImage
                            src={ image }
                            alt={ title }
                            width={1024}
                            height={800}
                            className='object-fill'
                        />
                    </SwiperSlide>                
                ))
            }
            </Swiper>            
        </div>
    );
}
