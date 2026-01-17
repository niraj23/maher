'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductWithStore, Store, ProfitStats, TimeRangeStats, ProductProfitability } from '@/types';
import { startOfWeek, startOfYear, endOfWeek, endOfYear } from 'date-fns';
import ProductModal from '@/components/ProductModal';
import ProductList from '@/components/ProductList';
import Analytics from '@/components/Analytics';
import StoreManager from '@/components/StoreManager';
import ConfigError from '@/components/ConfigError';

type Tab = 'products' | 'analytics' | 'stores';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithStore | null>(null);
  const [stats, setStats] = useState<ProfitStats | null>(null);
  const [weekStats, setWeekStats] = useState<TimeRangeStats | null>(null);
  const [yearStats, setYearStats] = useState<TimeRangeStats | null>(null);
  const [mostProfitable, setMostProfitable] = useState<ProductProfitability[]>([]);
  const [storeStats, setStoreStats] = useState<Array<{ store: Store; profit: number; items: number }>>([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [activeTab, products]);

  const loadData = async () => {
    try {
      setLoading(true);
      setConfigError(false);
      const [productsRes, storesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/stores'),
      ]);
      
      const productsData = await productsRes.json();
      const storesData = await storesRes.json();
      
      // Check for configuration errors
      if (productsData.configError || storesData.configError) {
        setConfigError(true);
        return;
      }
      
      if (productsRes.ok) {
        setProducts(productsData);
      }
      if (storesRes.ok) {
        setStores(storesData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      const [statsRes, weekRes, yearRes, profitableRes, storeStatsRes] = await Promise.all([
        fetch('/api/analytics/stats'),
        fetch(`/api/analytics/range?start=${weekStart.toISOString()}&end=${weekEnd.toISOString()}`),
        fetch(`/api/analytics/range?start=${yearStart.toISOString()}&end=${yearEnd.toISOString()}`),
        fetch('/api/analytics/profitable'),
        fetch('/api/analytics/stores'),
      ]);

      setStats(await statsRes.json());
      setWeekStats(await weekRes.json());
      setYearStats(await yearRes.json());
      setMostProfitable(await profitableRes.json());
      setStoreStats(await storeStatsRes.json());
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to save product');
      
      setShowProductForm(false);
      setEditingProduct(null);
      await loadData();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      await loadData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleAddStore = async (name: string) => {
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to add store');
      await loadData();
    } catch (error) {
      console.error('Failed to add store:', error);
      alert('Failed to add store. Please try again.');
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      const response = await fetch(`/api/stores/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete store');
      await loadData();
    } catch (error) {
      console.error('Failed to delete store:', error);
      alert('Failed to delete store. Please try again.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (configError) {
    return <ConfigError />;
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                The Colour of Zack
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-slate-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${
                activeTab === 'stores'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Stores
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
              <ProductList
                products={products}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setShowProductForm(true);
                }}
                onDelete={handleDeleteProduct}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && stats && weekStats && yearStats && (
          <Analytics
            stats={stats}
            weekStats={weekStats}
            yearStats={yearStats}
            mostProfitable={mostProfitable}
            storeStats={storeStats}
          />
        )}

        {activeTab === 'stores' && (
          <StoreManager
            stores={stores}
            onAdd={handleAddStore}
            onDelete={handleDeleteStore}
          />
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductForm}
        product={editingProduct || undefined}
        stores={stores}
        onSave={handleSaveProduct}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
}
