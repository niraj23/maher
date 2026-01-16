import { NextResponse } from 'next/server';
import { getStoreStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getStoreStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching store stats:', error);
    return NextResponse.json({ error: 'Failed to fetch store stats' }, { status: 500 });
  }
}
