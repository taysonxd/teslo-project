'use server'

import prisma from "@/lib/prisma";

export const setTransactionId = async (orderId: string, transactionId: string) => {

    try {
        
        const order = await prisma.order.update({            
            where: { id: orderId },
            data: { transactionId }
        });

        if( !order )
            throw new Error(`Orden ${orderId} no encontrada`);            

        return {
            ok: true,
            data: order
        };
    } catch (error: any) {
        console.error(error);
        return {
            ok: false,
            message: error.message
        }
    }
};