
'use server'

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async(imageId: number, imageUrl: string) => {

    if( !imageUrl.startsWith('http') )
        return {
            ok: false,
            message: 'No se puede eliminar imagen del FS'
        };

    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

    try {
                
        await cloudinary.uploader.destroy( imageName );

        const imageDeleted = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            include: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${ imageDeleted.product.slug }`);
        revalidatePath('/');
        revalidatePath(`/product/${ imageDeleted.product.slug }`);

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'     
        };
    }

};