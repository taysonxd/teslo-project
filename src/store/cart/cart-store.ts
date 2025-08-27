import { cartProduct } from "@/interfaces/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: cartProduct[];

    getTotalItems: () => number;
    getOrderSummary: () => {
        subTotal: number;
        tax: number;
        total: number;
        totalItems: number;
    };

    addProductToCart: (product: cartProduct) => void;
    updateProductQuantity: (product: cartProduct, quantity: number) => void;
    removeProduct: (product: cartProduct) => void;

    clearCart: () => void;
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } =get();

                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            getOrderSummary: () => {
                const { cart, getTotalItems } = get();

                const subTotal = cart.reduce((total, product) => (product.price * product.quantity) + total, 0);
                const tax = subTotal * 0.15;
                const total = subTotal + tax;

                return {
                    subTotal,
                    tax,
                    total,
                    totalItems: getTotalItems()
                };               
            },
            addProductToCart: (product: cartProduct) => {
                const { cart } = get();

                const productInCart = cart.some((item: cartProduct) => item.id === product.id && item.size === product.size);

                if ( !productInCart )
                    return set({ cart: [ ...cart, product ] });

                const updatedProducts = cart.map( item => {
                    if( item.id === product.id && item.size === product.size )
                        return { ...item, quantity: item.quantity + product.quantity };

                    return item;
                });
                
                set({ cart: updatedProducts });
            },
            updateProductQuantity: (product: cartProduct, quantity: number) => {
                const { cart } = get();

                const updatedProducts = cart.map( item => {
                    if( item.id === product.id && item.size === product.size )
                        return { ...item, quantity: quantity };

                    return item;
                });
                
                set({ cart: updatedProducts });
            },
            removeProduct: ( product: cartProduct ) => {
                const { cart } = get();

                const cartUpdated = cart.filter(item => item.id !== product.id || item.size !== product.size);

                set({ cart: cartUpdated });
            },
            clearCart: () => set({ cart: []})
    }),
    {
        name: 'shopping-cart'
    })
)