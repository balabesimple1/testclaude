'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import type { Product, Category } from '@/types/database';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const supabase = createClient();

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (categoriesData) setCategories(categoriesData);

      // Build products query
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true);

      if (categorySlug) {
        const category = categoriesData?.find((c) => c.slug === categorySlug);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // Sort
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('name');
      }

      const { data: productsData } = await query;
      if (productsData) setProducts(productsData);
      setLoading(false);
    }

    fetchData();
  }, [supabase, categorySlug, searchQuery, sortBy]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {activeCategory ? activeCategory.name : 'All Products'}
        </h1>
        {searchQuery && (
          <p className="text-gray-500">
            Showing results for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <SearchBar />
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Categories */}
        <aside className="hidden lg:block w-56 shrink-0">
          <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/products"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  !categorySlug ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Products
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    categorySlug === category.slug
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Category Filter */}
          <div className="lg:hidden mb-4 flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                !categorySlug ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  categorySlug === category.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{products.length} products</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-72" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
