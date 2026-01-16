import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Store, ProductWithStore, ProfitStats, TimeRangeStats, ProductProfitability } from '@/types';

// Helper to check configuration before database operations
function checkConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See README.md for setup instructions.');
  }
}

// Stores
export async function getStores(): Promise<Store[]> {
  checkConfig();
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function createStore(name: string): Promise<Store> {
  checkConfig();
  const { data, error } = await supabase
    .from('stores')
    .insert([{ name }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteStore(id: string): Promise<void> {
  checkConfig();
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Products
export async function getProducts(): Promise<ProductWithStore[]> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      store:stores(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map((item: any) => ({
    ...item,
    store: item.store as Store,
  })) || [];
}

export async function getProduct(id: string): Promise<ProductWithStore | null> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      store:stores(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data ? {
    ...data,
    store: data.store as Store,
  } : null;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  checkConfig();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Analytics
export async function getProfitStats(): Promise<ProfitStats> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .select('purchase_price, sale_price');
  
  if (error) throw error;
  
  const products = data || [];
  const soldProducts = products.filter(p => p.sale_price !== null && p.sale_price !== undefined);
  const unsoldProducts = products.filter(p => p.sale_price === null || p.sale_price === undefined);
  
  const totalCost = products.reduce((sum, p) => sum + (Number(p.purchase_price) || 0), 0);
  const totalRevenue = soldProducts.reduce((sum, p) => sum + (Number(p.sale_price) || 0), 0);
  const totalProfit = totalRevenue - soldProducts.reduce((sum, p) => sum + (Number(p.purchase_price) || 0), 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  return {
    totalProfit,
    totalRevenue,
    totalCost,
    profitMargin,
    totalItems: products.length,
    soldItems: soldProducts.length,
    unsoldItems: unsoldProducts.length,
  };
}

export async function getTimeRangeStats(startDate: Date, endDate: Date): Promise<TimeRangeStats> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .select('purchase_price, sale_price, sale_date')
    .not('sale_date', 'is', null)
    .gte('sale_date', startDate.toISOString().split('T')[0])
    .lte('sale_date', endDate.toISOString().split('T')[0]);
  
  if (error) throw error;
  
  const products = (data || []).filter(p => p.sale_price !== null && p.sale_price !== undefined);
  
  const cost = products.reduce((sum, p) => sum + (Number(p.purchase_price) || 0), 0);
  const revenue = products.reduce((sum, p) => sum + (Number(p.sale_price) || 0), 0);
  const profit = revenue - cost;
  
  return {
    profit,
    revenue,
    cost,
    itemsSold: products.length,
  };
}

export async function getMostProfitableProducts(limit: number = 10): Promise<ProductProfitability[]> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      purchase_price,
      sale_price,
      store:stores(name)
    `)
    .not('sale_price', 'is', null)
    .order('sale_price', { ascending: false });
  
  if (error) throw error;
  
  const products = (data || []).map((item: any) => {
    const purchasePrice = Number(item.purchase_price) || 0;
    const salePrice = Number(item.sale_price) || 0;
    const profit = salePrice - purchasePrice;
    const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;
    
    return {
      product_id: item.id,
      product_name: item.name,
      store_name: item.store?.name || 'Unknown',
      profit,
      profitMargin,
      purchase_price: purchasePrice,
      sale_price: salePrice,
    };
  });
  
  return products
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit);
}

export async function getStoreStats(): Promise<Array<{ store: Store; profit: number; items: number }>> {
  checkConfig();
  const { data, error } = await supabase
    .from('products')
    .select(`
      store_id,
      purchase_price,
      sale_price,
      store:stores(*)
    `);
  
  if (error) throw error;
  
  const storeMap = new Map<string, { store: Store; profit: number; items: number }>();
  
  (data || []).forEach((item: any) => {
    const store = item.store as Store;
    if (!storeMap.has(store.id)) {
      storeMap.set(store.id, { store, profit: 0, items: 0 });
    }
    
    const stats = storeMap.get(store.id)!;
    stats.items++;
    
    if (item.sale_price !== null && item.sale_price !== undefined) {
      stats.profit += (Number(item.sale_price) || 0) - (Number(item.purchase_price) || 0);
    }
  });
  
  return Array.from(storeMap.values()).sort((a, b) => b.profit - a.profit);
}
