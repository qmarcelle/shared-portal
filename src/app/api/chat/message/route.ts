import { getAuthToken } from '@/utils/api/getToken';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/message endpoint
 *
 * This endpoint allows sending messages to the Genesys chat service
 * It proxies the request to the appropriate Genesys endpoint
 *
 * Request body:
 * - text: string - The message text to send
 *
 * Response:
 * - success: boolean - Whether the message was sent successfully
 * - error?: string - Error message if the message failed to send
 */
export async function POST(request: NextRequest) {
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/message] Incoming message request', {
    correlationId,
  });

  try {
    // Parse request body
    const body = await request.json();
    const { text } = body;

    if (!text) {
      logger.error('[API:chat/message] Missing text in request body', {
        correlationId,
      });
      return NextResponse.json(
        { error: 'Missing required parameter: text' },
        { status: 400 },
      );
    }

    // Get authentication token
    const token = await getAuthToken();
    if (!token) {
      logger.error('[API:chat/message] Failed to get authentication token', {
        correlationId,
      });
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 },
      );
    }

    // Construct the URL for the Genesys chat message endpoint
    const genesysUrl =
      process.env.NEXT_PUBLIC_GENESYS_CHAT_URL ||
      'https://api3.bcbst.com/stge/soa/api/cci/genesyschat';

    logger.info('[API:chat/message] Sending message to Genesys', {
      correlationId,
      genesysUrl,
      messageLength: text.length,
    });

    // Send the message to Genesys
    const response = await fetch(genesysUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      logger.error('[API:chat/message] Failed to send message to Genesys', {
        correlationId,
        status: response.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: `Failed to send message: ${response.status}` },
        { status: response.status },
      );
    }

    logger.info('[API:chat/message] Message sent successfully', {
      correlationId,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('[API:chat/message] Error processing message request', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to process message request' },
      { status: 500 },
    );
  }
}
