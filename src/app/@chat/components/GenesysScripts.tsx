/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/chat/components/GenesysScripts.tsx
'use client';

import { logger } from '@/utils/logger';
import { useEffect, useRef } from 'react';
import type { GenesysBus, GenesysGlobal, GenesysSDK } from '../types/genesys.types';

// Extend Window interface to include Genesys properties
// Use the same types as defined in genesys.types.ts
declare global {
  interface Window {
    _genesys?: GenesysGlobal;
    _genesysJs: string;
    Genesys?: GenesysSDK;
    CXBus?: GenesysBus;
  }
}

interface GenesysScriptsProps {
  deploymentId: string;
  environment: string;
  orgId: string;
  memberId: string;
  planId: string;
  debug?: boolean;
  forceCloudChat?: boolean;
  chatGroup?: string;
}

/**
 * GenesysScripts Component
 * Responsible for configuring Genesys global objects but NOT loading scripts.
 * Actual script loading is handled by ChatService to avoid duplication.
 */
export function GenesysScripts({
  deploymentId,
  environment,
  orgId,
  memberId,
  planId,
  debug = false,
  forceCloudChat = true,
  chatGroup = 'default',
}: GenesysScriptsProps) {
  const initialized = useRef(false);
  const cloudChatEligible = forceCloudChat;

  useEffect(() => {
    if (initialized.current) return;
    
    logger.info('GenesysScripts: Configuring global objects', {
      environment,
      deploymentId,
      orgId,
      cloudChatEligible,
      timestamp: new Date().toISOString(),
    });

    // Configure global objects only, no script loading here
    initializeGenesysConfig();
    
    // Mark as initialized to prevent duplicate initialization
    initialized.current = true;

    // No cleanup needed - handled by ChatService
    return () => {
      logger.info('GenesysScripts: Component unmounting', {
        timestamp: new Date().toISOString(),
      });
    };
  }, [
    deploymentId,
    environment,
    orgId,
    debug,
    cloudChatEligible,
    chatGroup,
    memberId,
    planId,
  ]);

  // Initialize common Genesys configuration
  const initializeGenesysConfig = () => {
    // Configure for legacy chat if needed
    if (!cloudChatEligible) {
      if (!window._genesys) {
        const genesys: GenesysGlobal = function (...args: unknown[]) {
          if (!genesys.q) genesys.q = [];
          genesys.q.push(args);
        };
        genesys.c = getGenesysConfig();
        genesys.t = Number(new Date());
        window._genesys = genesys;
        
        logger.info('GenesysScripts: Configured legacy chat objects', {
          timestamp: new Date().toISOString(),
        });
      }
    } 
    // Configure for cloud chat (Web Messenger)
    else {
      window._genesysJs = 'Genesys';
      
      // Create Genesys function with proper typing
      const genesysObj = function(...args: unknown[]) {
        (genesysObj.q = genesysObj.q || []).push(args);
      } as GenesysSDK;
      // Initialize q property as empty array
      genesysObj.q = [];
      
      // Assign to window or keep existing
      window.Genesys = window.Genesys || genesysObj;
      
      // Ensure Genesys object exists before trying to set properties
      if (window.Genesys) {
        window.Genesys.t = Date.now();
        window.Genesys.c = {
          environment: `${environment.includes('prod') ? 'prod-us1' : 'use2'}`,
          deploymentId: deploymentId
        };
        
        logger.info('GenesysScripts: Configured Web Messenger objects', {
          environment: window.Genesys.c.environment,
          deploymentId: window.Genesys.c.deploymentId,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  // Get Genesys configuration for legacy chat
  const getGenesysConfig = () => {
    return {
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
                targetAddress: chatGroup,
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
            primaryColor: '#0066CC',
            backgroundColor: '#FFFFFF',
            textColor: '#111827',
            fontFamily: 'Univers-45, sans-serif',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            buttonStyle: {
              padding: '0.75rem 1.25rem',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
            },
            chatButton: {
              width: '4rem',
              height: '4rem',
              borderRadius: '9999px',
              backgroundColor: '#0066CC',
              color: '#FFFFFF',
              boxShadow: '0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)',
            },
            messageStyle: {
              userMessage: {
                backgroundColor: '#0066CC',
                color: '#FFFFFF',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
              agentMessage: {
                backgroundColor: '#5DC1FD',
                color: '#FFFFFF',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
              systemMessage: {
                backgroundColor: '#F2F2F2',
                color: '#333333',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
            },
          },
        },
      },
    } as GenesysGlobal['c'];
  };

  // This component doesn't render anything
  return null;
}
