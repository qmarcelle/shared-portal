(function (window, document) {
  'use strict';

  // Initialize a logger object to mimic a central logger import for IIFE context
  const logger = {
    error: (...args) => console.error('[Genesys]', ...args),
    warn: (...args) => console.warn('[Genesys]', ...args),
    info: (...args) => console.log('[Genesys]', ...args) // Added info method and prefix
  };

  // Initialize global flags for coordinating chat open requests
  window.genesysLegacyChatOpenRequested = false;
  window.genesysLegacyChatIsReady = false;
  let firstChatButtonClick = true; // Added for audio alert on first click
  window.customPreChatCompleted = false; // Initialize the new flag

  // === CONFIG SECTION ===
  // Validates and sets configuration with defaults
  const validateConfig = (cfgToValidate) => {
    const cfg = { ...cfgToValidate }; // Work on a copy
    const requiredLegacy = ['clickToChatToken', 'clickToChatEndpoint'];
    const requiredCloud = ['deploymentId', 'orgId'];

    const mode = cfg.chatMode || 'legacy'; // Default to legacy if chatMode is not set
    let missingFields = [];

    if (mode === 'legacy') {
      missingFields = requiredLegacy.filter((field) => !cfg[field]);
    } else if (mode === 'cloud') {
      missingFields = requiredCloud.filter((field) => !cfg[field]);
    } else {
      logger.error('[Genesys] Unknown chat mode in validateConfig:', mode);
      missingFields = [...requiredLegacy, ...requiredCloud];
    }

    if (missingFields.length > 0) {
      logger.error(
        `[Genesys] Missing required fields for ${mode} mode:`,
        missingFields.join(', '),
      );
    }

    return {
      ...cfg,
      chatMode: mode,
      targetContainer: cfg.targetContainer || 'genesys-chat-container',
      isChatAvailable: cfg.isChatAvailable !== 'false',
      isChatEligibleMember: cfg.isChatEligibleMember === 'true',
      isDemoMember: cfg.isDemoMember === 'true',
      isAmplifyMem: cfg.isAmplifyMem === 'true',
      isCobrowseActive: cfg.isCobrowseActive === 'true',
      isMagellanVAMember: cfg.isMagellanVAMember === 'true',
      isMedicalAdvantageGroup: cfg.isMedicalAdvantageGroup === 'true',
      routingchatbotEligible: cfg.routingchatbotEligible === 'true',
      numberOfPlans: parseInt(cfg.numberOfPlans || '1', 10) || 1,
      currentPlanName: cfg.currentPlanName || '',
      // Ensure boolean values from string inputs for JSP compatibility
      isIDCardEligible: cfg.isIDCardEligible === 'true',
      isCobraEligible: cfg.isCobraEligible === 'true',
      isDental: cfg.isDental === 'true',
      isBlueEliteGroup: cfg.isBlueEliteGroup === 'true',
    };
  };

  // Load and validate config
  const sourceChatSettings = window.chatSettings || {};
  const cfg = validateConfig(sourceChatSettings);

  // Restore gmsServicesConfig exactly as in JSPF, using cfg for properties
  const gmsServicesConfig = {
    GMSChatURL: () =>
      cfg.isDemoMember ? cfg.clickToChatDemoEndPoint : cfg.clickToChatEndpoint,
  };

  // Validate critical settings for cloud mode
  if (cfg.chatMode === 'cloud' && (!cfg.deploymentId || !cfg.orgId)) {
    logger.error('[Genesys] Cloud chat mode requires deploymentId and orgId', {
      deploymentId: cfg.deploymentId,
      orgId: cfg.orgId,
    });
  }

  // === UTILITY FUNCTIONS ===
  // Promise-based resource loading
  const loadResource = {
    script: (src, attributes = {}) => {
      return new Promise((resolve, reject) => {
        if (!src) {
          reject(new Error('Script source URL is missing.'));
          return;
        }
        const cacheBuster = `_t=${Date.now()}`;
        const finalSrc = src + (src.includes('?') ? '&' : '?') + cacheBuster;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = finalSrc;
        Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, String(value))); // Ensure attributes are set
        script.onload = () => resolve(script);
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${finalSrc}`));
        document.head.appendChild(script);
      });
    },
    style: (cssText, id) => {
      return new Promise((resolve) => {
        const styleEl = document.createElement('style');
        if (id) styleEl.id = id; // Ensure id is set on the style element
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
        resolve(styleEl);
      });
    },
  };

  // Target container finder
  const getTargetContainer = () => {
    const container = document.getElementById(cfg.targetContainer);
    if (!container) {
      logger.warn(
        `[Genesys] Target container #${cfg.targetContainer} not found, using document.body`,
      );
      return document.body;
    }
    return container;
  };

  // === CSS INJECTION ===
  const criticalCSS = `
  /* Critical styles for chat button and window - compatible with genesys-chat-container */
  .cx-widget.cx-webchat-chat-button {
    display: flex !important; position: fixed !important; right: 20px !important; bottom: 20px !important;
    z-index: 999 !important; cursor: pointer !important; background-color: #0056b3 !important;
    color: white !important; border-radius: 50px !important; padding: 10px 20px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important; transition: all 0.3s ease !important;
    min-width: 100px !important; min-height: 45px !important; align-items: center !important;
    justify-content: center !important; opacity: 1 !important; visibility: visible !important;
  }
  .cx-widget.cx-webchat-chat-button:hover {
    background-color: #003d7a !important; transform: translateY(-2px) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
  }
  /* Modal styles */
  .cobrowse-card {
    color: #333; font-family: sans-serif; line-height: 230%; position: fixed;
    padding: 25px; background: white; border-radius: 15px; top: 50px; left: 50%;
    width: 75%; max-width: 700px; transform: translateX(-50%);
  }
  /* Additional helpers */
  .cobrowse-btn {
    display: block; width: 100%; margin: 10px 0; padding: 10px; text-align: center;
    border-radius: 4px; background: #0078d4; color: white; cursor: pointer; border: none;
  }
  .cobrowse-btn-secondary { background: #f0f0f0; color: #333; border: 1px solid #ccc; }
  .cobrowse-phoneicon:after { content: '📞'; margin-left: 5px; }
  .cobrowse-chaticon:after { content: '💬'; margin-left: 5px; }
  .cobrowse-chatClose { position: absolute; right: 15px; top: 10px; font-size: 24px; cursor: pointer; }
  `;

  loadResource
    .style(criticalCSS, 'genesys-chat-styles')
    .catch((err) => logger.error('[Genesys] Failed to load chat styles:', err));

  // === MODAL INJECTION ===
  function injectModals() {
    const targetContainer = getTargetContainer();
    const wrapper = document.createElement('div');
    wrapper.id = 'genesys-chat-modals';
    // Using cfg properties directly for modal content
    wrapper.innerHTML = `
<div id="cobrowse-sessionConfirm" class="modal" style="background: rgba(50, 50, 50, 0.4); position: fixed; bottom: 0; top: 0; left: 0; right: 0; display: none; z-index: 9999;">
  <div class="cobrowse-card" style="width:100%">
    <div style="text-align:left; margin-bottom:5px"><b>Are you on the phone with us?</b></div>
    <div>We can help better if we can see your screen.</div>
    <div style="float:left;margin-top:10px;color:rgb(0,122,255)">
      <a class="btn btn-secondary cobrowse-deny-button" onclick="showCobrowseContactUsModal()">No</a>
      <a class="btn btn-primary cobrowse-allow-button" style="margin-left:10px" onclick="showCobrowseModal()">Yes</a>
    </div>
  </div>
</div>
<div class="modal" id="cobrowse-sessionYesModal" tabindex="-1" role="dialog" style="display: none; z-index: 9999;">
  <div class="modal-dialog modal-dialog-bottom">
    <div class="modal-content sessionmodalcontent">
      <div class="modal-body">
        <div class='scrSharingHead'>Your session ID is <span id="cobrowse-sessionToken"></span></div>
        <div class='scrSharingSubHead'>Read this ID number to the representative you're speaking with when they ask for it.</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="endCoBrowseCall()">Cancel</button>
      </div>
    </div>
  </div>
</div>
<div class="modal" id="cobrowse-contactUsScreen1" tabindex="-1" role="dialog" style="background: rgba(50, 50, 50, 0.4); position: fixed; bottom: 0; top: 0; left: 0; right: 0; display: none; z-index: 9999;">
  <div style="color: #333; font-family:sans-serif; line-height:230%; position:fixed; padding:25px; background:white; top:50px; left:50%; width:75%; max-width:520px; transform:translateX(-50%);">
    <div class="scrSharingHead">How would you like to talk to us?</div>
    <div class="cobrowse-scrSharingSubHead">Choose an option to talk to our Member Services team</div>
    <button id="phoneDetails_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="cobrowseContactUsOption()">PHONE <span class="phoneIcon cobrowse-phoneicon"></span></button>
    ${cfg.isChatEligibleMember || cfg.isDemoMember ? `<button id="openChat_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="openWebChatWidget()">CHAT <span class="chatIcon cobrowse-chaticon"></span></button>` : ''}
  </div>
</div>
<div class="modal" id="cobrowse-contactUsScreen2" tabindex="-1" role="dialog" style="display: none; z-index: 9999;">
  <div style="background: rgba(50, 50, 50, 0); position: fixed; bottom: 0; top: 0; left: 0; right: 0">
    <div style="color: #333; font-family:sans-serif; line-height:230%; position:fixed; padding:25px; background:white; border-radius:15px; top:50px; left:50%; width:75%; max-width:700px; transform:translateX(-50%);">
      <a class="cobrowse-chatClose" onclick="cobrowseClosePopup()">&times;</a>
      <div class="cobrowse-main-phone">
        <div class="cobrowse-phone-title"><span>Call us at</span></div>
        <div class="cobrowse-phone-number"><span class="href-col">${cfg.opsPhone || 'Contact support'}</span></div>
        <div class="cobrowse-phone-subtitle"><span>Once you're on the line with us, say "share your screen."</span></div>
      </div>
      <div class="cobrowse-availability">
        <div class="cobrowse-hours"><b>Hours of operation</b></div>
        <div class="hrs-opt">${cfg.opsPhoneHours || 'Please call for current hours'}</div>
      </div>
      <div class="cobrowse-shareScreen-link"><span class="cobrowse-cobrowse-offer">Already on a call? <a class="cobrowse-cobrowse-link" onclick="cobrowseSessionModal()">Share your screen</a></span></div>
    </div>
  </div>
</div>
    `;
    targetContainer.appendChild(wrapper);
  }

  try {
    injectModals();
  } catch (error) {
    logger.error('[Genesys] Failed to inject modals:', error);
  }

  // === AUDIO NOTIFICATION ===
  const initAudioAlert = () => {
    const webAlert = new Audio();
    try {
      webAlert.src = '/assets/genesys/sounds/bell.mp3';
      webAlert.muted = true;
      webAlert.load();
      webAlert.addEventListener('canplaythrough', () => {
        /* Audio loaded */
      });
      webAlert.addEventListener('error', (e) => {
        logger.error('[Genesys] Audio error', e);
        webAlert.play = () => {
          /* Audio unavailable, silent fallback */
        };
      });
      webAlert.playMuteSoundOnce = function () {
        this.muted = true;
        const playPromise = this.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            logger.warn(
              '[Genesys] Muted audio playMuteSoundOnce failed:',
              error,
            );
          });
        }
      };
      return webAlert;
    } catch (err) {
      logger.error('[Genesys] Audio initialization failed:', err);
      return {
        play: () => {
          /* Audio unavailable */
        },
        playMuteSoundOnce: () => {
          /* Audio unavailable */
        },
      };
    }
  };
  const webAlert = initAudioAlert();

  // === COBROWSE INTEGRATION ===
  function buildConsent(title, message) {
    return new Promise((resolve) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="background:rgba(50,50,50,0.4);position:fixed;inset:0;z-index:2147483647">
          <div class="cobrowse-card">
            <div style="text-align:left;margin-bottom:10px"><b>${title}</b></div>
            <div>${message}</div>
            <div style="float:left;color:rgb(0,122,255);margin-top:10px">
              <a class="cobrowse-allow btn btn-primary">Yes</a>
              <a class="cobrowse-deny btn btn-secondary" style="margin-left:10px">No</a>
            </div>
          </div>
        </div>`;
      el.querySelector('.cobrowse-allow').onclick = () => {
        resolve(true);
        el.remove();
        setTimeout(() => {
          const controls = document.querySelector('.cbio_session_controls');
          if (controls) controls.innerHTML = 'End Screen Sharing';
        }, 400);
      };
      el.querySelector('.cobrowse-deny').onclick = () => {
        resolve(false);
        el.remove();
      };
      document.body.appendChild(el);
    });
  }

  if (cfg.isCobrowseActive) {
    window.CobrowseIO = window.CobrowseIO || {};
    CobrowseIO.confirmSession = () =>
      buildConsent(
        "We'd like to share your screen",
        'Sharing only your BCBST.com tab. OK?',
      );
    CobrowseIO.confirmRemoteControl = () =>
      buildConsent("We'd like control", 'We can click to help. OK?');
    (function (w, t, c) {
      const p = new Promise((r) => {
        w[c] = {
          client: () => {
            if (!w[c].loaded) {
              const s = document.createElement(t);
              s.src = 'https://js.cobrowse.io/CobrowseIO.js';
              s.async = 1;
              document.head.appendChild(s);
              s.onload = () => {
                w[c].loaded = true;
                r(w[c]);
              };
            }
            return p;
          },
        };
      });
    })(window, 'script', 'CobrowseIO');
  }

  // === JQUERY & INITIALIZATION ===
  const loadJQuery = () => {
    if (window.jQuery) {
      return Promise.resolve(window.jQuery);
    }
    return loadResource
      .script('https://code.jquery.com/jquery-3.6.0.min.js')
      .then(() => window.jQuery)
      .catch((err) => {
        logger.error('[Genesys] jQuery loading failed:', err);
        throw err;
      });
  };

  // Safety timeout to ensure chat button visibility
  setTimeout(() => {
    const existingButton = document.querySelector(
      '.cx-widget.cx-webchat-chat-button',
    );
    if (!existingButton) {
      if (
        window._forceChatButtonCreate &&
        typeof window._forceChatButtonCreate === 'function'
      ) {
        window._forceChatButtonCreate();
      }
      if (window._genesysCXBus) {
        try {
          window._genesysCXBus.command('WebChat.showChatButton');
        } catch (e) {
          logger.error(
            '[Genesys] Error showing button via CXBus in safety timeout:',
            e,
          );
        }
      }
      const style = document.createElement('style');
      style.id = 'genesys-safety-timeout-styles';
      style.textContent = `
        .cx-widget.cx-webchat-chat-button {
          display: flex !important; visibility: visible !important; opacity: 1 !important;
          z-index: 9999 !important;
        }`;
      document.head.appendChild(style);
      document.dispatchEvent(new CustomEvent('genesys:create-button'));
    } else {
      existingButton.style.display = 'flex';
      existingButton.style.visibility = 'visible';
      existingButton.style.opacity = '1';
    }
  }, 10000);

  // === CHAT WIDGET INITIALIZATION HELPER FUNCTIONS (Ported from JSPF & refactored) ===
  // These functions are used within initializeChatWidget and its sub-functions.
  // They now explicitly accept `currentCfg` or other dependencies if needed.

  const clientIdConst = {
    BlueCare: 'BC',
    BlueCarePlus: 'DS',
    CoverTN: 'CT',
    CoverKids: 'CK',
    SeniorCare: 'BA',
    Individual: 'INDV',
    BlueElite: 'INDVMX',
  };

  const chatTypeConst = {
    BlueCareChat: 'BlueCare_Chat',
    SeniorCareChat: 'SCD_Chat',
    DefaultChat: 'MBAChat',
  };

  // Helper to set chat disclaimer message based on client ID
  function setChatDisclaimerMesg(ciciId, consts) {
    let disclaimerMesg = '';
    switch (ciciId) {
      case consts.BlueCare:
      case consts.BlueCarePlus:
        disclaimerMesg =
          'For quality assurance your chat may be monitored and/or recorded. Benefits are based on the member&#39;s eligibility when services are rendered. Benefits are determined by the Division of TennCare and are subject to change.';
        break;
      case consts.CoverTN:
        disclaimerMesg =
          'This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim.';
        break;
      default:
        disclaimerMesg =
          'This information provided today is based on current eligibility and contract limitations.<br>Final determination will be made upon the completion of the processing of your claim.<br>For quality assurance your chat may be monitored and/or recorded.<br><br>Estimates are not a confirmation of coverage or benefits. The Health Care Cost Estimator tool is designed to help you plan for health care costs. Your actual cost may be different based on your health status and services provided. Final determination will be made when the claims are received based on eligibility at time of service. Payment of benefits remains subject to any contract terms, exclusions,and/or riders. <br> <br> To better serve you, we may send you a survey or questions about your chat experience by email. Communications via unencrypted email over the internet are not secure, and there is a possibility that information included in an email can be intercepted and read by other parties besides the person to whom it is addressed.';
    }
    return disclaimerMesg;
  }

  // Helper to open chat disclaimer overlay
  function OpenChatDisclaimer(calculatedCiciId, $, LocalCXBus) {
    if (LocalCXBus) {
      const disclaimerMesg = setChatDisclaimerMesg(
        calculatedCiciId,
        clientIdConst,
      );
      LocalCXBus.command('WebChat.showOverlay', {
        html: $(
          "<div id='disclaimerId'><p class='termsNConditions'><span class='modalTitle'>Terms and Conditions</span> <br><br> " +
            disclaimerMesg +
            " </p> </div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatDisclaimer();'>CLOSE</button></div>",
        ),
        hideFooter: true,
      })
        .done(() => {
          $("button[data-message='ChatFormSubmit']").hide();
        })
        .fail((e) => {
          logger.error('[Genesys] OpenChatDisclaimer failed:', e);
        });
    } else {
      logger.error('[Genesys] CXBus not available for OpenChatDisclaimer.');
    }
  }

  // Helper to close chat disclaimer overlay (exposed to window for onclick)
  window.CloseChatDisclaimer = function () {
    if (window._genesysCXBus) {
      window._genesysCXBus
        .command('WebChat.hideOverlay')
        .done(() => {
          $("button[data-message='ChatFormSubmit']").show();
        })
        .fail((e) => {
          logger.error('[Genesys] CloseChatDisclaimer failed:', e);
        });
    } else {
      logger.error('[Genesys] CXBus not available for CloseChatDisclaimer.');
    }
  };

  // Helper to open chat connection error overlay (exposed to window for direct call if needed)
  window.OpenChatConnectionErrorOverlay = function ($) {
    // Added $ as parameter
    if (window._genesysCXBus) {
      window._genesysCXBus
        .command('WebChat.showOverlay', {
          html: $(
            "<div><p class='termsNConditions'><span class='modalTitle'>Error Connecting to Chat Server</span><br><br>We're sorry for the inconvenience, please logout and log back in.</p></div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatConnectionErrorOverlay();'>CLOSE</button></div>",
          ),
          hideFooter: false, // As per original logic
        })
        .fail((e) => {
          logger.error('[Genesys] OpenChatConnectionErrorOverlay failed:', e);
        });
    } else {
      logger.error(
        '[Genesys] CXBus not available for OpenChatConnectionErrorOverlay.',
      );
    }
  };

  // Helper to close chat connection error overlay (exposed to window for onclick)
  window.CloseChatConnectionErrorOverlay = function () {
    if (window._genesysCXBus) {
      window._genesysCXBus.command('WebChat.hideOverlay').fail((e) => {
        logger.error('[Genesys] CloseChatConnectionErrorOverlay failed:', e);
      });
    } else {
      logger.error(
        '[Genesys] CXBus not available for CloseChatConnectionErrorOverlay.',
      );
    }
  };

  // Helper to close chat window (exposed to window for direct call if needed)
  window.closeChatWindow = function () {
    if (window._genesysCXBus) {
      // Placeholder for actual GA call: logger.log('[GA4] - Chat Interaction - End Chat');
      window._genesysCXBus.command('WebChat.close').fail((e) => {
        logger.warn(
          '[Genesys] WebChat.close command failed or no active session (called by closeChatWindow).',
          e,
        );
      });
    } else {
      logger.error('[Genesys] CXBus not available for closeChatWindow.');
    }
  };

  // Maps chatSettings to Genesys userData format
  function mapChatSettingsToUserData(settings) {
    if (!settings) {
      logger.warn(
        '[Genesys] mapChatSettingsToUserData: settings is undefined. Returning empty userData.',
      );
      return {};
    }
    const userData = {
      firstName: settings.formattedFirstName || settings.firstname || '',
      lastName: settings.memberLastName || settings.lastname || '',
      email: settings.email || '',
      userID: settings.userID || '',
      memberMedicalPlanID: settings.memberMedicalPlanID || '',
      subscriberID: settings.subscriberID || '',
      sfx: settings.sfx || '',
      groupId: settings.groupId || '',
      isDemoMember: String(
        settings.isDemoMember === true || settings.isDemoMember === 'true',
      ),
      isAmplifyMem: String(
        settings.isAmplifyMem === true || settings.isAmplifyMem === 'true',
      ),
      currentPlanName: settings.currentPlanName || '',
    };
    Object.keys(userData).forEach((key) => {
      if (
        userData[key] === undefined ||
        userData[key] === null ||
        userData[key] === ''
      ) {
        delete userData[key];
      }
    });
    return userData;
  }

  // Calculates CICI ID based on configuration
  function getCalculatedCiciId(currentCfg) {
    if (String(currentCfg.isBlueEliteGroup) === 'true') return 'INDVMX';
    if (currentCfg.groupType === 'INDV') return 'INDV';
    if (
      currentCfg.clientClassificationId &&
      typeof currentCfg.clientClassificationId === 'string' &&
      currentCfg.clientClassificationId.trim() !== '' &&
      currentCfg.clientClassificationId.trim().toLowerCase() !== 'undefined' &&
      currentCfg.clientClassificationId.trim().toLowerCase() !== 'null'
    ) {
      return currentCfg.clientClassificationId.trim();
    }
    if (
      currentCfg.memberClientID &&
      typeof currentCfg.memberClientID === 'string' &&
      currentCfg.memberClientID.trim() !== '' &&
      currentCfg.memberClientID.trim().toLowerCase() !== 'undefined' &&
      currentCfg.memberClientID.trim().toLowerCase() !== 'null'
    ) {
      return currentCfg.memberClientID.trim();
    }
    return 'Default';
  }

  // Determines chat type based on CICI ID
  const getChatType = (ciciId) => {
    switch (ciciId) {
      case clientIdConst.BlueCare:
      case clientIdConst.BlueCarePlus:
      case clientIdConst.CoverTN:
      case clientIdConst.CoverKids:
        return chatTypeConst.BlueCareChat;
      case clientIdConst.SeniorCare:
      case clientIdConst.BlueElite:
        return chatTypeConst.SeniorCareChat;
      default:
        return chatTypeConst.DefaultChat;
    }
  };

  // Sets form options based on client ID and configuration
  function setOptions(optionsVariable, currentCfg) {
    const calculatedCiciId = getCalculatedCiciId(currentCfg); // Ensure calculatedCiciId is derived from currentCfg
    var options =
      calculatedCiciId === clientIdConst.SeniorCare
        ? []
        : [{ disabled: 'disabled', selected: 'selected', text: 'Select one' }];

    switch (optionsVariable) {
      case clientIdConst.BlueCare:
        options.push(
          { text: 'Eligibility', value: 'Eligibility' },
          { text: 'TennCare PCP', value: 'TennCare PCP' },
          { text: 'Benefits', value: 'Benefits' },
          { text: 'Transportation', value: 'Transportation' },
        );
        if (currentCfg.isIDCardEligible && currentCfg.routingchatbotEligible)
          options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
        break;
      case clientIdConst.BlueCarePlus:
      case clientIdConst.CoverTN:
      case clientIdConst.CoverKids:
        options.push(
          { text: 'Eligibility', value: 'Eligibility' },
          { text: 'Benefits', value: 'Benefits' },
          { text: 'Claims Financial', value: 'Claims Financial' },
        );
        if (currentCfg.isIDCardEligible && currentCfg.routingchatbotEligible)
          options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
        options.push(
          {
            text: 'Member Update Information',
            value: 'Member Update Information',
          },
          { text: 'Pharmacy', value: 'Pharmacy' },
        );
        break;
      case clientIdConst.SeniorCare:
        break; // No options for SeniorCare
      case 'dentalOnly':
        options.push(
          { text: 'Benefits and Coverage', value: 'Benefits and Coverage' },
          { text: 'New or Existing Claims', value: 'New Or Existing Claims' },
        );
        if (currentCfg.groupType === 'INDV')
          options.push({ text: 'Premium Billing', value: 'Premium Billing' });
        options.push(
          { text: 'Deductibles', value: 'Deductibles' },
          { text: 'Find Care', value: 'Find Care' },
        );
        if (currentCfg.isCobraEligible)
          options.push({ text: 'COBRA', value: 'COBRA' });
        if (currentCfg.isIDCardEligible && currentCfg.routingchatbotEligible)
          options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
        options.push({ text: 'Other', value: 'Other' });
        break;
      case clientIdConst.Individual:
        options.push(
          { text: 'Benefits and Coverage', value: 'Benefits and Coverage' },
          { text: 'New or Existing Claims', value: 'New Or Existing Claims' },
          { text: 'Premium Billing', value: 'Premium Billing' },
          { text: 'Deductibles', value: 'Deductibles' },
          {
            text: 'Pharmacy and Prescriptions',
            value: 'Pharmacy And Prescriptions',
          },
          { text: 'Find Care', value: 'Find Care' },
        );
        if (currentCfg.isDental)
          options.push({ text: 'Dental', value: 'Dental' });
        if (currentCfg.isIDCardEligible && currentCfg.routingchatbotEligible)
          options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
        options.push({ text: 'Other', value: 'Other' });
        break;
      case clientIdConst.BlueElite:
        options.push(
          { text: 'Address Update', value: 'Address Update' },
          { text: 'Bank Draft', value: 'Bank Draft' },
          { text: 'Premium Billing', value: 'Premium Billing' },
          { text: 'Report Date of Death', value: 'Report Date of Death' },
        );
        if (currentCfg.isDental)
          options.push({ text: 'Dental', value: 'Dental' });
        if (currentCfg.isIDCardEligible && currentCfg.routingchatbotEligible)
          options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
        options.push({ text: 'All Other', value: 'All Other' });
        break;
      default: // Default options
        options.push(
          { text: 'Benefits and Coverage', value: 'Benefits and Coverage' },
          { text: 'New or Existing Claims', value: 'New Or Existing Claims' },
          { text: 'Deductibles', value: 'Deductibles' },
          {
            text: 'Pharmacy and Prescriptions',
            value: 'Pharmacy And Prescriptions',
          },
          { text: 'Find Care', value: 'Find Care' },
        );
        if (currentCfg.isDental)
          options.push({ text: 'Dental', value: 'Dental' });
        if (currentCfg.isCobraEligible)
          options.push({ text: 'COBRA', value: 'COBRA' });
        if (currentCfg.isIDCardEligible && currentCfg.routingchatbotEligible)
          options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
        options.push({ text: 'Other', value: 'Other' });
    }
    return options;
  }

  // Adds self-service links to the form object for after-hours display
  function addAfterHoursLinks(formObject, currentCfg) {
    if (!formObject || !formObject.inputs) {
      logger.error(
        '[Genesys] addAfterHoursLinks: Invalid formObject or missing inputs array.',
      );
      return;
    }
    if (!currentCfg || !Array.isArray(currentCfg.selfServiceLinks)) {
      logger.warn(
        '[Genesys] addAfterHoursLinks: selfServiceLinks not available in currentCfg or not an array. No links will be added.',
      );
      return;
    }
    formObject.inputs.push({
      custom:
        "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>In the meantime, you can use your BCBST.com account to:</td></tr>",
    });
    currentCfg.selfServiceLinks.forEach(function (entry) {
      if (entry && entry.key && entry.value) {
        formObject.inputs.push({
          custom: `<tr><td colspan='2'><a style='margin: 10px 0; font-size: 13px; text-transform: capitalize;' class='btn btn-secondary buttonWide' href='${entry.value}' target='_blank'>${entry.key}</a></td></tr>`,
        });
      } else {
        logger.warn(
          '[Genesys] addAfterHoursLinks: Skipping invalid selfServiceLink entry:',
          entry,
        );
      }
    });
  }

  // Customizes chat appearance for Amplify members
  function customizeAmplify(currentCfg, $) {
    if (currentCfg.isAmplifyMem === true) {
      $('.cx-webchat').addClass('amplifyHealth');
      $('div.cx-icon, span.cx-icon')
        .filter(function () {
          const parent = $(this).parent();
          return parent.is(
            '.cx-widget-chat-button, .cx-chat-button, .cx-titlebar, .cx-message-agent .cx-avatar-wrapper',
          );
        })
        .html(
          '<img src="/wps/wcm/myconnect/member/029bc5b8-e440-485e-89f5-6bdc04a0325e/Chat-Icon-40x40.svg?MOD=AJPERES&ContentCache=NONE&CACHE=NONE&CVID=oe5Lict" alt="Chat Advisor" style="width: 45px;height: 45px;padding-bottom: 10px;padding-right: 10px;"/>',
        );
    }
  }

  // Applies message scaling for specific chat types
  function applyMessageScaler(currentCfg, $) {
    const calculatedCiciId = getCalculatedCiciId(currentCfg);
    const currentChatType = getChatType(calculatedCiciId);
    if (
      currentChatType === chatTypeConst.SeniorCareChat ||
      currentChatType === chatTypeConst.BlueCareChat
    ) {
      const webchatDiv = $('.cx-webchat');
      if (webchatDiv.length) {
        webchatDiv.addClass('webchatScaler');
        if (currentChatType === chatTypeConst.SeniorCareChat) {
          webchatDiv.addClass('webchatSenior');
        }
      }
      const transcriptDiv = $('.cx-webchat .cx-body .cx-transcript');
      if (transcriptDiv.length) {
        transcriptDiv.addClass('transcriptScaler');
      }
    }
  }

  // Builds the array of input fields for the chat form
  // Note: Uses `window.chatSettings` (raw) and `isAmplifyMem` (global const) as per original logic.
  // This could be further refactored to take `currentCfg` if consistent use of processed config is desired.
  function buildActiveChatInputs(currentCfg) {
    // Added currentCfg
    const inputs = [];
    const cs = window.chatSettings || {}; // Original uses raw window.chatSettings

    // escapeHTML is assumed to be a globally available function as it's not defined in the original script
    const escapeHTML =
      window.escapeHTML ||
      function (text) {
        return text;
      }; // Basic fallback

    if (window.customPreChatCompleted) {
      inputs.push({
        custom:
          "<tr class='activeChat'><td colspan='2' style='padding-bottom:10px;'><h4 style='font-size: 1em; font-weight: bold; margin-bottom: 5px;'>Important Information:</h4></td></tr>",
      });
      const disclaimerMsg = setChatDisclaimerMesg(
        cs.clientClassificationId,
        clientIdConst,
      ); // cs from window.chatSettings
      inputs.push({
        custom: `<tr class='activeChat'><td colspan='2' style='font-size: 0.85em; padding-bottom:15px;'>${disclaimerMsg}</td></tr>`,
      });
    } else {
      inputs.push({
        custom: currentCfg.isAmplifyMem
          ? "<tr class='activeChat'><td colspan='2' data-message='Questions or need advice? Let\\'s talk.' style='font-size:30px'></td></tr>"
          : "<tr class='activeChat'><td colspan='2' data-message='We\\'re right here <br>for you. Let\\'s chat.' style='font-size:30px'></td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });
      inputs.push({
        custom:
          "<tr class='activeChat'><td colspan='2' style='padding-bottom:10px;'><h4 style='font-size: 1em; font-weight: bold; margin-bottom: 5px;'>Before you begin:</h4></td></tr>",
      });
      const disclaimerMsg = setChatDisclaimerMesg(
        cs.clientClassificationId,
        clientIdConst,
      ); // cs from window.chatSettings
      inputs.push({
        custom: `<tr class='activeChat'><td colspan='2' style='font-size: 0.85em; padding-bottom:15px;'>${disclaimerMsg}</td></tr>`,
      });

      if (
        cs.showPlanInfoInInternalForm !== false &&
        cs.GROUP_ID &&
        cs.PLAN_ID
      ) {
        // cs from window.chatSettings
        const planIdentifier =
          cs.PLAN_NAME || `Group ${cs.GROUP_ID} / Plan ${cs.PLAN_ID}`;
        inputs.push({
          custom: `<tr class='activeChat cx-plan-info'><td colspan='2' style='padding-bottom:10px; font-size:0.9em;'><div>You are currently viewing information for:</div><div class='cx-plan-info-text' style='font-weight:bold;'>${escapeHTML(planIdentifier)}</div></td></tr>`,
        });
      }

      inputs.push(
        {
          label: 'First Name',
          name: 'firstName',
          value: cs.firstName || '',
          maxlength: '100',
          validate: (e, v, u) => !u.isEmpty(v.firstName),
          validationMessage: 'Please enter your first name.',
        },
        {
          label: 'Last Name',
          name: 'lastName',
          value: cs.lastName || '',
          maxlength: '100',
          validate: (e, v, u) => !u.isEmpty(v.lastName),
          validationMessage: 'Please enter your last name.',
        },
        {
          label: 'Email',
          name: 'email',
          value: cs.email || '',
          maxlength: '100',
          validate: (e, v, u) => u.isEmail(v.email),
          validationMessage: 'Please enter a valid email address.',
        },
        {
          label: 'Subject',
          name: 'subject',
          value: cs.subject || 'General Inquiry',
          maxlength: '100',
          type: 'text',
        },
      );

      if (cs.inquiryTypes && cs.inquiryTypes.length > 0) {
        // cs from window.chatSettings
        inputs.push({
          label: 'How can we help you today?',
          name: 'INQ_TYPE',
          type: 'select',
          options: cs.inquiryTypes.map((it) => ({
            text: it.display,
            value: it.value,
          })),
          value: cs.INQ_TYPE || cs.inquiryTypes[0]?.value,
        });
      }
    }
    return inputs;
  }
  // SVG for chatBotAvatar
  const chatBotAvatarSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
      <title>BCBST-chatbot-avatar-20210112</title>
      <g id="BCBST-chatbot-avatar-20210112" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group"> <g id="Group-33">
                  <path d="M15.9932914,31.9865828 C24.8261578,31.9865828 31.9865828,24.8261578 31.9865828,15.9932914 C31.9865828,7.16042504 24.8261578,0 15.9932914,0 C7.16042504,0 0,7.16042504 0,15.9932914 C0,24.8261578 7.16042504,31.9865828 15.9932914,31.9865828" id="Fill-1" fill="#00A6E0"></path>
                  <path d="M22.4895836,6.61774981 L9.95449874,6.61774981 C7.58772009,6.61774981 5.66898207,8.53648783 5.66898207,10.903495 L5.66898207,18.5133315 C5.66898207,22.6231504 8.74517744,22.7988482 8.74517744,22.7988482 L8.74517744,26.1286514 C8.74517744,26.8675415 9.61384163,27.2644036 10.1724645,26.7804923 L14.7703073,22.7988482 L22.4895836,22.7988482 C24.8561338,22.7988482 26.7746433,20.8801101 26.7746433,18.5133315 L26.7746433,10.903495 C26.7746433,8.53648783 24.8561338,6.61774981 22.4895836,6.61774981" id="Fill-3" fill="#FFFFFF"></path>
          </g> <g id="BCBST_logo_stacked_BlueBlack_CMYK_2019_rrChecked" transform="translate(7.681342, 11.069182)">
                  <g id="Group" transform="translate(0.000000, 5.903564)"></g>
                  <g id="Group" transform="translate(1.084556, 0.000000)" fill="#0072BC" fill-rule="nonzero">
                      <path d="M3.87999466,4.44375457 C3.86341348,4.44375457 3.86341348,4.44375457 3.84683231,4.46033574 L3.13384184,5.53811203 C3.36597827,5.63759908 3.61469588,5.6873426 3.87999466,5.6873426 C4.14529344,5.6873426 4.39401104,5.63759908 4.62614748,5.53811203 L3.91315701,4.46033574 C3.89657583,4.46033574 3.87999466,4.44375457 3.87999466,4.44375457"></path>
                      <path d="M3.18358536,3.56495236 L2.10580907,3.46546531 C2.07264672,3.5981147 2.05606555,3.74734527 2.05606555,3.89657583 C2.05606555,4.34426752 2.22187728,4.75879687 2.48717606,5.07383917 L3.23332888,3.64785823 C3.26649123,3.5981147 3.26649123,3.56495236 3.18358536,3.56495236"></path>
                      <path d="M3.36597827,2.15555259 C3.01777362,2.25503963 2.7193125,2.45401372 2.48717606,2.7193125 L3.43230297,2.7193125 C3.44888414,2.7193125 3.46546531,2.70273132 3.43230297,2.66956897 C3.3493971,2.55350076 3.26649123,2.32136433 3.36597827,2.15555259"></path>
                      <path d="M5.25623208,2.7193125 C5.02409565,2.45401372 4.72563452,2.25503963 4.37742987,2.15555259 C4.47691691,2.3379455 4.39401104,2.57008193 4.294524,2.66956897 C4.27794283,2.68615015 4.27794283,2.70273132 4.294524,2.7193125 L5.25623208,2.7193125 Z"></path>
                      <path d="M4.55982278,3.56495236 C4.47691691,3.56495236 4.47691691,3.5981147 4.49349809,3.64785823 L5.23965091,5.07383917 C5.50494969,4.75879687 5.67076142,4.34426752 5.67076142,3.89657583 C5.67076142,3.74734527 5.65418025,3.5981147 5.6210179,3.46546531 L4.55982278,3.56495236 Z"></path>
                      <path d="M5.57127438,2.18871494 L5.57127438,0.0497435213 L2.17213376,0.0497435213 L2.17213376,2.18871494 L0.0331623475,2.18871494 L0.0331623475,5.60443673 L2.17213376,5.60443673 L2.17213376,7.74340814 L5.57127438,7.74340814 L5.57127438,5.58785556 L7.7102458,5.58785556 L7.7102458,2.18871494 L5.57127438,2.18871494 Z M3.87999466,1.79076677 C4.72563452,1.79076677 5.45520617,2.28820198 5.78682964,3.00119245 L4.294524,3.00119245 C4.07896874,3.00119245 3.9794817,2.86854306 3.9794817,2.76905602 C3.9794817,2.6529878 3.99606287,2.60324428 4.09554992,2.48717606 C4.21161813,2.3379455 4.12871226,2.07264672 3.87999466,2.05606555 C3.63127705,2.05606555 3.56495236,2.3379455 3.6644394,2.48717606 C3.76392644,2.61982545 3.78050762,2.6529878 3.78050762,2.76905602 C3.78050762,2.86854306 3.68102057,3.00119245 3.46546531,3.00119245 L1.97315968,3.00119245 C2.30478315,2.28820198 3.0343548,1.79076677 3.87999466,1.79076677 M1.77418559,3.89657583 C1.77418559,3.63127705 1.82392911,3.38255945 1.90683498,3.15042301 L1.90683498,3.15042301 L1.90683498,3.15042301 L3.31623475,3.2830724 C3.58153353,3.31623475 3.61469588,3.58153353 3.54837118,3.73076409 L2.58666311,5.55469321 L2.58666311,5.55469321 C2.08922789,5.17332621 1.77418559,4.55982278 1.77418559,3.89657583 M5.04067682,5.65418025 L5.04067682,5.65418025 C4.70905335,5.86973551 4.31110518,6.0023849 3.87999466,6.0023849 C3.44888414,6.0023849 3.05093597,5.86973551 2.7193125,5.65418025 L2.7193125,5.65418025 L2.7193125,5.65418025 L2.7193125,5.65418025 L3.74734527,4.11213109 C3.83025114,4.01264405 3.92973818,4.01264405 4.01264405,4.11213109 L5.04067682,5.65418025 C5.04067682,5.65418025 5.04067682,5.65418025 5.04067682,5.65418025 L5.04067682,5.65418025 L5.04067682,5.65418025 L5.04067682,5.65418025 Z M5.17332621,5.55469321 L5.17332621,5.55469321 L4.21161813,3.73076409 C4.14529344,3.58153353 4.17845579,3.31623475 4.44375457,3.2830724 L5.85315434,3.15042301 L5.85315434,3.15042301 L5.85315434,3.15042301 C5.9360602,3.38255945 5.98580373,3.63127705 5.98580373,3.89657583 C5.98580373,4.55982278 5.67076142,5.17332621 5.17332621,5.55469321"></path>
                      <path d="M14.5582706,0.0497435213 C13.7292119,0.464272865 12.9167344,0.696409298 11.9384451,0.696409298 C10.976737,0.696409298 10.1476783,0.464272865 9.31861965,0.0497435213 C8.77144092,1.11093864 8.68853505,2.85196189 9.15280791,4.294524 C9.6004996,5.6873426 10.4793018,6.96409298 11.9218639,7.75998932 C13.364426,6.96409298 14.2432283,5.6873426 14.6909199,4.294524 C15.1883552,2.85196189 15.1054493,1.11093864 14.5582706,0.0497435213 M14.1769036,4.12871226 C13.7789554,5.32255678 13.1322896,6.36717072 11.9550263,7.11332354 C11.9550263,7.11332354 11.9550263,7.11332354 11.9550263,7.11332354 L11.9550263,7.11332354 C11.9550263,7.11332354 11.9550263,7.11332354 11.9550263,7.11332354 C10.7611818,6.3837519 10.1310972,5.32255678 9.73314899,4.12871226 C9.36836317,3.06751714 9.2854573,1.82392911 9.68340547,0.862221035 C10.2803277,1.06119512 10.6285324,1.12751982 10.9435747,1.17726334 C11.2420358,1.22700686 11.5073346,1.26016921 11.9550263,1.26016921 L11.9550263,1.26016921 C12.402718,1.26016921 12.6680167,1.22700686 12.9664779,1.17726334 C13.2815202,1.12751982 13.646306,1.06119512 14.2266471,0.862221035 C14.6245953,1.84051029 14.5416894,3.06751714 14.1769036,4.12871226"></path>
                      <path d="M11.5570781,2.13897141 C11.5902405,2.17213376 11.5902405,2.22187728 11.639984,2.20529611 C11.6731463,2.20529611 11.6897275,2.18871494 11.7063087,2.15555259 C11.7063087,2.15555259 11.739471,2.15555259 11.7560522,2.15555259 C11.6897275,2.08922789 11.5570781,2.08922789 11.4741722,2.08922789 C11.5073346,2.13897141 11.5239158,2.12239024 11.5570781,2.13897141"></path>
                      <path d="M12.983059,1.45914329 C12.6348544,1.50888681 12.2866498,1.54204916 11.9550263,1.54204916 L11.9550263,1.54204916 C11.6234028,1.54204916 11.2751982,1.50888681 10.9269935,1.45914329 C10.5787889,1.40939977 10.2471654,1.3264939 9.88237956,1.24358803 C9.63366195,1.9565785 9.68340547,2.85196189 9.88237956,3.6644394 C10.2471654,5.17332621 11.1591299,6.3174272 11.9550263,6.83144359 C12.7509226,6.3174272 13.6794683,5.17332621 14.027673,3.6644394 C14.2266471,2.86854306 14.2763906,1.9565785 14.027673,1.24358803 C13.6628872,1.34307507 13.3312637,1.40939977 12.983059,1.45914329 M11.739471,6.11845312 C11.7228898,6.20135898 11.7560522,6.23452133 11.7560522,6.26768368 C11.739471,6.33400837 11.7063087,6.3174272 11.6897275,6.26768368 C11.6565651,6.20135898 11.639984,6.18477781 11.6234028,6.08529077 C11.6068216,5.9360602 11.6897275,5.86973551 11.7228898,5.83657316 C11.7560522,5.80341081 11.7892145,5.78682964 11.7892145,5.78682964 L11.8057957,6.03554725 C11.8057957,6.01896607 11.7560522,6.03554725 11.739471,6.11845312 M12.0710945,6.36717072 C12.0710945,6.40033307 12.0545133,6.43349542 11.9716075,6.43349542 C11.9052828,6.43349542 11.8721204,6.41691424 11.8721204,6.35058955 C11.8555392,6.05212842 11.8555392,5.50494969 11.8555392,5.50494969 C11.8555392,5.50494969 11.9384451,5.53811203 11.9716075,5.55469321 C11.9881886,5.55469321 12.021351,5.58785556 12.0710945,5.6210179 C12.0710945,5.63759908 12.0876757,5.63759908 12.0876757,5.65418025 C12.0876757,5.86973551 12.0710945,6.26768368 12.0710945,6.36717072 M12.3198121,5.80341081 C12.2534874,5.85315434 12.1705815,5.88631668 12.1705815,5.88631668 L12.1871627,5.67076142 C12.1871627,5.67076142 12.2037439,5.65418025 12.2037439,5.6210179 C12.1871627,5.57127438 12.0379321,5.47178734 11.9550263,5.43862499 C11.8721204,5.40546264 11.7560522,5.3723003 11.6731463,5.33913795 C11.4907534,5.25623208 11.4078475,5.09042034 11.4907534,4.90802743 C11.5239158,4.84170274 11.5902405,4.79195922 11.639984,4.77537804 C11.6897275,4.74221569 11.7560522,4.72563452 11.7560522,4.72563452 L11.7726334,4.9909333 C11.7726334,4.9909333 11.7560522,5.00751447 11.739471,5.02409565 C11.7228898,5.07383917 11.7726334,5.09042034 11.7726334,5.10700152 C11.8887016,5.15674504 12.0710945,5.23965091 12.2037439,5.3059756 C12.3695556,5.40546264 12.4358803,5.47178734 12.4358803,5.60443673 C12.4192991,5.6873426 12.3861368,5.75366729 12.3198121,5.80341081 M11.8389581,4.57640396 C11.9550263,4.59298513 12.0047698,4.59298513 12.120838,4.6095663 L12.1042568,5.12358269 L11.9881886,5.057258 L11.8721204,5.00751447 L11.8389581,4.57640396 Z M12.5851109,4.69247217 C12.5685297,4.79195922 12.502205,4.85828391 12.402718,4.92460861 C12.3032309,4.9909333 12.1871627,4.9909333 12.1871627,4.9909333 L12.2037439,4.675891 C12.2037439,4.675891 12.2203251,4.675891 12.2369062,4.64272865 C12.2534874,4.62614748 12.2534874,4.6095663 12.2534874,4.57640396 C12.2534874,4.55982278 12.2369062,4.54324161 12.2037439,4.52666043 C12.1705815,4.51007926 12.120838,4.51007926 12.1042568,4.51007926 C11.9550263,4.49349809 11.8057957,4.47691691 11.6565651,4.44375457 C11.3912664,4.39401104 11.1922923,4.24478048 11.2088735,3.9794817 C11.2254546,3.79708879 11.4078475,3.74734527 11.5404969,3.69760175 C11.5902405,3.78050762 11.6234028,3.84683231 11.639984,3.89657583 C11.6565651,3.96290053 11.6731463,4.01264405 11.6731463,4.01264405 C11.6731463,4.01264405 11.6068216,4.02922522 11.6234028,4.07896874 C11.6234028,4.12871226 11.6731463,4.14529344 11.7063087,4.14529344 C11.9052828,4.17845579 12.1540004,4.19503696 12.2866498,4.24478048 C12.3695556,4.27794283 12.4690427,4.32768635 12.5187862,4.39401104 C12.6016921,4.49349809 12.6182732,4.57640396 12.5851109,4.69247217 M11.7228898,3.44888414 C11.7228898,3.44888414 11.7892145,3.44888414 11.9384451,3.46546531 C12.0545133,3.46546531 12.1374192,3.51520884 12.1374192,3.51520884 L12.120838,4.07896874 C11.9881886,4.06238757 11.9052828,4.0458064 11.7892145,4.02922522 C11.7560522,3.83025114 11.7063087,3.74734527 11.6234028,3.5981147 C11.6068216,3.56495236 11.6234028,3.54837118 11.6234028,3.54837118 C11.639984,3.53179001 11.7228898,3.51520884 11.7228898,3.51520884 L11.7228898,3.44888414 Z M12.2369062,4.01264405 C12.2369062,4.01264405 12.2534874,3.74734527 12.2534874,3.61469588 C12.3198121,3.58153353 12.3363933,3.51520884 12.3198121,3.46546531 C12.3032309,3.43230297 12.2534874,3.41572179 12.2203251,3.39914062 C12.0710945,3.36597827 11.9384451,3.3493971 11.7892145,3.33281592 C11.6565651,3.31623475 11.5404969,3.29965358 11.4244287,3.26649123 C11.1757111,3.20016653 10.9601559,3.08409832 10.8440876,2.85196189 C10.7114382,2.57008193 10.8275065,2.22187728 11.1093864,2.07264672 C11.3083605,1.97315968 11.5404969,1.98974085 11.7560522,2.07264672 C11.8223769,2.10580907 11.8721204,2.15555259 11.9052828,2.22187728 C11.9218639,2.25503963 11.9550263,2.25503963 11.9716075,2.28820198 C11.9881886,2.30478315 11.9550263,2.32136433 11.9550263,2.32136433 C11.9052828,2.3379455 11.7560522,2.3379455 11.7063087,2.3379455 C11.639984,2.3379455 11.5404969,2.3379455 11.4741722,2.35452667 C11.5404969,2.38768902 11.6068216,2.43743254 11.6731463,2.47059489 C11.7063087,2.48717606 11.739471,2.48717606 11.7726334,2.50375724 C11.7892145,2.50375724 11.8389581,2.52033841 11.8389581,2.53691958 C11.8389581,2.55350076 11.8057957,2.57008193 11.7726334,2.57008193 C11.7063087,2.58666311 11.639984,2.58666311 11.5570781,2.57008193 C11.4410099,2.53691958 11.3912664,2.47059489 11.3083605,2.52033841 C11.258617,2.55350076 11.258617,2.61982545 11.2751982,2.68615015 C11.3083605,2.78563719 11.4078475,2.83538071 11.5073346,2.86854306 C11.8389581,2.9680301 12.1705815,2.91828658 12.502205,3.08409832 C12.6182732,3.15042301 12.7675038,3.26649123 12.784085,3.41572179 C12.8669908,3.94631935 12.2369062,4.01264405 12.2369062,4.01264405 M12.8006661,2.2716208 C12.784085,2.3379455 12.7675038,2.3379455 12.7343414,2.37110785 C12.6514356,2.43743254 12.5519485,2.52033841 12.4358803,2.61982545 C12.3695556,2.68615015 12.3032309,2.7193125 12.2534874,2.80221836 C12.2369062,2.81879954 12.2203251,2.86854306 12.2203251,2.86854306 C12.0379321,2.83538071 11.8555392,2.83538071 11.7228898,2.80221836 L11.7228898,2.6529878 C11.7228898,2.6529878 11.9052828,2.6529878 11.9218639,2.53691958 C11.9218639,2.53691958 11.9218639,2.50375724 11.9052828,2.48717606 C11.8887016,2.47059489 11.8223769,2.45401372 11.8223769,2.43743254 C11.9550263,2.45401372 12.0710945,2.50375724 12.2203251,2.57008193 C12.2369062,2.55350076 12.2037439,2.50375724 12.2037439,2.48717606 C12.1871627,2.47059489 12.1705815,2.45401372 12.120838,2.43743254 C12.0379321,2.42085137 11.8389581,2.38768902 11.8389581,2.38768902 C11.8389581,2.38768902 11.9052828,2.38768902 12.0047698,2.38768902 C12.0545133,2.38768902 12.0876757,2.37110785 12.1042568,2.35452667 C12.120838,2.3379455 12.1042568,2.30478315 12.0710945,2.2716208 C12.0545133,2.25503963 12.0379321,2.22187728 12.021351,2.20529611 C12.0047698,2.17213376 11.9716075,2.12239024 11.9384451,2.08922789 C11.8887016,2.03948437 11.7560522,1.98974085 11.7560522,1.98974085 C11.7560522,1.98974085 11.739471,1.90683498 11.7726334,1.85709146 C11.7892145,1.82392911 11.8555392,1.82392911 11.8887016,1.82392911 C11.9881886,1.87367263 12.1042568,1.93999733 12.2369062,1.97315968 C12.2700686,1.98974085 12.2700686,2.00632202 12.2700686,2.03948437 C12.2866498,2.12239024 12.2534874,2.2716208 12.2700686,2.32136433 C12.2866498,2.3379455 12.3032309,2.3379455 12.3198121,2.3379455 C12.4524615,2.2716208 12.5353674,2.15555259 12.6680167,2.08922789 C12.6680167,2.05606555 12.8338285,2.13897141 12.8006661,2.2716208"></path>
                  </g> </g> </g> </g>
  </svg>`;

  // Main function to initialize chat widget logic
  function initializeChatWidget($, currentWidgetCfg) {
    // Function to handle chat open request (for button onclick)
    window.requestChatOpen = function () {
      if (firstChatButtonClick) {
        webAlert.playMuteSoundOnce();
        firstChatButtonClick = false;
      }
      if (
        window._genesysCXBus &&
        typeof window._genesysCXBus.command === 'function'
      ) {
        if (
          window._genesys &&
          window._genesys.widgets &&
          window._genesys.widgets.webchat &&
          (window._genesys.widgets.webchat.state === 'opened' ||
            window._genesys.widgets.webchat.state === 'opening')
        ) {
          return; // Chat already open or opening
        }
        window._genesysCXBus.command('WebChat.open').fail((e) => {
          logger.error('[Genesys] WebChat.open command failed:', e);
        });
      } else {
        logger.error('[Genesys] CXBus not available to open chat.');
        alert(
          'Chat service is not available at the moment. Please try again later.',
        );
      }
    };

    // === Genesys Widget Configuration (onReady handler logic) ===
    // This function is assigned to window._genesys.widgets.onReady
    function initLocalWidgetConfiguration() {
      window._genesys = window._genesys || {};
      window._gt = window._gt || [];
      window._genesys.widgets = window._genesys.widgets || {};
      window._genesys.widgets.main = window._genesys.widgets.main || {};
      window._genesys.widgets.webchat = window._genesys.widgets.webchat || {};

      // Configure main widget settings
      Object.assign(window._genesys.widgets.main, {
        debug: currentWidgetCfg.debug || false, // Use currentWidgetCfg which is based on validated window.chatSettings
        theme: currentWidgetCfg.theme || 'light',
        lang: currentWidgetCfg.lang || 'en',
        mobileMode: 'auto',
        downloadGoogleFont:
          currentWidgetCfg.downloadGoogleFont === undefined
            ? false
            : currentWidgetCfg.downloadGoogleFont,
        preload: currentWidgetCfg.preloadWidgets || ['webchat'],
      });

      // Configure webchat widget settings
      Object.assign(window._genesys.widgets.webchat, {
        userData: mapChatSettingsToUserData(currentWidgetCfg), // Pass validated currentWidgetCfg
        autoInvite: {
          enabled: currentWidgetCfg.autoInviteEnabled || false,
          timeToInviteSeconds: currentWidgetCfg.timeToInviteSeconds || 20,
          inviteTimeoutSeconds: currentWidgetCfg.inviteTimeoutSeconds || 30,
        },
        chatButton: {
          enabled:
            currentWidgetCfg.chatButtonEnabled === undefined
              ? true
              : currentWidgetCfg.chatButtonEnabled,
          template:
            currentWidgetCfg.chatButtonTemplate ||
            '<div class="cx-widget cx-widget-chat cx-webchat-chat-button" id="cx_chat_form_button" role="button" tabindex="0" data-message="ChatButton" data-gcb-service-node="true" onclick="window.myCustomRequestPreChatOpen && window.myCustomRequestPreChatOpen(); return false;"><span class="cx-icon" data-icon="chat"></span><span class="cx-text">Chat With Us</span></div>',
          effectDuration: currentWidgetCfg.chatButtonEffectDuration || 300,
          openDelay: currentWidgetCfg.chatButtonOpenDelay || 1000,
          hideDuringInvite:
            currentWidgetCfg.chatButtonHideDuringInvite === undefined
              ? true
              : currentWidgetCfg.chatButtonHideDuringInvite,
        },
        transport:
          currentWidgetCfg.chatMode === 'cloud'
            ? {
                type: 'purecloud-v2-sockets',
                deploymentKey: currentWidgetCfg.deploymentId,
                orgGuid: currentWidgetCfg.orgId,
                environment: currentWidgetCfg.environment,
              }
            : {
                type: 'rest',
                dataURL: gmsServicesConfig.GMSChatURL(), // Uses cfg properties via gmsServicesConfig
                asyncConfiguration: true,
                reconnectOnError: true,
                timeout: 60000,
              },
        form: {
          wrapper: '<table></table>',
          inputs: currentWidgetCfg.chatFormInputs || [
            // Allow full override from chatSettings (via currentWidgetCfg)
            {
              name: 'nickname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderNickname',
              label: '@i18n:webchat.ChatFormNickname',
              value: currentWidgetCfg.formattedFirstName || '',
            },
            {
              name: 'firstname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderFirstName',
              label: '@i18n:webchat.ChatFormFirstName',
              value: currentWidgetCfg.firstname || '',
              isHidden: true,
            },
            {
              name: 'lastname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderLastName',
              label: '@i18n:webchat.ChatFormLastName',
              value: currentWidgetCfg.lastname || '',
              isHidden: true,
            },
            {
              name: 'subject',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderSubject',
              label: '@i18n:webchat.ChatFormSubject',
              value: 'Member Inquiry',
              isHidden: true,
            },
          ],
        },
        ...(currentWidgetCfg.webchatExtensions || {}),
      });

      // The variable formInputsFromBuildActive is created and logged as in the original script.
      // It is not assigned to window._genesys.widgets.webchat.form.inputs to preserve original behavior.
      const formInputsFromBuildActive = buildActiveChatInputs(currentWidgetCfg); // Pass currentWidgetCfg
      // Original log for this variable has been removed as per logging cleanup rules.
      // A comment is kept here to note its existence and non-assignment.

      // Store CXBus globally
      const LocalCXBus = window.CXBus || window._genesysCXBus;
      if (LocalCXBus && typeof LocalCXBus.command === 'function') {
        window._genesysCXBus = LocalCXBus;
        logger.warn(
          '[Genesys] CXBus object successfully stored and available.',
        );
      } else {
        logger.error(
          '[Genesys] Invalid or missing CXBus object. Chat might not function.',
        );
        return;
      }

      if (!window._genesys || !window._genesys.widgets) {
        logger.error(
          '[Genesys] Critical: _genesys.widgets not available. Aborting further initialization.',
        );
        return;
      }

      // Register Plugins and Event Handlers
      const plugin = LocalCXBus.registerPlugin('LocalCustomization');
      const calculatedCiciId = getCalculatedCiciId(currentWidgetCfg); // Pass current config

      plugin.subscribe('WebChat.opened', function () {
        handleWebChatOpened(
          currentWidgetCfg,
          $,
          calculatedCiciId,
          addAfterHoursLinks,
        ); // Pass dependencies
        customizeAmplify(currentWidgetCfg, $); // Pass dependencies
      });

      plugin.subscribe('WebChat.messageAdded', function (e) {
        if (
          e.data.message.type === 'Agent' &&
          e.data.message.text &&
          webAlert.muted
        ) {
          webAlert.muted = false;
          const playPromise = webAlert.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              logger.warn(
                '[Genesys] Error playing audio alert for agent message:',
                error,
              );
            });
          }
        }
      });

      plugin.subscribe('WebChat.submitted', function () {
        applyMessageScaler(currentWidgetCfg, $); // Pass dependencies
        customizeAmplify(currentWidgetCfg, $); // Pass dependencies
      });

      plugin.subscribe('WebChat.errors', function (e) {
        logger.error('[Genesys] WebChat.errors event received:', e);
        // Consider calling OpenChatConnectionErrorOverlay($) if appropriate for the error type
      });

      LocalCXBus.command('App.ready');
      LocalCXBus.command('App.main')
        .done(function () {
          logger.warn(
            '[Genesys] Chat initialization successful: App.main completed.',
          );
          window.genesysLegacyChatIsReady = true;
          LocalCXBus.command('WebChat.showChatButton');
          var event = new CustomEvent('genesys:ready', {
            detail: { CXBus: LocalCXBus },
          });
          window.dispatchEvent(event);
        })
        .fail(function (err) {
          logger.error(
            '[Genesys] Chat initialization failed: App.main failed:',
            err,
          );
          LocalCXBus.command('WebChat.showChatButton'); // Attempt to show button even on fail
          logger.warn(
            '[Genesys] Attempted WebChat.showChatButton after App.main failure.',
          );
          var errorEvent = new CustomEvent('genesys:error', {
            detail: { error: 'App.main failed', originalError: err },
          });
          window.dispatchEvent(errorEvent);
        });

      customizeAmplify(currentWidgetCfg, $); // Final call after App.main logic
    } // End of initLocalWidgetConfiguration

    // Handler for WebChat.opened event
    function handleWebChatOpened(
      currentCfg,
      jQueryRef,
      calculatedCiciIdVal,
      addAfterHoursLinksFn,
    ) {
      // Real-time chat availability check
      if (
        currentCfg.rawChatHrs &&
        typeof currentCfg.isChatAvailable !== 'undefined' &&
        currentCfg.workingHrs
      ) {
        let dt = new Date();
        let dtTimeStr = dt.toLocaleTimeString('en-US', { hour12: false });
        dtTimeStr = dtTimeStr.split(':')[0] + '.' + dtTimeStr.split(':')[1];
        let currentHrMin = parseFloat(dtTimeStr);
        let endChatHrMin = null;

        if (currentCfg.rawChatHrs && currentCfg.rawChatHrs.includes('_')) {
          const parts = currentCfg.rawChatHrs.split('_');
          const endChatHoursStr = parts[parts.length - 1];
          endChatHrMin = parseFloat(endChatHoursStr);
        } else if (typeof currentCfg.todayEndChatHour === 'number') {
          endChatHrMin = currentCfg.todayEndChatHour;
        }

        if (
          currentCfg.isChatAvailable &&
          endChatHrMin !== null &&
          currentHrMin > endChatHrMin
        ) {
          let tempUnavailableChatForm = {
            inputs: [
              {
                custom:
                  "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.</td></tr>",
              },
              {
                custom: `<tr><td id='reachUs' colspan='2' class='i18n' style='font-family: universStd;'>Reach us ${currentCfg.workingHrs || 'during business hours'}</td></tr>`,
              },
            ],
          };
          if (
            currentCfg.selfServiceLinks &&
            currentCfg.selfServiceLinks.length > 0
          ) {
            addAfterHoursLinksFn(tempUnavailableChatForm, currentCfg);
          }
          jQueryRef('.activeChat').hide();
          if (tempUnavailableChatForm.inputs) {
            tempUnavailableChatForm.inputs.forEach(function (element) {
              if (element.custom) {
                if (jQueryRef('.cx-form > .cx-form-inputs > table').length) {
                  jQueryRef('.cx-form > .cx-form-inputs > table').append(
                    element.custom,
                  );
                } else {
                  logger.warn(
                    '[Genesys] Chat form table not found for appending after hours links.',
                  );
                }
              }
            });
          }
          jQueryRef(
            '.cx-button-group.cx-buttons-binary > button[data-message="ChatFormSubmit"]',
          ).hide();
        }
      } else {
        logger.warn(
          '[Genesys] Not performing real-time chat availability check due to missing cfg: rawChatHrs, isChatAvailable, or workingHrs.',
        );
      }

      if (currentCfg.isChatAvailable === false) {
        jQueryRef('.cx-button-group.cx-buttons-binary').hide();
      }

      jQueryRef("button[data-message='ChatFormCancel']").hide();
      const submitButtonAttrs = {
        id: 'startChat',
        class: 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide',
      };
      if (!currentCfg.routingchatbotEligible) {
        submitButtonAttrs.disabled = 'disabled';
        submitButtonAttrs.class += ' cx-disabled';
        jQueryRef('#question_field').attr(
          'class',
          'cx-input cx-form-control dropdownInput i18n',
        );
      }
      jQueryRef("button[data-message='ChatFormSubmit']").attr(
        submitButtonAttrs,
      );
      jQueryRef("button[data-message='ConfirmCloseCancel']").attr(
        'class',
        'cx-close-cancel cx-btn cx-btn-default i18n btn-secondary',
      );
      jQueryRef("button[data-message='ChatEndCancel']").attr(
        'class',
        'cx-end-cancel cx-btn cx-btn-default i18n btn-secondary',
      );
      jQueryRef("textarea[data-message='ChatInputPlaceholder']").css(
        'background',
        'none',
      );

      if (calculatedCiciIdVal === clientIdConst.SeniorCare) {
        jQueryRef('#question_field').hide();
        jQueryRef('button[data-message="ChatFormSubmit"]')
          .removeAttr('disabled')
          .attr({
            id: 'startChat',
            class: 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide',
          });
      }
    }

    // Assign the onReady handler
    window._genesys = window._genesys || {};
    window._genesys.widgets = window._genesys.widgets || {};
    window._genesys.widgets.onReady = initLocalWidgetConfiguration;

    // Load widgets.min.js for legacy mode
    if (currentWidgetCfg.chatMode === 'legacy') {
      if (currentWidgetCfg.widgetUrl) {
        loadResource
          .script(currentWidgetCfg.widgetUrl, {
            id: 'genesys-widgets-min-script-dynamic', // Consistent ID for potential cleanup/reference
          })
          .then(() => {
            logger.info(`Successfully loaded widgets.min.js from ${currentWidgetCfg.widgetUrl}`);
            // The widgets.min.js script, upon loading, is expected to call window._genesys.widgets.onReady(),
            // which we've set to initLocalWidgetConfiguration. This will then configure the widget.
          })
          .catch((err) => {
            logger.error(`Failed to load widgets.min.js from ${currentWidgetCfg.widgetUrl}:`, err);
            // Dispatch a custom event for other parts of the application to potentially listen to
            document.dispatchEvent(new CustomEvent('genesys:error', { detail: { message: 'Failed to load Genesys widgets script.', error: err } }));
          });
      } else {
        logger.error('Legacy mode configured, but widgetUrl is missing in chatSettings. Cannot load Genesys widgets.');
        document.dispatchEvent(new CustomEvent('genesys:error', { detail: { message: 'Legacy mode configured, but widgetUrl is missing.' } }));
      }
    }
    // Note: Cloud mode typically uses a different Genesys snippet or loading mechanism,
    // so no explicit script loading for cloud mode is added here.
  } // End of initializeChatWidget

  // Load jQuery and then initialize chat
  loadJQuery()
    .then(($) => initializeChatWidget($, cfg)) // Pass original cfg here
    .catch((err) =>
      logger.error(
        '[Genesys] Failed to initialize chat widget due to jQuery load error:',
        err,
      ),
    );

  // === CHAT SETTINGS UPDATE HANDLER ===
  function performChatCleanup(currentCXBus, currentGenesysWidgets) {
    if (currentCXBus && typeof currentCXBus.command === 'function') {
      try {
        currentCXBus.command('WebChat.close');
        currentCXBus.command('WebChat.hideChatButton');
        // currentCXBus.command('WebChat.destroy'); // If more thorough destruction is needed
      } catch (e) {
        logger.warn(
          '[Genesys] Error during CXBus cleanup in handleChatSettingsUpdate:',
          e,
        );
      }
    }

    if (
      currentGenesysWidgets &&
      currentGenesysWidgets.main &&
      typeof currentGenesysWidgets.main.shutdown === 'function'
    ) {
      try {
        currentGenesysWidgets.main.shutdown();
        window._genesysCXBus = undefined; // Clear CXBus
        // window._genesysCXBusReady = false; // If this flag is used
        if (currentGenesysWidgets) {
          currentGenesysWidgets.onReady = undefined; // Allow redefinition
        }
      } catch (e) {
        logger.warn(
          '[Genesys] Error during _genesys.widgets.main.shutdown():',
          e,
        );
      }
    }
  }

  function reinitializeChatSystem(newValidatedCfg, $, initializeChatWidgetFn) {
    const oldWidgetsScript = document.getElementById(
      'genesys-widgets-min-script-dynamic',
    );
    if (oldWidgetsScript) {
      oldWidgetsScript.remove();
    }

    // Reset flags that widgets.min.js might use
    if (window._genesys && window._genesys.widgets) {
      window._genesys.widgets.loaded = false; // Example flag
      window._genesys.widgets.initialized = false; // Example
    }

    // Ensure _genesys.widgets.onReady can be reassigned correctly before calling initializeChatWidgetFn
    // initializeChatWidgetFn itself will assign window._genesys.widgets.onReady to its internal initLocalWidgetConfiguration.
    // No explicit assignment of onReady is needed here if initializeChatWidgetFn handles it.
    initializeChatWidgetFn($, newValidatedCfg);
  }

  window.handleChatSettingsUpdate = function (newSettings) {
    window.chatSettings = JSON.parse(JSON.stringify(newSettings || {})); // Update global raw settings

    performChatCleanup(
      window._genesysCXBus,
      window._genesys ? window._genesys.widgets : undefined,
    );

    const newValidatedCfg = validateConfig(window.chatSettings); // Use updated window.chatSettings

    if (window.jQuery) {
      reinitializeChatSystem(
        newValidatedCfg,
        window.jQuery,
        initializeChatWidget,
      );
    } else {
      logger.error(
        '[Genesys] jQuery not found for re-initialization. Attempting to load jQuery first.',
      );
      loadJQuery()
        .then(($) => {
          reinitializeChatSystem(newValidatedCfg, $, initializeChatWidget);
        })
        .catch((err) =>
          logger.error(
            '[Genesys] Failed to re-initialize after jQuery load attempt:',
            err,
          ),
        );
    }
  };

  // Final diagnostic check (timeout)
  setTimeout(function () {
    const widgetsOnReadyExists =
      window._genesys &&
      window._genesys.widgets &&
      typeof window._genesys.widgets.onReady === 'function';
    if (!widgetsOnReadyExists) {
      logger.error(
        '[Genesys] FINAL DIAGNOSTIC CHECK FAILED: window._genesys.widgets.onReady is NOT a function or widgets object is missing. Chat initialization may have failed.',
        'Current window._genesys state:',
        // Safe stringify for complex objects
        JSON.parse(
          JSON.stringify(
            window._genesys,
            (key, value) => {
              if (typeof value === 'function') return 'ƒ';
              if (value instanceof Element) return `Element<${value.tagName}>`;
              return value;
            },
            2,
          ) || '{}',
        ),
      );
    }
  }, 10000);
})(window, document);
