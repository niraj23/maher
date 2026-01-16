'use client';

import { ProductWithStore } from '@/types';
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';

interface ProductListProps {
  products: ProductWithStore[];
  onEdit: (product: ProductWithStore) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSold, setFilterSold] = useState<'all' | 'sold' | 'unsold'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const calculateProfit = (product: ProductWithStore) => {
    if (!product.sale_price) return null;
    return product.sale_price - product.purchase_price;
  };

  // Filter products based on search query and sold status
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by sold status
    if (filterSold === 'sold') {
      filtered = filtered.filter(p => p.sale_price !== null && p.sale_price !== undefined);
    } else if (filterSold === 'unsold') {
      filtered = filtered.filter(p => p.sale_price === null || p.sale_price === undefined);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.store.name.toLowerCase().includes(query) ||
        (product.sold_at && product.sold_at.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [products, searchQuery, filterSold]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSold]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products, stores, or sold at..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  <svg className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
              <button
                onClick={() => setFilterSold('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  filterSold === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterSold('sold')}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  filterSold === 'sold'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Sold
              </button>
              <button
                onClick={() => setFilterSold('unsold')}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  filterSold === 'unsold'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Unsold
              </button>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery || filterSold !== 'all' ? (
          <div className="mt-3 text-sm text-slate-400">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        ) : null}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 border-b-2 border-indigo-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Purchase
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Sale
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Profit/Loss
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Sold At
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {paginatedProducts.map((product) => {
              const profit = calculateProfit(product);
              return (
                <tr key={product.id} className="hover:bg-slate-700/50 transition-colors cursor-default">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-100 break-words">{product.name}</div>
                        {(product.size || product.color) && (
                          <div className="text-xs mt-2 flex flex-wrap gap-3">
                            {product.size && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-900/40 border border-indigo-700/50 rounded-md text-indigo-200">
                                <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                                <span className="text-indigo-300 font-semibold">Size:</span>
                                <span className="font-medium">{product.size}</span>
                              </span>
                            )}
                            {product.color && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-900/40 border border-purple-700/50 rounded-md text-purple-200">
                                <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                </svg>
                                <span className="text-purple-300 font-semibold">Color:</span>
                                <span className="font-medium">{product.color}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div className="text-sm text-slate-100 font-semibold">{product.store.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-sm font-bold text-slate-50">
                          ${product.purchase_price.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-300">
                          {(() => {
                            const [year, month, day] = product.purchase_date.split('-').map(Number);
                            return format(new Date(year, month - 1, day), 'MMM d, yyyy');
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-slate-100">
                            ${product.sale_price.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-200">
                            {product.sale_date ? (() => {
                              const [year, month, day] = product.sale_date.split('-').map(Number);
                              return format(new Date(year, month - 1, day), 'MMM d, yyyy');
                            })() : ''}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728a9 9 0 01-12.728-12.728" />
                        </svg>
                        Not sold
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {profit !== null ? (
                      <span className={`inline-flex items-center gap-1 text-sm font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profit >= 0 ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-100">{product.sold_at || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            onDelete(product.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-300 font-medium">
              {searchQuery || filterSold !== 'all' ? 'No products match your search' : 'No products yet'}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {searchQuery || filterSold !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Add your first product to get started!'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 cursor-pointer'
                }`}
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[2.5rem] px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-slate-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 cursor-pointer'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
