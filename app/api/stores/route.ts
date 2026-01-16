import { NextRequest, NextResponse } from 'next/server';
import { getStores, createStore } from '@/lib/db';

export async function GET() {
  try {
    const stores = await getStores();
    return NextResponse.json(stores);
  } catch (error: any) {
    console.error('Error fetching stores:', error);
    const isConfigError = error?.message?.includes('not configured');
    return NextResponse.json(
      { 
        error: isConfigError 
          ? 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
          : 'Failed to fetch stores',
        configError: isConfigError
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Store name required' }, { status: 400 });
    }
    const store = await createStore(name);
    return NextResponse.json(store, { status: 201 });
  } catch (error: any) {
    console.error('Error creating store:', error);
    const isConfigError = error?.message?.includes('not configured');
    return NextResponse.json(
      { 
        error: isConfigError 
          ? 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
          : 'Failed to create store',
        configError: isConfigError
      },
      { status: 500 }
    );
  }
}
