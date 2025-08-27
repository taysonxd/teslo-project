'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async() => {

    const session = await auth();

    if( session?.user.role !== 'admin' )
        return {
            ok: false,
            message: 'No hay sesión activa'
        };

    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            OrderAddress: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    return {
        ok: true,
        data: orders
    }
};