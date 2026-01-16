export interface Store {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  store_id: string;
  purchase_price: number;
  purchase_date: string;
  sale_price: number | null;
  sale_date: string | null;
  sold_at: string | null; // where it was sold (e.g., "eBay", "Poshmark", etc.)
  product_url: string | null; // direct link to the product page
  created_at: string;
  updated_at: string;
}

export interface ProductWithStore extends Product {
  store: Store;
}

export interface ProfitStats {
  totalProfit: number;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  totalItems: number;
  soldItems: number;
  unsoldItems: number;
}

export interface TimeRangeStats {
  profit: number;
  revenue: number;
  cost: number;
  itemsSold: number;
}

export interface ProductProfitability {
  product_id: string;
  product_name: string;
  store_name: string;
  profit: number;
  profitMargin: number;
  purchase_price: number;
  sale_price: number;
}
