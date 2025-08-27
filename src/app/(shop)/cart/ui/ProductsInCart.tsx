'use client';

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {

    const productsInCart = useCartStore(state => state.cart);
    const [loaded, setLoaded] = useState(false);

    const updateProductsQuantityInCart = useCartStore( state => state.updateProductQuantity );
    const removeProduct = useCartStore( state => state.removeProduct );

    useEffect(() => {
      setLoaded(true);
    });
    
    if( !loaded )
        return (<p>Cargando...</p>);

    return (
        <>
        {productsInCart.map((product) => (
            <div key={`${product.slug}-${product.size}`} className="flex">
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
                    <Link
                        className="hover:underline cursor-pointer"
                        href={`/producy/${ product.slug}`}
                    >                        
                        { product.size } - { product.title }
                    </Link>
                    <p>${product.price}</p>
                    <QuantitySelector
                        quantity={product.quantity}
                        onQuantityChanged={value => updateProductsQuantityInCart(product, value)}
                    />
                    <button
                        onClick={() => removeProduct(product) }
                        className="underline mt-3 cursor-pointer"
                    >
                        Remover
                    </button>
                </div>
            </div>
        ))}
        </>
    );
};
