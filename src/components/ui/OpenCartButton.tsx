"use client"
import { useCart } from "@/lib/store/CartContext"
import { forwardRef } from "react"

export const OpenCartButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { setCartOpen } = useCart()
    return (
      <button ref={ref} onClick={() => setCartOpen(true)} className={className} {...props}>
        {children}
      </button>
    )
  }
)
OpenCartButton.displayName = "OpenCartButton"
