import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for Genesys chat configuration
 * This endpoint handles generating the chat session JWT and configuration
 */
export async function GET() {
  try {
    // Authenticate user
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get user and plan info from the session
    const { user } = session;
    const planId = user.currUsr?.plan?.memCk || '';
    const groupId = user.currUsr?.plan?.grpId || '';

    // Return session data for Genesys chat
    return NextResponse.json({
      userId: user.id || user.currUsr?.umpi || '',
      planId,
      groupId,
      token: process.env.GENESYS_API_TOKEN || '',
    });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to initialize chat session' },
      { status: 500 },
    );
  }
}

/**
 * POST method for creating a new chat session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get request data
    const data = await request.json();

    // In a real implementation, we would validate the data and create a session
    // For now, we'll just return success with the data
    return NextResponse.json({
      success: true,
      sessionId: `chat-${Date.now()}`,
      data,
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 },
    );
  }
}
