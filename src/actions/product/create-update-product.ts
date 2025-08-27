'use server'

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
    id: z.uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform( value => Number(value.toFixed(2)) ),
    inStock: z.coerce.number().min(0).transform( value => Number(value.toFixed(0)) ),
    sizes: z.coerce.string().transform( value => value.split(',')),
    tags: z.string(),
    gender: z.enum(Gender),
    categoryId: z.uuid()    
});

export const createUpdateProduct = async (formData: FormData) => {
    const dataToSave = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(dataToSave)

    if( !productParsed.success ) {
        console.error(productParsed.error);
        return {
            ok: false            
        };
    }

    const product = productParsed.data;
    product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();
    
    const { id, ...restProduct } = product;

    try {
        
        const prismaTx = await prisma.$transaction( async (tx) => {
            let product: Product;
            const arrayTags = restProduct.tags.split(', ').map( tag => tag.trim().toLowerCase() );

            if( id ) {
                
                product = await tx.product.update({
                    where: { id },
                    data: {
                        ...restProduct,
                        sizes: {
                            set: restProduct.sizes as Size[]
                        },
                        tags: {
                            set: arrayTags
                        }
                    }
                });            
            } else {

                product = await tx.product.create({
                    data: {
                        ...restProduct,
                        sizes: {
                            set: restProduct.sizes as Size[]
                        },
                        tags: {
                            set: arrayTags
                        }
                    }
                });
            }
                        
            if( formData.getAll('images') ) {
                const images = await uploadImages( formData.getAll('images') as File[] );
                
                if( !images )
                    throw new Error("No se pudieron cargar las imagenes");                    
                
                await prisma.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id 
                    }))
                })
                    
            }

            return { product };
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${ product.slug }`);
        revalidatePath(`/products/${ product.slug }`);

        return {
            ok: true,
            product: prismaTx.product
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'No se puedo crear/actualizar, revisar los logs'
        }
    }
};

const uploadImages = async( images: File[]) => {
    try {
        const uploadPromises = images.map( async(image) => {
            try {                
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');
    
                return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`)
                                        .then( r => r.secure_url);
            } catch (error) {
                console.error(error);
                return null;
            }
        });

        const uploadedImages = await Promise.all( uploadPromises );
        return uploadedImages;
    } catch (error) {
        console.error(error);
        return null;
    }
}