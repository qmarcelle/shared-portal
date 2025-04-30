/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/chat/components/GenesysScripts.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useChatEligibility } from '../hooks';
import type { GenesysGlobal } from '../types/genesys';
import {
  executeGenesysOverrides,
  registerGenesysOverride,
} from '../utils/chatDomUtils';
import { GenesysWidgetBus } from '../utils/genesysWidgetBus';

interface GenesysScriptsProps {
  deploymentId: string;
  environment: string;
  orgId: string;
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
          },
        },
      };
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
