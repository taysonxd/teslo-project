'use client'

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {

    const router = useRouter();
    const address = useAddressStore( state => state.address );
    const { subTotal, tax, total, totalItems } = useCartStore(
        useShallow((state) => state.getOrderSummary())
    );
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setLoaded(true);
    }, []);

    const onPlaceOrder = async() => {
        setErrorMessage('');
        setIsPlacingOrder(true);

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }));
        
        const resp = await placeOrder(address, productsToOrder);
        
        if( !resp.ok ) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }
        
        setIsPlacingOrder(false);
        clearCart();
        router.replace(`/orders/${ resp.data?.order.id }`);
    }

    if (!loaded) return (<p>Cargando...</p>);

    return (
        <div className='bg-white rounded-xl shadow-xl p-7'>
            <h2 className='text-2xl mb-2'>Dirección de entrega</h2>

            <div className='mb-10'>
                <p className='text-xl'>{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.city}, {address.country}</p>                
                <p>{address.postalCode}</p>
                <p>{address.phone}</p>
            </div>
            
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className='text-2xl mb-2'>Resumen de la orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">
                {subTotal === 1 ? "1 artículo" : `${totalItems} artículos`}
                </span>
        
                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>
        
                <span>Impuestos</span>
                <span className="text-right">{currencyFormat(tax)}</span>
        
                <span className="mt-5 text-2xl">Total</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>
            
            <div className='mt-5 mb-2 w-full'>
                {/* Disclaimer */}
                <p className="mb-5">
                    <span className='tx-xs'>
                        Al hacer click en "Confirmar orden" aceptar nuestras <Link href="/" className='underline'>términos y condiciones</Link> y <Link className='underline' href="#">política de privacidad</Link>
                    </span>
                </p>

                <span className="text-red-500">{ errorMessage }</span>
                <button
                    disabled={isPlacingOrder}
                    onClick={onPlaceOrder}
                    className={clsx({
                        "btn-primary": !isPlacingOrder,
                        "btn-disabled": isPlacingOrder,
                    })}
                >
                    Confirmar orden
                </button>
            </div>
        </div>
    )
}
