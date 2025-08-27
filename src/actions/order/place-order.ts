'use server'

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces"
import prisma from "@/lib/prisma";

interface ProductsToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (address: Address, productsIds: ProductsToOrder[]) => {

    const session = await auth();
    const userId = session?.user.id;

    if( !userId )
        return {
            ok: false,
            message: 'No hay sesión activa'
        };

    const productsOrdered = await prisma.product.findMany({
        where: {
            id: {
                in: productsIds.map(p => p.productId)
            }
        }
    })

    const itemsInOrder = productsIds.reduce((total, p) => total + p.quantity, 0);
    
    const totals = productsIds.reduce((totals, p) => {
        const quantity = p.quantity;
        const product = productsOrdered.find(product => product.id === p.productId );

        if( !product )
            throw new Error(`${p.productId} no existe`);
        
        const subTotal = quantity * product.price;

        totals.subtotal += subTotal
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;            
                
        return totals; 
    }, { subtotal: 0, tax: 0, total: 0 });
    
    try {
        const prismaTx = await prisma.$transaction(async(tx) => {

            const productsUpdatePromises = productsOrdered.map(product => {
                const quantityOrdered = productsIds.filter(p => p.productId === product.id)
                                                    .reduce((acc, item) => acc + item.quantity, 0);

                if( quantityOrdered === 0 )
                    throw new Error(`${product.id} no tiene una cantidad valida`);

                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        inStock: {
                            decrement: quantityOrdered
                        }
                    }
                });
            });

            const updatedProducts = await Promise.all(productsUpdatePromises);

            updatedProducts.forEach(product => {
                if( product.inStock < 0 )
                    throw new Error(`${product.title} no tiene inventario suficiente`);
            });

            const order = await tx.order.create({
                data: {
                    userId: userId,
                    subTotal: totals.subtotal,
                    tax: totals.tax,
                    total: totals.total,
                    itemsInOrder: itemsInOrder,
                    OrderItem: {
                        createMany: {
                            data: productsIds.map(p => ({
                                productId: p.productId,
                                quantity: p.quantity,
                                size: p.size,
                                price: productsOrdered.find(product => product.id === p.productId)!.price
                            }))
                        }
                    }
                }
            })

            const { country, id, ...rest } = address;        
                        
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...rest,
                    orderId: order.id,
                    countryId: country!                
                }
            });

            return {
                updatedProducts,
                order,
                orderAddress
            };
        });

        return {
            ok: true,
            data: prismaTx
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }

    
    
}