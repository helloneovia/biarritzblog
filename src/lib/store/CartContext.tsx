"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
    id: string; // Unique combination of productId + size
    productId: number;
    name: string;
    image: string;
    bundle: string;
    size: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "id">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Hydrate cart from local storage
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (newItem: Omit<CartItem, "id">) => {
        const id = `${newItem.productId}-${newItem.size}`;

        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === id);

            if (existingItem) {
                // If item exists, augment quantity
                return currentItems.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
                );
            }
            // Add new item
            return [...currentItems, { ...newItem, id }];
        });

        toast.success("Ajouté au panier", {
            description: `${newItem.name} (${newItem.size})`,
        });

        setCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(id);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
        );
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalAmount,
                totalItems,
                isCartOpen,
                setCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
