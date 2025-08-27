"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {
  
  const { subTotal, tax, total, totalItems } = useCartStore(
    useShallow((state) => state.getOrderSummary())
  );
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if( totalItems === 0 && loaded)
      router.push('/empty');
  }, [ totalItems, loaded]);

  if (!loaded) return <p>Cargando...</p>;

  return (
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
  );
};
