// Load environment variables FIRST before any imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
const result = config({ path: envPath });

if (result.error) {
  console.error('Error loading .env.local:', result.error);
  process.exit(1);
}

// Verify env vars are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables!');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

async function main() {
  try {
    // Dynamically import after env vars are set
    const { getStores, createStore, createProduct } = await import('../lib/db');
    
    console.log('Adding products...');
    
    // Get or create "The Real Real" store
    let stores = await getStores();
    let realRealStore = stores.find(s => s.name.toLowerCase().includes('real real'));
    
    if (!realRealStore) {
      console.log('Creating "The Real Real" store...');
      realRealStore = await createStore('The Real Real');
    }
    
    // Products to add
    const products = [
      {
        name: "Off-White x Nike Utility Jacket",
        purchase_price: 212.00,
        purchase_date: '2026-01-13',
        size: 'L',
        color: 'Black, Pattern Prints',
      },
      {
        name: "Off-White x Nike 2019 Tie-Dye Print Jacket",
        purchase_price: 168.00,
        purchase_date: '2026-01-13',
        size: 'S',
        color: 'Blue, Pattern Prints',
      },
      {
        name: "Off-White x Nike 2019 Nylon Jacket",
        purchase_price: 126.00,
        purchase_date: '2026-01-13',
        size: 'L',
        color: 'Yellow, Pattern Prints',
      },
      {
        name: "Off-White x Nike Nylon Mini Shorts",
        purchase_price: 101.50,
        purchase_date: '2026-01-13',
        size: 'M',
        color: 'Blue, Pattern Prints',
      },
      {
        name: "Off-White x Nike Logo Mini Shorts",
        purchase_price: 129.50,
        purchase_date: '2026-01-13',
        size: 'S',
        color: 'Black, Pattern Prints',
      },
      {
        name: "Off-White x Nike Air Force 1 Low 'Volt' Sneakers",
        purchase_price: 272.50,
        purchase_date: '2026-01-13',
        size: '10',
        color: 'Yellow, Pattern Prints',
      },
      {
        name: "Off-White x Nike Tie-Dye Print Scoop Neck Top",
        purchase_price: 28.75,
        purchase_date: '2026-01-13',
        size: 'M',
        color: 'Green, Pattern Prints',
      },
      {
        name: "Off-White 2020 Straight-Leg Jeans",
        purchase_price: 382.50,
        purchase_date: '2026-01-13',
        size: 'L',
        color: 'Black, Pattern Prints',
      },
    ];
    
    const createdProducts = [];
    
    for (const productData of products) {
      const product = await createProduct({
        name: productData.name,
        store_id: realRealStore.id,
        purchase_price: productData.purchase_price,
        purchase_date: productData.purchase_date,
        sale_price: null,
        sale_date: null,
        sold_at: null,
        product_url: null,
        size: productData.size,
        color: productData.color,
      });
      createdProducts.push(product);
      console.log(`✅ Added: ${product.name} - $${product.purchase_price}${product.size ? ` (Size: ${product.size})` : ''}${product.color ? ` (Color: ${product.color})` : ''}`);
    }
    
    console.log(`\n✅ Successfully added ${createdProducts.length} product(s)!`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error adding products:', error.message);
    process.exit(1);
  }
}

main();
