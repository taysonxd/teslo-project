'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async(id: string) => {

    const session = await auth();
        
    try {

        if( !session?.user )        
            throw new Error("No hay sesión activa");        
        
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                },
                OrderAddress: true
            }
        });

        if( !order )
            throw new Error(`Orden #${id} no encontrada`);

        if( session?.user.role !== 'admin' && order.userId !== session?.user.id )
            throw new Error(`Orden #${id} no encontrada`);
                
        return {
            ok: true,
            data: order
        };
    } catch (error: any) {
        console.error(error);
        return {
            ok: false,
            message: error?.message
        }
    }

};