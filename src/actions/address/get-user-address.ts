'use server'

import prisma from "@/lib/prisma";

export const getUserAddress = async(userId: string) => {
    try {
        
        const userAddress = await prisma.userAddress.findUnique({ where: { userId }});

        if( !userAddress )
            return  {
                ok: true,
                data: {}
            };

        const { countryId, address2, userId: _, ...rest } = userAddress;

        return {
            ok: true,
            data: {
                ...rest,
                country: countryId,
                address2: address2 ?? ''
            }
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'Ha ocurrido un error',
            data: {}
        }
    }
}