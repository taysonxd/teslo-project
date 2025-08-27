'use server'

import { Address } from "@/interfaces"
import prisma from "@/lib/prisma";

export const setUserAddress = async(address: Address, userId: string) => {
    try {                
        const newAddress= await createOrUpdateUserAddress(address, userId);        

        return {
            ok: true,
            data: newAddress
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'Error al almacenar los datos'
        };
    }
}

const createOrUpdateUserAddress = async (address: Address, userId: string) => {
    try {

        const addressFound = await prisma.userAddress.findUnique({
            where: { userId }
        });

        const { country, ...rest } = address;
        const newAddress = {
            userId,
            ...rest,
            countryId: country
        }

        if( !addressFound ) {
            const addressSaved = prisma.userAddress.create({
                data: newAddress
            })
            return addressSaved;
        }

        const addressUpdated = prisma.userAddress.update({
            where: { userId },
            data: newAddress
        });
        return addressUpdated;
    } catch (error) {
        console.error(error);
        throw new Error("No se pudo almacenar en la base de datos");        
    }
}