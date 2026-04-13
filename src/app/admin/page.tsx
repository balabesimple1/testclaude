'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import type { Order } from '@/types/database';

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [productsRes, ordersRes, pendingRes, recentRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*, profile:profiles(full_name)').order('created_at', { ascending: false }).limit(5),
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalRevenue,
        pendingOrders: pendingRes.count || 0,
      });

      if (recentRes.data) setRecentOrders(recentRes.data as unknown as Order[]);
      setLoading(false);
    }

    fetchStats();
  }, [supabase]);

  if (!profile?.is_admin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-500">You need admin privileges to access this page.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-green-700">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-3 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                        <td className="py-3 text-sm">{order.profile?.full_name || 'N/A'}</td>
                        <td className="py-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-3 text-sm font-medium">${Number(order.total).toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
