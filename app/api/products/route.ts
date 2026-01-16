import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    const isConfigError = error?.message?.includes('not configured');
    return NextResponse.json(
      { 
        error: isConfigError 
          ? 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
          : 'Failed to fetch products',
        configError: isConfigError
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const product = await createProduct(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    const isConfigError = error?.message?.includes('not configured');
    return NextResponse.json(
      { 
        error: isConfigError 
          ? 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
          : 'Failed to create product',
        configError: isConfigError
      },
      { status: 500 }
    );
  }
}
