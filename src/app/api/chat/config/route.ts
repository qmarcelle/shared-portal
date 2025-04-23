import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    // This would typically come from your environment variables
    const genesysConfig = {
      webchatAppUrl: process.env.NEXT_PUBLIC_GENESYS_WEBCHAT_URL,
      webchatServiceUrl: process.env.NEXT_PUBLIC_GENESYS_SERVICE_URL,
      orgId: process.env.NEXT_PUBLIC_GENESYS_ORG_ID,
      deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID,
      buttonId: process.env.NEXT_PUBLIC_GENESYS_BUTTON_ID,
      queue: process.env.NEXT_PUBLIC_GENESYS_QUEUE,
    };

    // Return the configuration needed by @chat.js
    return NextResponse.json({
      // Core settings
      webchatAppUrl: genesysConfig.webchatAppUrl,
      webchatServiceUrl: genesysConfig.webchatServiceUrl,
      orgId: genesysConfig.orgId,
      deploymentId: genesysConfig.deploymentId,
      buttonId: genesysConfig.buttonId,
      queue: genesysConfig.queue,

      // Chat widget settings
      chatTitle: 'Chat Support',
      enableCustomHeader: true,
      enablePlanSwitching: true,

      // Callbacks
      callbacks: {
        onReady: 'window.genesys.onChatReady',
        onError: 'window.genesys.onChatError',
        onMessage: 'window.genesys.onChatMessage',
        onStateChange: 'window.genesys.onChatStateChange',
      },

      // Form configuration
      formConfig: {
        wrapper: '<table></table>',
        inputs: [
          {
            id: 'cx_webchat_form_firstname',
            name: 'firstname',
            maxlength: '100',
            placeholder: 'Required',
            label: 'First Name',
          },
          {
            id: 'cx_webchat_form_lastname',
            name: 'lastname',
            maxlength: '100',
            placeholder: 'Required',
            label: 'Last Name',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error getting chat configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get chat configuration' },
      { status: 500 },
    );
  }
}
