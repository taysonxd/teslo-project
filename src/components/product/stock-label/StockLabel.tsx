'use client'

import { getStockBySlug } from "@/actions"
import { titleFont } from "@/config/fonts"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export const StockLabel = () => {

    const { slug = '' } = useParams();
    const [inStock, setInStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getStock = async () => {
        const stock = await getStockBySlug(slug as string);
        setInStock(stock);
        setIsLoading(false);
    }

    useEffect(() => {
      getStock();
    }, []);    

    return (
        <>        
        {
            isLoading ? (
                <h1 className={ `${ titleFont.className } antialiased font-bold text-lg bg-gray-200 animate-pulse` }>
                    &nbsp;
                </h1>
            ) : (
                <h1 className={ `${ titleFont.className } antialiased font-bold text-lg` }>
                    Stock: { inStock }
                </h1>
            )
        }   
        </>
    )
}
