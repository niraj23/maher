'use client';

import { ProfitStats, TimeRangeStats, ProductProfitability, Store } from '@/types';
import { format, startOfWeek, startOfYear, endOfWeek, endOfYear, subMonths, eachMonthOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface AnalyticsProps {
  stats: ProfitStats;
  weekStats: TimeRangeStats;
  yearStats: TimeRangeStats;
  mostProfitable: ProductProfitability[];
  storeStats: Array<{ store: Store; profit: number; items: number }>;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

// Icons as SVG components
const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const PercentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function Analytics({ stats, weekStats, yearStats, mostProfitable, storeStats }: AnalyticsProps) {
  // Calculate additional metrics
  const avgProfitPerItem = stats.soldItems > 0 ? stats.totalProfit / stats.soldItems : 0;
  const conversionRate = stats.totalItems > 0 ? (stats.soldItems / stats.totalItems) * 100 : 0;
  const roi = stats.totalCost > 0 ? (stats.totalProfit / stats.totalCost) * 100 : 0;
  const inventoryValue = stats.unsoldItems * (stats.totalCost / stats.totalItems || 0);
  
  // Calculate weekly and yearly averages
  const weeklyAvgProfit = weekStats.itemsSold > 0 ? weekStats.profit / weekStats.itemsSold : 0;
  const yearlyAvgProfit = yearStats.itemsSold > 0 ? yearStats.profit / yearStats.itemsSold : 0;

  // Time period comparison data
  const profitData = [
    { 
      name: 'This Week', 
      profit: weekStats.profit, 
      revenue: weekStats.revenue,
      items: weekStats.itemsSold,
      avgProfit: weeklyAvgProfit
    },
    { 
      name: 'This Year', 
      profit: yearStats.profit, 
      revenue: yearStats.revenue,
      items: yearStats.itemsSold,
      avgProfit: yearlyAvgProfit
    },
    { 
      name: 'All Time', 
      profit: stats.totalProfit, 
      revenue: stats.totalRevenue,
      items: stats.soldItems,
      avgProfit: avgProfitPerItem
    },
  ];

  // Store performance data
  const storeChartData = storeStats.map((s) => ({
    name: s.store.name.length > 15 ? s.store.name.substring(0, 15) + '...' : s.store.name,
    profit: s.profit,
    items: s.items,
    avgProfit: s.items > 0 ? s.profit / s.items : 0,
  }));

  // Store distribution for pie chart
  const storeDistribution = storeStats.map((s) => ({
    name: s.store.name,
    value: s.items,
    profit: s.profit,
  }));

  // Get top 5 most profitable
  const topProducts = mostProfitable.slice(0, 5);
  const worstProducts = mostProfitable.length > 0 
    ? [...mostProfitable].sort((a, b) => a.profit - b.profit).slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 p-6 rounded-xl shadow-lg border border-indigo-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wide">Total Profit</h3>
            <div className={`p-2 rounded-lg ${stats.totalProfit >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <TrendingUpIcon />
            </div>
          </div>
          <p className={`text-3xl font-bold mt-2 ${stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {stats.soldItems} items sold
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 rounded-xl shadow-lg border border-purple-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wide">Total Revenue</h3>
            <div className="p-2 rounded-lg bg-purple-500/20">
              <DollarIcon />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2 text-purple-200">
            ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Avg: ${avgProfitPerItem.toFixed(2)} per item
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 p-6 rounded-xl shadow-lg border border-emerald-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-emerald-300 uppercase tracking-wide">Profit Margin</h3>
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <PercentIcon />
            </div>
          </div>
          <p className={`text-3xl font-bold mt-2 ${stats.profitMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {stats.profitMargin.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            ROI: {roi.toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 p-6 rounded-xl shadow-lg border border-amber-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-300 uppercase tracking-wide">Inventory</h3>
            <div className="p-2 rounded-lg bg-amber-500/20">
              <PackageIcon />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2 text-amber-200">
            {stats.unsoldItems}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Value: ${inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <PercentIcon />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Conversion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {conversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {stats.soldItems} of {stats.totalItems} items sold
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <ChartIcon />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Avg Profit/Item</h3>
          </div>
          <p className={`text-2xl font-bold ${avgProfitPerItem >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            ${avgProfitPerItem.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Across all sold items
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <TrendingUpIcon />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Total Investment</h3>
          </div>
          <p className="text-2xl font-bold text-violet-400">
            ${stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Total purchase cost
          </p>
        </div>
      </div>

      {/* Time Period Comparison */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-indigo-500/20">
            <ChartIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Performance by Time Period</h2>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              formatter={(value: number | undefined, name: string | undefined) => {
                if (value === undefined) return '';
                if (name === 'profit' || name === 'revenue' || name === 'avgProfit') {
                  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                }
                return value;
              }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569', 
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend 
              wrapperStyle={{ color: '#cbd5e1', paddingTop: '20px' }}
            />
            <Bar dataKey="profit" fill="#6366F1" name="Profit" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Performance */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <StoreIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Store Performance</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis 
                type="number" 
                stroke="#94a3b8" 
                tick={{ fill: '#cbd5e1' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={{ fill: '#cbd5e1' }}
                width={100}
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value !== undefined ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Bar dataKey="profit" fill="#8B5CF6" name="Profit" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Store Distribution */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-pink-500/20">
              <PackageIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Items by Store</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={storeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name && name.length > 12 ? name.substring(0, 12) + '...' : name || 'Unknown'}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {storeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | undefined, name: string | undefined, props: any) => {
                  if (value === undefined) return '';
                  return [
                    `${value} items ($${props?.payload?.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'})`,
                    'Items'
                  ];
                }}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#cbd5e1' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Profitable Products */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <TrendingUpIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Top Performers</h2>
          </div>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div 
                  key={item.product_id} 
                  className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-100">{item.product_name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{item.store_name}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-300">
                          Bought: <span className="font-medium">${item.purchase_price.toFixed(2)}</span>
                        </span>
                        <span className="text-slate-300">
                          Sold: <span className="font-medium">${item.sale_price.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-lg font-bold ${item.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${item.profit.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.profitMargin.toFixed(1)}% margin
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No products sold yet</p>
            )}
          </div>
        </div>

        {/* Worst Performers (if any losses) */}
        {worstProducts.length > 0 && worstProducts.some(p => p.profit < 0) && (
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/20">
                <TrendingUpIcon />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Needs Attention</h2>
            </div>
            <div className="space-y-3">
              {worstProducts.filter(p => p.profit < 0).map((item, index) => (
                <div 
                  key={item.product_id} 
                  className="bg-slate-700/50 p-4 rounded-lg border border-red-500/30 hover:bg-slate-700/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-100 mb-1">{item.product_name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{item.store_name}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-300">
                          Bought: <span className="font-medium">${item.purchase_price.toFixed(2)}</span>
                        </span>
                        <span className="text-slate-300">
                          Sold: <span className="font-medium">${item.sale_price.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-red-400">
                        ${item.profit.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.profitMargin.toFixed(1)}% margin
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Most Profitable Products Table */}
      {mostProfitable.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              <ChartIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">All Profitable Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 border-b-2 border-indigo-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Purchase</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Sale</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-300 uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                {mostProfitable.map((item, index) => (
                  <tr key={item.product_id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-indigo-400">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      {item.store_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      ${item.purchase_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      ${item.sale_price.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${item.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${item.profit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.profitMargin >= 20 ? 'bg-emerald-500/20 text-emerald-400' : item.profitMargin >= 10 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
