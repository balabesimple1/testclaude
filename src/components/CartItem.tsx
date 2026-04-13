'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { CartItemLocal } from '@/types/database';

interface CartItemProps {
  item: CartItemLocal;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const price = item.product.sale_price ?? item.product.price;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <Link href={`/products/${item.product.id}`} className="shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          {item.product.image_url ? (
            <Image
              src={item.product.image_url}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-medium text-gray-800 hover:text-green-600 transition-colors truncate">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500">{item.product.unit}</p>
        <p className="text-green-700 font-semibold">${price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-800">${(price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.product_id)}
          className="text-sm text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
