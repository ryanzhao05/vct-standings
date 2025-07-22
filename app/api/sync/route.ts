import { NextRequest, NextResponse } from 'next/server';
import { syncRegionData, syncVCTTeams, testPandaScoreConnection, getSyncStatus } from '@/lib/admin-sync';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const region = searchParams.get('region');

    switch (action) {
      case 'test-connection':
        const testResult = await testPandaScoreConnection();
        return NextResponse.json(testResult);

      case 'sync-teams':
        const teamsResult = await syncVCTTeams();
        return NextResponse.json(teamsResult);

      case 'sync-region':
        if (!region) {
          return NextResponse.json({ error: 'region parameter required' }, { status: 400 });
        }
        const regionResult = await syncRegionData(region, getSeriesId(region));
        return NextResponse.json(regionResult);

      case 'status':
        const statusResult = await getSyncStatus();
        return NextResponse.json(statusResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getSeriesId(region: string): number {
  const seriesMap: Record<string, number> = {
    'americas': 9442,
    'emea': 9441,
    'pacific': 9435,
    'china': 9434
  };
  return seriesMap[region] || 9442;
} 