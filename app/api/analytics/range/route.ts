import { NextRequest, NextResponse } from 'next/server';
import { getTimeRangeStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    
    if (!start || !end) {
      return NextResponse.json({ error: 'Start and end dates required' }, { status: 400 });
    }
    
    const stats = await getTimeRangeStats(new Date(start), new Date(end));
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching range stats:', error);
    return NextResponse.json({ error: 'Failed to fetch range stats' }, { status: 500 });
  }
}
