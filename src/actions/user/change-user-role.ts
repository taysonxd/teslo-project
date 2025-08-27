'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async(userId: string, role: string) => {

    const session = await auth();

    if( session?.user.role !== 'admin' )
        return {
            ok: false,
            message: 'No autorizado, debe tener rol de admin'
        };

    const newRole = role == 'admin' ? 'admin' : 'user';

    try {
                
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: newRole
            }        
        });

        revalidatePath(`/admin/users`);
        return {
            ok: true            
        }
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'No se pudo realizar la actualización, revisar los logs'
        }
    }    
};