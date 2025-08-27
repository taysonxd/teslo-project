'use client';

import { ProductImage } from "@/components";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {

    const productsInCart = useCartStore(state => state.cart);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      setLoaded(true);
    });
    
    if( !loaded )
        return (<p>Cargando...</p>);

    return (
        <>
        {productsInCart.map((product) => (
            <div key={`${product.slug}-${product.size}`} className="flex my-1">
                <ProductImage
                    src={ product.image }
                    alt={product.title}
                    width={100}
                    height={100}
                    className="mr-5 rounded"
                    style={{
                        width: "100px",
                        height: "100px",
                    }}
                />

                <div>
                    <span>                        
                        { product.size } - { product.title } ({ product.quantity })
                    </span>
                    <p className="font-bold">{ currencyFormat(product.price * product.quantity) }</p>
                </div>
            </div>
        ))}
        </>
    );
};
