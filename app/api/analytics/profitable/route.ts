import { NextRequest, NextResponse } from 'next/server';
import { getMostProfitableProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const products = await getMostProfitableProducts(limit);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching profitable products:', error);
    return NextResponse.json({ error: 'Failed to fetch profitable products' }, { status: 500 });
  }
}
