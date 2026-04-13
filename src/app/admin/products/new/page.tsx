'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import type { Category } from '@/types/database';

export default function NewProductPage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    sale_price: '',
    image_url: '',
    category_id: '',
    stock: '0',
    unit: 'each',
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { error: insertError } = await supabase.from('products').insert({
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || null,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      image_url: formData.image_url || null,
      category_id: formData.category_id || null,
      stock: parseInt(formData.stock),
      unit: formData.unit,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
    } else {
      router.push('/admin/products');
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Product</h1>

        <div className="max-w-2xl bg-white rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="each, lb, kg, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-8 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
