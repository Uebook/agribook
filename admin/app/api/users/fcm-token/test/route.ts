import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/fcm-token/test
 * Test endpoint to verify route is accessible
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'FCM token route is accessible',
    endpoint: '/api/users/fcm-token',
    methods: ['POST', 'OPTIONS'],
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
