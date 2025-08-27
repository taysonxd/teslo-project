'use server'

import { Gender } from "@/generated/prisma";
import prisma from "@/lib/prisma"

interface PaginationProps {
    gender?: string;
    page?: number;
    take?: number;    
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    gender = ''
}: PaginationProps) => {
    
    if( isNaN(Number(page)) ) page = 1;
    if( Number(page) < 1 ) page = 1;
    
    if( isNaN(Number(take)) ) take = 12;
    if( Number(take) < 1 ) take = 12;
        
    try {
        
        const whereClause = gender.length ? { gender: gender as Gender } : {};
        const products = await prisma.product.findMany({
            take,
            skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            },
            where: whereClause
        });
            
        const productsCount = await prisma.product.count({ where: whereClause });
        const totalPages = Math.ceil( productsCount / take)
    
        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.ProductImage.map(image => image.url)
            }))
        };    
    } catch (error) {
        throw new Error("No se pudo cargar los productos");        
    }
}