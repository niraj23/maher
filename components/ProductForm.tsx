'use client';

import { useState, useEffect } from 'react';
import { Product, ProductWithStore, Store } from '@/types';

interface ProductFormProps {
  product?: Product | ProductWithStore;
  stores: Store[];
  onSave: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ product, stores, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    store_id: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    sale_price: '',
    sale_date: '',
    sold_at: '',
    size: '',
    color: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        store_id: product.store_id,
        purchase_price: product.purchase_price.toString(),
        purchase_date: product.purchase_date.split('T')[0],
        sale_price: product.sale_price?.toString() || '',
        sale_date: product.sale_date?.split('T')[0] || '',
        sold_at: product.sold_at || '',
        size: product.size || '',
        color: product.color || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: formData.name,
      store_id: formData.store_id,
      purchase_price: parseFloat(formData.purchase_price),
      purchase_date: formData.purchase_date,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      sale_date: formData.sale_date || null,
      sold_at: formData.sold_at || null,
      product_url: null,
      size: formData.size.trim() || null,
      color: formData.color.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Product Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-500"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Store *
        </label>
        <select
          value={formData.store_id}
          onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
          required
          className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100"
        >
          <option value="" className="bg-slate-800">Select a store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id} className="bg-slate-800">
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Purchase Price ($) *
            <span className="text-xs font-normal text-slate-400 ml-1">(after discount, exclude shipping)</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.purchase_price}
            onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
            required
            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-500"
            placeholder="0.00"
          />
          <p className="text-xs text-slate-400 mt-1">Enter the final price after all discounts, excluding shipping costs</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Purchase Date *
          </label>
          <input
            type="date"
            value={formData.purchase_date}
            onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
            required
            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sale Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.sale_price}
            onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Sale Date
          </label>
          <input
            type="date"
            value={formData.sale_date}
            onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Size
          </label>
          <input
            type="text"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="e.g., 12, M, L"
            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Color
          </label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="e.g., Black, Grey"
            className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Sold At (Platform)
        </label>
        <input
          type="text"
          value={formData.sold_at}
          onChange={(e) => setFormData({ ...formData, sold_at: e.target.value })}
          placeholder="e.g., eBay, Poshmark, Facebook Marketplace"
          className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-500"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-slate-200 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          {product ? 'Update' : 'Add'} Product
        </button>
      </div>
    </form>
  );
}
