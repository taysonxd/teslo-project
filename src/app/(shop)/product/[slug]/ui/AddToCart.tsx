'use client'

import { SizeSelector, QuantitySelector } from '@/components'
import type { cartProduct, Product, Size } from '@/interfaces/product.interface'
import { useCartStore } from '@/store'
import React, { useState } from 'react'

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore(state => state.addProductToCart);

  const [size, setSize] = useState<Size|undefined>();
  const [quantity, setQuantity] = useState(1);
  const [posted, setPosted] = useState(false)

  const addToCart = () => {
    setPosted(true);

    if( !size ) return;

    const cartProduct: cartProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      size: size,
      quantity: quantity,
      image: product.images[0]
    };

    addProductToCart(cartProduct);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}
      {/* Selector de tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />

      {/* Selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      <button onClick={() => addToCart()} className="btn-primary my-5">
        Agregar la carrito
      </button>
    </>
  );
}
