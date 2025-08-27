'use server'

import { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async(transactionId: string) => {
    
    try {
        const authToken = await getPaypalBearerToken();
        
        if( !authToken )
            return {
                ok: false,
                message: 'No se pudo obtener token de verificación'
            };

        const res = await verifyPayment(transactionId, authToken);

        if( !res )
            return {
                ok: false,
                message: 'Error al verificar el pago'
            };

        const { status, purchase_units } = res;
        
        if( status !== 'COMPLETED' )
            return {
                ok: false,
                message: 'El pago aun no se ha completado'
            };
        
        const { invoice_id: orderId } = purchase_units[0];
        try {
            
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    isPaid: true,
                    paidAt: new Date()
                }
            });

            revalidatePath(`/orders/${ orderId }`);

            return {
                ok: true
            };
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                message: '500 - El pagono se pudo realizar'
            };
        }        
    } catch (error: any) {
        console.error(error);
        return {
            ok: false,
            message: error.message
        }
    }
}

const verifyPayment = async(transactionId: string, authToken: string): Promise<PaypalOrderStatusResponse|null> => {

    const ordersUrl = process.env.PAYPAL_ORDERS_URL ?? '';

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${authToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders    
    };

    try {

        const resp = await fetch(`${ordersUrl}/${transactionId}`, {
            ...requestOptions,
            cache: 'no-store'
        }).then(r => r.json());

        return resp;
    } catch (error) {
        console.error(error);
        return null;
    }

};

const getPaypalBearerToken = async() => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        'utf-8'
    ).toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${ base64Token }`);    

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded        
    };

    try {                
        const result = await fetch(oauth2Url, {
            ...requestOptions,
            cache: 'no-store'
        }).then(r => r.json());

        return result.access_token;
    } catch (error) {
        console.error(error);
        return null;
    }
};