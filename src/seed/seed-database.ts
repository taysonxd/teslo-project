
import bcryptjs from 'bcryptjs'

import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';
import { Category } from '@prisma/client';

async function main() {
    
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();    
    await prisma.category.deleteMany();
    
    await prisma.country.deleteMany();
    
    const { categories, products, users } = initialData;

    await prisma.country.createMany({
        data: countries
    })

    await prisma.user.createMany({
        data: users.map(user => ({
            ...user,
            password: bcryptjs.hashSync(user.password)
        }))
    });
    
    await prisma.category.createMany({
        data: categories.map(name => ({ name }))
    })
    const categoriesData = await prisma.category.findMany();

    const categoriesMap = categoriesData.reduce((map, category: Category) => {                
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    products.forEach(async (product) => {
        const { type, images, ...rest } = product;

        const productDb= await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type.toLowerCase()],
            }
        });

        const imagesData = images.map(image => ({
            url: image,
            productId: productDb.id
        }));

        await prisma.productImage.createMany({
            data: imagesData            
        });
    });

    console.log("SEED ejecutado");    
}

(() => {
    if( process.env.NODE_ENV === 'production' ) return;
    
    main();
})()