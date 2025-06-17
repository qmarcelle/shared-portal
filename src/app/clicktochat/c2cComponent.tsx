import { loadScriptOrStyle } from '@/app/clicktochat/loadScript';
import { useEffect, useState } from 'react';
import { getClickToChatData } from './actions/getClickToChatData';
import { useChatStore } from './stores/clickToChatStore';
import { ChatDataStatus } from './types/c2ctypes';

export const C2CLegacy = ({ memCK }: { memCK?: string }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isChatReady, setIsChatReady] = useState(false);
  const {chatActive, setChatActive} = useChatStore();

  useEffect(() => {
    const fetchChatData = async () => {
      const chatData = await getClickToChatData();
      if (chatData.status == ChatDataStatus.SUCCESS) {
        window.chatConfig = { 
          ...chatData.data!, 
          setActive: setChatActive
         };
        setIsChatReady(true);
      } else {
        setIsChatReady(false);
      }
    };

    fetchChatData();
  }, [memCK]);

  useEffect(() => {
    const assetIds = [
      'Jquery_3_5_1',
      //      'genesysis_default_js',
      'c2cBCBST_default',
      'genesysis_default_css',
      'c2cBCBST_override',
    ];

    if (isChatReady) {
      loadScriptOrStyle(
        'https://code.jquery.com/jquery-3.5.1.min.js',
        'script',
        'Jquery_3_5_1',
      );
      loadScriptOrStyle(
        '/assets/chat/c2cBCBST_default.js',
        'script',
        'c2cBCBST_default',
      );
      loadScriptOrStyle(
        '/assets/chat/genesysis_default.css',
        'style',
        'genesysis_default_css',
      );
      loadScriptOrStyle(
        '/assets/chat/c2cBCBST_override.css',
        'style',
        'c2cBCBST_override',
      );
      // loadScriptOrStyle(
      //   '/assets/chat/genesysis_default.js',
      //   'script',
      //   'genesysis_default_js',
      // );

      fetch('/assets/chat/genesysis_default.html')
        .then((response) => response.text())
        .then((data) => setHtmlContent(data));
    }

    return () => {
      assetIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [isChatReady]);

  return (
    isChatReady && (
      <div
        id="bcbstgenesys"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    )
  );
};
