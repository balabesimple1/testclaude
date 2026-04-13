'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    address: profile?.address || '',
    city: profile?.city || '',
    postalCode: profile?.postal_code || '',
    phone: profile?.phone || '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-green-600 hover:text-green-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  const deliveryFee = totalPrice >= 50 ? 0 : 4.99;
  const orderTotal = totalPrice + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: orderTotal,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postalCode,
          phone: formData.phone,
          notes: formData.notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.sale_price ?? item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      router.push(`/orders?success=${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Leave at the door, etc."
                  />
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium bg-gray-100 rounded-full px-2.5 py-0.5">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-700">{item.product.name}</span>
                    </div>
                    <span className="font-medium">
                      ${((item.product.sale_price ?? item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-700">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                By placing this order, you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
