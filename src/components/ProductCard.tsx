'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const displayPrice = hasDiscount ? product.sale_price! : product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-lg">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 mb-1 hover:text-green-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-2">{product.unit}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-700">${displayPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock === 0}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
