'use client'

import { OrderStatus, PayPalButton } from "@/components";
import { Address } from "@/interfaces";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";

interface Props {
    order: {
        id: string;
        subTotal: number;
        tax: number;
        total: number;
        itemsInOrder: number;
        isPaid: boolean;
        createdAt: Date;
        OrderAddress: Address;
        OrderItem: {
            id: string;
            productId: string;
            quantity: number;
            size: string;
            price: number;
            image: string;
        }[]
    };
}

export const OrderSummary = ({ order }: Props) => {
        
    const [address, setAddress] = useState<Address>();        
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {                
        if( !!order ){
            setAddress(order.OrderAddress);
            setLoaded(true);
        }
    }, [order]);
    
    // if (!loaded) return (<p>Cargando...</p>);
    
    return (
      <div className="bg-white rounded-xl shadow-xl p-7">
        <h2 className="text-2xl mb-2">Resumen de la orden</h2>

        <div className="mb-10 h-[100px]">
          <p className="text-xl">
            {address?.firstName} {address?.lastName}
          </p>
          <p>{address?.address}</p>
          <p>{address?.address2}</p>
          <p>
            {address?.city}, {address?.countryId}
          </p>
          <p>{address?.postalCode}</p>
          <p>{address?.phone}</p>
        </div>

        <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

        <h2 className="text-2xl mb-2">Resumen de la orden</h2>
        <div className="grid grid-cols-2">
          <span>No. Productos</span>
          <span className="text-right">
            {order.subTotal === 1
              ? "1 artículo"
              : `${order.itemsInOrder} artículos`}
          </span>

          <span>Subtotal</span>
          <span className="text-right">{currencyFormat(order.subTotal)}</span>

          <span>Impuestos</span>
          <span className="text-right">{currencyFormat(order.tax)}</span>

          <span className="mt-5 text-2xl">Total</span>
          <span className="mt-5 text-2xl text-right">
            {currencyFormat(order.total)}
          </span>
        </div>

        <div className="mt-5 mb-2 w-full">
          {order.isPaid ? (
            <OrderStatus isPaid={order!.isPaid} />
          ) : (
            <PayPalButton orderId={order!.id} amount={order!.total} />
          )}
        </div>
      </div>
    );
}
