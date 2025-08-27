'use client';

import { ProductImage } from "@/components";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
    items: {
        id: string;
        product: {
            title: string;
            slug: string;
            ProductImage: {
                url: string;
            }[]
        }
        productId: string;
        quantity: number;
        size: string;
        price: number;        
    }[]
}

export const ProductsInCart = ({ items }: Props) => {
    
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      setLoaded(true);
    });
    
    if( !loaded )
        return (<p>Cargando...</p>);
        
    return (
        <>
            {items.map((item) => (
                <div key={`${item.product.slug}-${item.size}`} className="flex my-1">
                    <ProductImage
                        src={ item.product.ProductImage[0].url }
                        alt={item.product.title}
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
                            { item.size } - { item.product.title } ({ item.quantity })
                        </span>
                        <p className="font-bold">Subtotal: { currencyFormat(item.price * item.quantity) }</p>
                    </div>
                </div>
            ))}
        </>
    );
};
