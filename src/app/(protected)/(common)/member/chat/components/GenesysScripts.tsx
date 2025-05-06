/* eslint-disable @typescript-eslint/no-unused-vars */
// src/a../((common)/chat/components/GenesysScripts.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useChatEligibility } from '../hooks';
import type { GenesysGlobal } from '../types/genesys.types';
import {
  executeGenesysOverrides,
  registerGenesysOverride,
} from '../utils/chatDomUtils';
import { GenesysWidgetBus } from '../utils/genesysWidgetBus';

interface GenesysScriptsProps {
  deploymentId: string;
  environment: string;
  orgId: string;
  memberId: string;
  planId: string;
  debug?: boolean;
}

/**
 * GenesysScripts Component
 * Handles loading and initialization of Genesys chat scripts.
 * Supports both cloud and legacy implementations with proper configuration.
 */
export function GenesysScripts({
  deploymentId,
  environment,
  orgId,
  memberId,
  planId,
  debug = false,
}: GenesysScriptsProps) {
  const initialized = useRef(false);
  const { eligibility } = useChatEligibility(memberId, planId);
  const cloudChatEligible = eligibility?.cloudChatEligible || false;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize _genesys object for legacy chat
    if (!window._genesys) {
      const genesys: GenesysGlobal = function (...args: unknown[]) {
        if (!genesys.q) genesys.q = [];
        genesys.q.push(args);
      };
      genesys.c = {
        pluginsPath: `https://apps.${environment}/genesys-bootstrap/genesys-cloud/`,
        debug,
        modules: {
          webchat: {
            transport: {
              deploymentKey: deploymentId,
              orgGuid: orgId,
              markdown: true,
              interactionData: {
                routing: {
                  targetType: 'QUEUE',
                  targetAddress: eligibility?.chatGroup || 'default',
                  priority: 2,
                },
              },
            },
            emojis: true,
            uploadsEnabled: true,
            enableCustomHeader: true,
            actionsMenu: true,
            maxMessageLength: 500,
            styling: {
              // Use Tailwind config values
              primaryColor: '#0066CC', // primary color from config
              backgroundColor: '#FFFFFF', // base-100 from config
              textColor: '#111827', // neutral from config
              fontFamily: 'Univers-45, sans-serif', // font-base from config
              fontSize: '1rem',
              borderRadius: '0.5rem', // rounded-lg from config
              buttonStyle: {
                padding: '0.75rem 1.25rem',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
              },
              chatButton: {
                width: '4rem',
                height: '4rem',
                borderRadius: '9999px', // rounded-full
                backgroundColor: '#0066CC', // primary
                color: '#FFFFFF',
                boxShadow:
                  '0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)', // shadow-soft
              },
              messageStyle: {
                userMessage: {
                  backgroundColor: '#0066CC', // primary
                  color: '#FFFFFF',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                },
                agentMessage: {
                  backgroundColor: '#5DC1FD', // secondary
                  color: '#FFFFFF', // secondary-content
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                },
                systemMessage: {
                  backgroundColor: '#F2F2F2', // base-200
                  color: '#333333', // neutral
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                },
              },
            },
          },
        },
      } as GenesysGlobal['c'];
      genesys.t = Number(new Date());
      window._genesys = genesys;
    }

    const loadScript = async () => {
      try {
        // Load appropriate script based on eligibility
        const scriptUrl = cloudChatEligible
          ? `https://apps.${environment}/genesys-bootstrap/genesys-cloud/cxbus.min.js`
          : '/assets/genesys/click_to_chat.js';

        // Remove existing script if any
        const existingScript = document.getElementById('cx-widget-script');
        if (existingScript) existingScript.remove();

        // Create and load new script
        const script = document.createElement('script');
        script.id = 'cx-widget-script';
        script.src = scriptUrl;
        script.async = true;
        script.defer = true;

        // Wait for script to load
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error('Failed to load Genesys script'));
          document.head.appendChild(script);
        });

        // Initialize chat based on eligibility
        if (cloudChatEligible) {
          console.log('Initializing Genesys Web Messenger');
          // Web Messenger initialization handled by useChat
        } else {
          console.log('Initializing legacy chat.js');

          // Initialize legacy chat widget bus
          const widgetBus = GenesysWidgetBus.getInstance();
          await widgetBus.init();

          // Register custom overrides
          registerGenesysOverride(() => {
            // Hide inquiry dropdown for simpler UX
            const dropdown = document.querySelector('.cx-inquiry-dropdown');
            if (dropdown) dropdown.classList.add('hidden');

            // Add custom styles
            const chatButton = document.querySelector(
              '.cx-widget.cx-webchat-chat-button',
            );
            if (chatButton) chatButton.classList.add('circular-chat-button');
          });

          // Execute overrides after widget is ready
          window.CXBus?.runtime.subscribe('WebChat.ready', () => {
            executeGenesysOverrides();
            window.CXBus?.runtime.command('WebChat.bootstrap', {
              element: 'cx-widget-container',
              form: {
                autoFocus: true,
                expanded: true,
                wrapper: 'cx-webchat-form-wrapper',
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
          });
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    loadScript();

    // Cleanup
    return () => {
      if (cloudChatEligible) {
        window.Genesys?.WebMessenger?.destroy();
      } else {
        window.CXBus?.runtime.command('WebChat.destroy');
        const widgetBus = GenesysWidgetBus.getInstance();
        widgetBus.destroy?.();
      }
      delete window._genesys;
      delete window.CXBus;
      delete window.Genesys;
    };
  }, [
    deploymentId,
    environment,
    orgId,
    debug,
    cloudChatEligible,
    eligibility?.chatGroup,
  ]);

  return null;
}
