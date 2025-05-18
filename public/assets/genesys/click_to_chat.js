(function (window, document) {
  'use strict';

  // === CONFIG SECTION ===
  // Validate and set configuration with defaults
  const validateConfig = (cfg) => {
    const required = {
      legacy: ['clickToChatToken', 'clickToChatEndpoint'],
      cloud: ['deploymentId', 'orgId'],
    };

    // Determine mode and check required fields
    const mode = cfg.chatMode || 'legacy';
    const missingFields = required[mode]?.filter((field) => !cfg[field]) || [];

    if (missingFields.length > 0) {
      console.error(
        `[Genesys] Missing required fields for ${mode} mode:`,
        missingFields,
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
    };
  };

  // Load and validate config
  const cfg = validateConfig(window.chatSettings || {});

  // Backwards compatibility: mirror all JSP-injected values directly on window
  const clickToChatToken = cfg.clickToChatToken;
  const clickToChatEndpoint = cfg.clickToChatEndpoint;
  const clickToChatDemoEndPoint = cfg.clickToChatDemoEndPoint;
  const coBrowseLicence = cfg.coBrowseLicence;
  const cobrowseSource = cfg.cobrowseSource;
  const cobrowseURL = cfg.cobrowseURL;
  const opsPhone = cfg.opsPhone;
  const opsPhoneHours = cfg.opsPhoneHours;
  const routingchatbotEligible = cfg.routingchatbotEligible;
  const isChatEligibleMember = cfg.isChatEligibleMember;
  const isDemoMember = cfg.isDemoMember;
  const isAmplifyMem = cfg.isAmplifyMem;
  const isCobrowseActive = cfg.isCobrowseActive;
  const isMagellanVAMember = cfg.isMagellanVAMember;
  const isMedicalAdvantageGroup = cfg.isMedicalAdvantageGroup;
  const selfServiceLinks = cfg.selfServiceLinks || [];
  const rawChatHrs = cfg.rawChatHrs;

  // Restore gmsServicesConfig exactly as in JSPF
  const gmsServicesConfig = {
    GMSChatURL: () =>
      isDemoMember ? clickToChatDemoEndPoint : clickToChatEndpoint,
  };

  // Enhanced logging with more detail
  console.log('[Genesys] Initializing chat widget', {
    chatMode: cfg.chatMode,
    userInfo: {
      firstname: cfg.firstname || cfg.formattedFirstName || '',
      lastname: cfg.lastname || cfg.memberLastName || '',
    },
    chatAvailable: cfg.isChatAvailable,
    targetContainer: cfg.targetContainer,
    timestamp: new Date().toISOString(),
  });

  // Validate critical settings
  if (cfg.chatMode === 'cloud' && (!cfg.deploymentId || !cfg.orgId)) {
    console.error('[Genesys] Cloud chat mode requires deploymentId and orgId', {
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
          reject(new Error('No source provided for script'));
          return;
        }

        // Add cache-busting if needed
        const finalSrc = src.includes('?') ? src : `${src}?_t=${Date.now()}`;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = finalSrc;

        // Add any custom attributes
        Object.entries(attributes).forEach(([key, value]) => {
          script.setAttribute(key, value);
        });

        script.onload = () => resolve(script);
        script.onerror = (e) =>
          reject(new Error(`Failed to load script: ${finalSrc}`));

        document.head.appendChild(script);
      });
    },

    style: (cssText, id) => {
      return new Promise((resolve) => {
        const styleEl = document.createElement('style');
        if (id) styleEl.id = id;
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
      console.warn(
        `[Genesys] Target container #${cfg.targetContainer} not found, using document.body`,
      );
      return document.body;
    }
    return container;
  };

  // === CSS INJECTION ===
  // Critical styles for chat button and window
  const css = `
  /* Critical styles for chat button and window */
  .cx-widget.cx-webchat-chat-button {
    display: flex !important;
    position: fixed !important;
    right: 20px !important;
    bottom: 20px !important;
    z-index: 999 !important;
    cursor: pointer !important;
  }
  .fallback-chat-button {
    background-color: #0056b3 !important;
    color: white !important;
    padding: 10px 20px !important;
    border-radius: 5px !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
    font-family: sans-serif !important;
    font-size: 16px !important;
    align-items: center !important;
    justify-content: center !important;
  }
  /* Modal styles */
  .cobrowse-card {
    color: #333;
    font-family: sans-serif;
    line-height: 230%;
    position: fixed;
    padding: 25px;
    background: white;
    border-radius: 15px;
    top: 50px;
    left: 50%;
    width: 75%;
    max-width: 700px;
    transform: translateX(-50%);
  }
  /* Additional helpers */
  .cobrowse-btn {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
    background: #0078d4;
    color: white;
    cursor: pointer;
    border: none;
  }
  .cobrowse-btn-secondary {
    background: #f0f0f0;
    color: #333;
    border: 1px solid #ccc;
  }
  .cobrowse-phoneicon:after {
    content: '📞';
    margin-left: 5px;
  }
  .cobrowse-chaticon:after {
    content: '💬';
    margin-left: 5px;
  }
  .cobrowse-chatClose {
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 24px;
    cursor: pointer;
  }
  `;

  // Inject styles
  loadResource
    .style(css, 'genesys-chat-styles')
    .then(() => console.log('[Genesys] Chat styles loaded'))
    .catch((err) =>
      console.error('[Genesys] Failed to load chat styles:', err),
    );

  // === MODAL INJECTION ===
  // Inject modals to target container or body
  function injectModals() {
    const targetContainer = getTargetContainer();
    const wrapper = document.createElement('div');
    wrapper.id = 'genesys-chat-modals';
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
    ${isChatEligibleMember || isDemoMember ? `<button id="openChat_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="openWebChatWidget()">CHAT <span class="chatIcon cobrowse-chaticon"></span></button>` : ''}
  </div>
</div>

<div class="modal" id="cobrowse-contactUsScreen2" tabindex="-1" role="dialog" style="display: none; z-index: 9999;">
  <div style="background: rgba(50, 50, 50, 0); position: fixed; bottom: 0; top: 0; left: 0; right: 0">
    <div style="color: #333; font-family:sans-serif; line-height:230%; position:fixed; padding:25px; background:white; border-radius:15px; top:50px; left:50%; width:75%; max-width:700px; transform:translateX(-50%);">
      <a class="cobrowse-chatClose" onclick="cobrowseClosePopup()">&times;</a>
      <div class="cobrowse-main-phone">
        <div class="cobrowse-phone-title"><span>Call us at</span></div>
        <div class="cobrowse-phone-number"><span class="href-col">${opsPhone || 'Contact support'}</span></div>
        <div class="cobrowse-phone-subtitle"><span>Once you're on the line with us, say "share your screen."</span></div>
      </div>
      <div class="cobrowse-availability">
        <div class="cobrowse-hours"><b>Hours of operation</b></div>
        <div class="hrs-opt">${opsPhoneHours || 'Please call for current hours'}</div>
      </div>
      <div class="cobrowse-shareScreen-link"><span class="cobrowse-cobrowse-offer">Already on a call? <a class="cobrowse-cobrowse-link" onclick="cobrowseSessionModal()">Share your screen</a></span></div>
    </div>
  </div>
</div>
    `;
    targetContainer.appendChild(wrapper);
    console.log(
      '[Genesys] Chat modals injected into',
      targetContainer.id || 'body',
    );
  }

  // Safely inject modals
  try {
    injectModals();
  } catch (error) {
    console.error('[Genesys] Failed to inject modals:', error);
  }

  // === AUDIO NOTIFICATION ===
  // Create and configure audio alert with better error handling
  const initAudioAlert = () => {
    const webAlert = new Audio();
    try {
      const audioPath = '/assets/genesys/sounds/bell.mp3';
      webAlert.src = audioPath;
      webAlert.muted = true;

      // Preload the audio
      webAlert.load();

      webAlert.addEventListener('canplaythrough', () => {
        console.log('[Genesys] Audio loaded and ready');
      });

      webAlert.addEventListener('error', (e) => {
        console.error('[Genesys] Audio error', e);
        // Create a fallback play method
        webAlert.play = () =>
          console.log('[Genesys] Audio unavailable, using silent fallback');
      });

      return webAlert;
    } catch (err) {
      console.error('[Genesys] Audio initialization failed:', err);
      // Return an object with a no-op play method
      return { play: () => console.log('[Genesys] Audio unavailable') };
    }
  };

  const webAlert = initAudioAlert();

  // === COBROWSE INTEGRATION ===
  // Improved CoBrowse consent handling
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
        // Update session controls text after short delay
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

  // Initialize CoBrowse if enabled
  if (isCobrowseActive) {
    window.CobrowseIO = window.CobrowseIO || {};

    // Set up custom consent prompts
    CobrowseIO.confirmSession = () =>
      buildConsent(
        "We'd like to share your screen",
        'Sharing only your BCBST.com tab. OK?',
      );

    CobrowseIO.confirmRemoteControl = () =>
      buildConsent("We'd like control", 'We can click to help. OK?');

    // Initialize CoBrowse client conditionally
    (function (w, t, c) {
      // Create a promise that resolves when the client is loaded
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
  // Improved jQuery loader with Promise support
  const loadJQuery = () => {
    // Skip loading if jQuery already available
    if (window.jQuery) {
      console.log('[Genesys] jQuery already loaded');
      return Promise.resolve(window.jQuery);
    }

    console.log('[Genesys] Loading jQuery');
    return loadResource
      .script('https://code.jquery.com/jquery-3.6.0.min.js')
      .then(() => {
        console.log('[Genesys] jQuery loaded successfully');
        return window.jQuery;
      })
      .catch((err) => {
        console.error('[Genesys] jQuery loading failed:', err);
        throw err;
      });
  };

  // Load jQuery and initialize chat widget
  loadJQuery()
    .then(($) => initializeChatWidget($, cfg))
    .catch((err) =>
      console.error('[Genesys] Failed to initialize chat widget:', err),
    );

  // === CHAT WIDGET INITIALIZATION ===
  function initializeChatWidget($, cfg) {
    console.log('[Genesys] Beginning chat widget initialization');

    // === Constants & Utilities ===
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

    // Utility functions
    const defaultedClientID = (id) => {
      const validIds = ['INDVMX', 'BA', 'INDV', 'CK', 'BC', 'DS', 'CT'];
      return id && validIds.includes(id.trim()) ? id.trim() : 'Default';
    };

    const isDentalOnly = () =>
      !(
        cfg.isMedical === 'true' ||
        cfg.isVision === 'true' ||
        cfg.isWellnessOnly === 'true'
      ) && cfg.isDental === 'true';

    const getChatType = (cid) => {
      switch (cid) {
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

    // === Chat Form Builder ===
    function buildActiveChatInputs() {
      const inputs = [];

      // Title section
      inputs.push({
        custom: isAmplifyMem
          ? "<tr class='activeChat'><td colspan='2' data-message='Questions or need advice? Let\'s talk.' style='font-size:30px'></td></tr>"
          : "<tr class='activeChat'><td colspan='2' data-message='We\'re right here <br>for you. Let\'s chat.' style='font-size:30px'></td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      // NEW: If user has multiple plans, add plan information row
      if (cfg.numberOfPlans > 1 && cfg.currentPlanName) {
        inputs.push({
          custom: `<tr class='activeChat'><td colspan='2'><div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#f8f9fa;border-radius:4px;margin-bottom:10px;">
            <div><strong>Chatting about:</strong> ${cfg.currentPlanName}</div>
            <button onclick="window.openPlanSwitcher();return false;" style="background:#007bff;color:white;border:none;border-radius:4px;padding:5px 10px;cursor:pointer;">Switch Plan</button>
          </div></td></tr>`,
        });
        inputs.push({
          custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
        });
      }

      // Service type selector or chatbot routing
      if (!routingchatbotEligible) {
        inputs.push({
          custom:
            calculatedCiciId === clientIdConst.SeniorCare
              ? "<tr class='activeChat'><td colspan='2'><br></td></tr>"
              : "<tr class='activeChat'><td colspan='2' class='cx-control-label i18n' data-message='What can we help you with today?'></td></tr>",
        });
        inputs.push({
          id: 'question_field',
          name: 'SERV_TYPE',
          type: 'select',
          options: setOptions(isDentalOnly() ? 'dentalOnly' : calculatedCiciId),
          validateWhileTyping: true,
          validate: function (event, form, input) {
            if (input && input.val()) {
              $('button[data-message="ChatFormSubmit"]')
                .removeAttr('disabled')
                .attr({
                  id: 'startChat',
                  class: 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide',
                });
              return true;
            }
            return calculatedCiciId === clientIdConst.SeniorCare;
          },
        });
      } else {
        inputs.push({ name: 'SERV_TYPE', value: null, type: 'hidden' });
        inputs.push({
          name: 'ChatBotID',
          value: 'RoutingChatbot',
          type: 'hidden',
        });
      }

      // Hidden fields for various settings
      const hiddenFields = [
        {
          id: 'LOB',
          name: 'LOB',
          value: defaultedClientID(calculatedCiciId),
          type: 'hidden',
        },
        {
          id: 'IsMedicalEligible',
          name: 'IsMedicalEligible',
          value: cfg.isMedical,
          type: 'hidden',
        },
        {
          id: 'IsDentalEligible',
          name: 'IsDentalEligible',
          value: cfg.isDental,
          type: 'hidden',
        },
        {
          id: 'IsVisionEligible',
          name: 'IsVisionEligible',
          value: cfg.isVision,
          type: 'hidden',
        },
        {
          id: 'IDCardBotName',
          name: 'IDCardBotName',
          value: routingchatbotEligible ? cfg.idCardChatBotName : '',
          type: 'hidden',
        },
      ];

      hiddenFields.forEach((field) => inputs.push(field));

      // Terms and conditions
      inputs.push({
        custom:
          "<tr class='activeChat'><td>By clicking on the button, you agree with our <a href='#' onclick='OpenChatDisclaimer();return false;'>Terms and Conditions</a> for chat.</td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      // User demographics fields
      const demographicFields = [
        {
          id: 'firstName_field',
          name: 'firstname',
          value: cfg.formattedFirstName || cfg.firstname || '',
        },
        {
          id: 'lastname_field',
          name: 'lastname',
          value: cfg.memberLastName || cfg.lastname || '',
        },
        {
          id: 'memberId_field',
          name: 'MEMBER_ID',
          value: `${cfg.subscriberID || ''}-${cfg.sfx || ''}`,
        },
        {
          id: 'groupId_field',
          name: 'GROUP_ID',
          value: cfg.groupId,
        },
        {
          id: 'planId_field',
          name: 'PLAN_ID',
          value: cfg.memberMedicalPlanID,
        },
        {
          id: 'dob_field',
          name: 'MEMBER_DOB',
          value: cfg.memberDOB,
        },
        {
          id: 'inquiryType_field',
          name: 'INQ_TYPE',
          value: getChatType(calculatedCiciId),
        },
      ];

      demographicFields.forEach((field) => inputs.push(field));

      return inputs;
    }

    // === Genesys Widget Configuration ===
    function initLocalWidgetConfiguration() {
      // Initialize namespace objects
      window._genesys = window._genesys || {};
      window._gt = window._gt || [];
      window._genesys.widgets = window._genesys.widgets || {};

      // Main configuration
      window._genesys.widgets.main = {
        debug: false,
        theme: 'light',
        lang: 'en',
        mobileMode: 'auto',
        downloadGoogleFont: false,
        plugins: [],
        i18n: { en: {} },
        header: { Authorization: `Bearer ${clickToChatToken}` },
        size: {
          width: 400,
          height: 600,
          minWidth: 400,
          minHeight: 600,
          windowWidth: '400px',
          windowHeight: '600px',
        },
        showPoweredBy: false,
        customStylesheetID: 'genesys-widgets-custom',
        preload: ['webchat'],
        actionsBar: { showPoweredBy: false },
      };

      // CallUs configuration
      window._genesys.widgets.main.i18n.en.callus = {
        CallUsTitle: 'Call Us',
        SubTitle: '',
        CancelButtonText: '',
        CoBrowseText:
          "<span class='cx-cobrowse-offer'>Already on a call? <a role='link' class='cx-cobrowse-link'>Share your screen</a></span>",
        CoBrowse: 'Start screen sharing',
        CoBrowseWarning:
          'Co-browse allows your agent to see and control your desktop…',
        AriaWindowLabel: 'Call Us Window',
        AriaCallUsClose: 'Call Us Close',
        AriaBusinessHours: 'Business Hours',
        AriaCallUsPhoneApp: 'Opens the phone application',
        AriaCobrowseLink: 'Opens the Co-browse Session',
        AriaCancelButtonText: 'Call Us Cancel',
      };

      window._genesys.widgets.callus = {
        contacts: [
          {
            displayName: 'Call us at',
            i18n: 'opsPhoneNumber',
            number: opsPhone,
          },
        ],
        hours: [opsPhoneHours],
      };

      // Add chat plugins if eligible
      if (isChatEligibleMember || isDemoMember) {
        window._genesys.widgets.main.plugins.push(
          'cx-webchat-service',
          'cx-webchat',
        );

        // Common text strings
        const commonText = {
          ChatButton: 'Chat with us',
          ChatTitle: 'Chat with us',
          BotConnected: '',
          BotDisconnected: '',
          ChatFormSubmit: 'START CHAT',
          ConfirmCloseWindow:
            "<div class='modalTitle'>We'll be right here if we can</br>help with anything else.</div>",
          ChatEndCancel: 'STAY',
          ChatEndConfirm: 'CLOSE CHAT',
          ConfirmCloseCancel: 'STAY',
          ActionsCobrowseStart: 'Share Screen',
          ConfirmCloseConfirm: 'CLOSE CHAT',
          ChatEndQuestion:
            "<div class='modalTitle'>We'll be right here if we can</br>help with anything else.</div>",
        };

        // Set i18n text based on demo status
        window._genesys.widgets.main.i18n.en.webchat = isDemoMember
          ? {
              ...commonText,
              Errors: {
                StartFailed:
                  "<div class='modalTitle'>This is a Demo only chat.</div>",
              },
            }
          : commonText;

        // Customize for Amplify members
        if (isAmplifyMem) {
          const w = window._genesys.widgets.main.i18n.en.webchat;
          w.ChatButton = 'Chat with an advisor';
          w.ChatTitle = 'Chat with an advisor';
        }

        // Base webchat configuration
        const base = {
          dataURL: gmsServicesConfig.GMSChatURL(),
          enableCustomHeader: true,
          emojis: false,
          uploadsEnabled: false,
          maxMessageLength: 10000,
          autoInvite: {
            enabled: false,
            timeToInviteSeconds: 5,
            inviteTimeoutSeconds: 30,
          },
          chatButton: {
            enabled: true,
            openDelay: 100,
            effectDuration: 100,
            hideDuringInvite: true,
          },
          composerFooter: { showPoweredBy: false },
        };

        // Configure for chat availability
        if (cfg.isChatAvailable === 'false') {
          window._genesys.widgets.webchat = {
            ...base,
            form: {
              inputs: [
                {
                  custom:
                    "<tr><td colspan='2' class='i18n' data-message='You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.'></td></tr>",
                },
                {
                  custom: `<tr><td id='reachUs' colspan='2' class='i18n'>Reach us ${cfg.chatHours}</td></tr>`,
                },
              ],
            },
          };
        } else {
          window._genesys.widgets.webchat = {
            ...base,
            userData: {
              firstname: cfg.formattedFirstName,
              lastname: cfg.memberLastName,
            },
            form: { inputs: buildActiveChatInputs() },
          };
        }
      }
    }

    // Initialize widget configuration
    initLocalWidgetConfiguration();

    // === 7) CXBus subscriptions & after-hours ===
    window._genesys.widgets.onReady = (CXBus) => {
      console.log('[Genesys] CXBus ready, registering plugins and handlers');

      // Create local plugin for customizations
      const plugin = CXBus.registerPlugin('LocalCustomization');

      // WebChat.opened handler
      plugin.subscribe('WebChat.opened', () => {
        console.log('[Genesys] WebChat opened');

        // Add current plan name to titlebar if user has multiple plans
        try {
          if (cfg.numberOfPlans > 1 && cfg.currentPlanName) {
            const titlebar = $('.cx-widget.cx-webchat .cx-titlebar');
            if (titlebar.length && !titlebar.data('plan-info-added')) {
              const originalTitle = titlebar.text().trim();
              titlebar.html(
                `<span>${cfg.currentPlanName}</span> - <span>${originalTitle}</span>`,
              );
              titlebar.data('plan-info-added', true);
            }
          }
        } catch (error) {
          console.error(
            '[Genesys] Error updating titlebar with plan info:',
            error,
          );
        }

        // Check for after-hours and handle UI
        try {
          const now = parseFloat(
            new Date()
              .toLocaleTimeString('en-US', {
                hour12: false,
                timeZone: 'America/New_York',
              })
              .replace(':', '.')
              .slice(0, 4),
          );

          let end = parseFloat(rawChatHrs?.split('_')?.pop() || '0');
          if (end < 12) end += 12;

          if (cfg.isChatAvailable === 'true' && now > end) {
            console.log(
              '[Genesys] After hours detected, showing self-service options',
            );

            // Add self-service links
            const links = selfServiceLinks || [];
            links.forEach((e) => {
              if (e.value && e.value.startsWith('http')) {
                $('.cx-form table').append(
                  `<tr><td colspan='2'><a class='btn btn-secondary' href='${e.value}' target='_blank'>${e.key}</a></td></tr>`,
                );
              }
            });

            // Hide active chat elements
            $('.activeChat').hide();
            $('button[data-message="ChatFormSubmit"]').hide();
          }
        } catch (error) {
          console.error('[Genesys] Error handling after-hours logic:', error);
        }

        // Trigger custom event for external listeners
        try {
          document.dispatchEvent(new CustomEvent('genesys:webchat:opened'));
        } catch (e) {
          console.error('[Genesys] Error dispatching webchat:opened event:', e);
        }
      });

      // Message added handler with audio notification
      plugin.subscribe('WebChat.messageAdded', (data) => {
        try {
          if (data && data.response && data.response.message) {
            console.log('[Genesys] New message received');

            // Unmute and play alert
            webAlert.muted = false;
            webAlert
              .play()
              .catch((e) => console.log('[Genesys] Audio play error:', e));

            // Handle notifications when document not visible
            if (document.visibilityState !== 'visible') {
              console.log('[Genesys] Document not visible, notifying user');

              // Trigger custom event for external notification handling
              try {
                document.dispatchEvent(
                  new CustomEvent('genesys:message:received', {
                    detail: { message: data.response.message },
                  }),
                );
              } catch (e) {
                console.error('[Genesys] Error dispatching message event:', e);
              }
            }
          }
        } catch (err) {
          console.error('[Genesys] Error in messageAdded handler:', err);
        }
      });

      // Enhanced error handling with better user feedback
      plugin.subscribe('WebChat.error', (error) => {
        console.error('[Genesys] WebChat error:', error);

        // Create a standard error message for user display
        const errorMessage =
          'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.';

        // Try to display error in widget if possible
        try {
          if ($('.cx-widget.cx-webchat').length) {
            $('.cx-widget.cx-webchat').append(`
              <div class="chat-error-message" style="padding:15px;background:#f8d7da;color:#721c24;margin:10px;border-radius:4px;">
                <p>${errorMessage}</p>
                <button id="chat-error-ok" style="background:#dc3545;color:white;border:none;padding:5px 15px;border-radius:4px;cursor:pointer;">OK</button>
              </div>
            `);

            $('#chat-error-ok').on('click', function () {
              $('.chat-error-message').remove();
              // Re-open chat form
              if (window._genesysCXBus) {
                window._genesysCXBus.command('WebChat.open');
              }
            });
          }
        } catch (err) {
          console.error('[Genesys] Error displaying chat error message:', err);
        }

        // Also dispatch event for external handlers
        try {
          document.dispatchEvent(
            new CustomEvent('genesys:webchat:error', {
              detail: {
                error,
                message: errorMessage,
              },
            }),
          );
        } catch (e) {
          console.error('[Genesys] Error dispatching error event:', e);
        }
      });

      // Add specific handler for failed to start
      plugin.subscribe('WebChat.failedToStart', () => {
        console.error('[Genesys] WebChat failed to start');

        const errorMessage =
          'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.';

        try {
          // Show error message to user
          alert(errorMessage);

          // Dispatch event for external handlers
          document.dispatchEvent(
            new CustomEvent('genesys:webchat:failedToStart', {
              detail: { message: errorMessage },
            }),
          );
        } catch (e) {
          console.error('[Genesys] Error handling failedToStart:', e);
        }
      });

      // Form submitted handler for analytics
      plugin.subscribe('WebChat.submitted', (data) => {
        console.log('[Genesys] Chat form submitted');

        // Trigger custom event for external analytics
        try {
          document.dispatchEvent(
            new CustomEvent('genesys:webchat:submitted', {
              detail: { formData: data },
            }),
          );
        } catch (e) {
          console.error(
            '[Genesys] Error dispatching form submission event:',
            e,
          );
        }
      });

      // Store CXBus reference for external use
      window._genesysCXBus = CXBus;
    };

    // === CoBrowse Helper Functions ===
    // Define global functions for CoBrowse interactions
    window.startCoBrowseCall = () => {
      console.log('[Genesys] Starting CoBrowse call');
      $('#cobrowse-sessionConfirm').modal({
        backdrop: 'static',
        keyboard: false,
      });
    };

    window.openWebChatWidget = () => {
      console.log('[Genesys] Opening WebChat widget');
      if (window._genesysCXBus) {
        window._genesysCXBus.command('WebChat.open');
      }
    };

    window.openCallUsWidget = () => {
      console.log('[Genesys] Opening CallUs widget');
      if (window._genesysCXBus) {
        window._genesysCXBus.command('CallUs.open');
      }
    };

    window.showCobrowseModal = () => {
      console.log('[Genesys] Showing CoBrowse modal');
      $('#cobrowse-sessionConfirm').modal('hide');

      if (typeof window.startCobrowse === 'function') {
        window.startCobrowse();
      } else {
        console.error('[Genesys] Cobrowse start function not defined');
      }

      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };

    // Define CoBrowse starter function
    window.defineCobrowseStarter = function () {
      window.startCobrowse = function () {
        console.log(
          '[Genesys] CoBrowse initialization requested by user action',
        );

        if (
          window.CobrowseIO &&
          typeof window.CobrowseIO.client === 'function'
        ) {
          CobrowseIO.client().then((c) =>
            c
              .createSessionCode()
              .then(
                (code) =>
                  (document.getElementById(
                    'cobrowse-sessionToken',
                  ).textContent = code.match(/.{1,3}/g).join('-')),
              )
              .catch((err) =>
                console.error(
                  '[Genesys] Error creating CoBrowse session:',
                  err,
                ),
              ),
          );
        } else {
          console.error('[Genesys] CobrowseIO not available');
        }
      };
    };

    // Initialize CoBrowse starter
    defineCobrowseStarter();

    // Additional CoBrowse modal handlers
    window.showCobrowseContactUsModal = () => {
      $('#cobrowse-sessionConfirm').modal('hide');
      $('#cobrowse-contactUsScreen1').modal({ backdrop: 'static' });
    };

    window.cobrowseContactUsOption = () => {
      $('#cobrowse-contactUsScreen1').modal('hide');
      $('#cobrowse-contactUsScreen2').modal('show');
    };

    window.cobrowseClosePopup = () =>
      $('#cobrowse-contactUsScreen2').modal('hide');

    window.cobrowseSessionModal = () => {
      $('#cobrowse-contactUsScreen2').modal('hide');
      if (typeof window.startCobrowse === 'function') {
        window.startCobrowse();
      } else {
        console.error('[Genesys] Cobrowse start function not defined');
      }
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };

    window.endCoBrowseCall = () =>
      CobrowseIO.client()
        .then((c) => c.exitSession())
        .catch((err) =>
          console.error('[Genesys] Error ending CoBrowse call:', err),
        );

    // === Fallback Button Creation ===
    // Add function to force create chat button as fallback
    window.forceCreateChatButton = function () {
      console.log('[Genesys] Forcing official button initialization');

      // Only attempt if the official button doesn't exist
      const existingButton = document.querySelector(
        '.cx-widget.cx-webchat-chat-button',
      );

      if (!existingButton) {
        // First check if widgets script is fully loaded
        if (
          window._genesys &&
          window._genesys.widgets &&
          window._genesys.widgets.main &&
          typeof window._genesys.widgets.main.initialise === 'function'
        ) {
          console.log('[Genesys] widgets.main.initialise exists, calling it');
          try {
            window._genesys.widgets.main.initialise();
            return true;
          } catch (err) {
            console.error(
              '[Genesys] Error calling widgets.main.initialise:',
              err,
            );
          }
        } else if (window._genesysCXBus) {
          console.log(
            '[Genesys] CXBus exists but no initialise function, trying WebChat.render',
          );
          try {
            window._genesysCXBus.command('WebChat.render');
            return true;
          } catch (err) {
            console.error('[Genesys] Error calling WebChat.render:', err);
          }
        } else {
          console.log(
            '[Genesys] Widgets script not fully loaded yet, will retry',
          );

          // Set up a retry mechanism
          if (!window._genesysChatButtonRetryCount) {
            window._genesysChatButtonRetryCount = 0;
          }

          if (window._genesysChatButtonRetryCount < 5) {
            window._genesysChatButtonRetryCount++;
            console.log(
              `[Genesys] Scheduling retry attempt ${window._genesysChatButtonRetryCount}/5 in 1 second`,
            );

            setTimeout(function () {
              window.forceCreateChatButton();
            }, 1000);
          } else {
            console.warn(
              '[Genesys] Maximum retries reached for button creation',
            );
            loadWidgetsScriptExplicitly();
          }

          return false;
        }
      }

      console.log('[Genesys] Button already exists, no initialization needed');
      return true;
    };

    // Add a function to explicitly load the widgets script if needed
    function loadWidgetsScriptExplicitly() {
      if (document.getElementById('genesys-widgets-script-explicit')) {
        console.log('[Genesys] Widgets script already being loaded explicitly');
        return;
      }

      console.log(
        '[Genesys] Loading widgets script explicitly for legacy mode',
      );
      // Only use the local plugins directory in legacy mode
      const localWidgetsUrl = '/assets/genesys/plugins/widgets.min.js';

      const script = document.createElement('script');
      script.id = 'genesys-widgets-script-explicit';
      script.src = localWidgetsUrl;
      script.async = true;
      script.onload = function () {
        console.log(
          '[Genesys] Local widgets script loaded explicitly, now initializing',
        );
        window._genesysChatButtonRetryCount = 0; // Reset retry count
        initializeWidgetsExplicitly();
      };
      script.onerror = function (err) {
        console.error(
          '[Genesys] Failed to load local widgets script explicitly:',
          err,
        );
        console.warn(
          '[Genesys] Attempting minimal button creation despite script loading failure',
        );

        // Only try a basic fallback in legacy mode - just create a simple button element
        const container = document.getElementById(cfg.targetContainer);
        if (container) {
          const fallbackButton = document.createElement('button');
          fallbackButton.id = 'genesys-minimal-button';
          fallbackButton.textContent = 'Chat with Us';
          fallbackButton.className =
            'cx-widget cx-webchat-chat-button cx-minimal-button';
          fallbackButton.style.backgroundColor = '#0056b3';
          fallbackButton.style.color = 'white';
          fallbackButton.style.padding = '10px 20px';
          fallbackButton.style.borderRadius = '30px';
          fallbackButton.style.border = 'none';
          fallbackButton.style.position = 'fixed';
          fallbackButton.style.bottom = '20px';
          fallbackButton.style.right = '20px';
          fallbackButton.style.zIndex = '9999';
          fallbackButton.style.cursor = 'pointer';
          fallbackButton.style.boxShadow = '0px 2px 10px rgba(0,0,0,0.2)';
          fallbackButton.addEventListener('click', function () {
            alert('Chat is currently unavailable. Please try again later.');
          });
          container.appendChild(fallbackButton);
        }
      };

      document.head.appendChild(script);
    }

    // Function to explicitly initialize widgets after script loading
    function initializeWidgetsExplicitly() {
      console.log('[Genesys] Attempting explicit widgets initialization');

      // Add essential configuration that might be missing
      if (!window._genesys) {
        window._genesys = {};
      }

      // Try multiple initialization methods
      try {
        // Method 1: Initialize via widgets.main object
        if (
          window._genesys &&
          window._genesys.widgets &&
          window._genesys.widgets.main
        ) {
          console.log('[Genesys] Initializing via widgets.main.initialise()');
          window._genesys.widgets.main.initialise();
        }
        // Method 2: Initialize via CXBus
        else if (window._genesysCXBus) {
          console.log('[Genesys] Initializing via CXBus commands');
          window._genesysCXBus.command('WebChat.render');
        }
        // Method 3: Try standard configuration
        else {
          console.log('[Genesys] Setting up default widgets configuration');
          if (!window._genesys.widgets) {
            window._genesys.widgets = {
              main: {
                theme: 'blue',
                lang: 'en-us',
                preload: ['webchat'],
              },
              webchat: {
                transport: {
                  type: 'purecloud-v2-sockets',
                  dataURL: clickToChatEndpoint,
                  deploymentKey: clickToChatToken,
                  orgGuid: cfg.orgId || '',
                },
                emojis: true,
                cometD: {},
                autoInvite: false,
                targetContainer:
                  cfg.targetContainer || 'genesys-chat-container',
              },
            };
          }

          // At this point, try to load additional dependencies if needed
          if (
            typeof $ === 'undefined' &&
            typeof window.jQuery === 'undefined'
          ) {
            console.log('[Genesys] Loading jQuery as dependency');
            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            jqueryScript.onload = function () {
              console.log('[Genesys] jQuery loaded, retrying initialization');
              setTimeout(function () {
                initializeWidgetsExplicitly();
              }, 500);
            };
            document.head.appendChild(jqueryScript);
            return;
          }
        }

        // After initialization attempt, schedule a check
        setTimeout(function () {
          if (window._genesysCheckWidgetsReady()) {
            console.log(
              '[Genesys] Widgets successfully initialized after explicit initialization',
            );
            window._genesysScriptLoadingState.initializedWidgets = true;
            window.forceCreateChatButton();
          } else {
            console.log(
              '[Genesys] Still waiting for initialization, checking again...',
            );
            setTimeout(window.forceCreateChatButton, 1000);
          }
        }, 1000);
      } catch (err) {
        console.error('[Genesys] Error during explicit initialization:', err);
        // Just try the button creation anyway after a delay
        setTimeout(window.forceCreateChatButton, 1500);
      }
    }

    // Make accessible globally
    window._forceChatButtonCreate = window.forceCreateChatButton;
    window._initializeWidgetsExplicitly = initializeWidgetsExplicitly;

    // Setup button check timeout
    setTimeout(() => {
      if (!document.querySelector('.cx-widget.cx-webchat-chat-button')) {
        console.log(
          '[Genesys] No chat button found after timeout, initializing official button',
        );
        window.forceCreateChatButton();
      }
    }, 2000);

    // Define global functions for opening the plan switcher
    window.openPlanSwitcher = function () {
      console.log('[Genesys] Opening Plan Switcher');
      // Close the widget first
      if (window._genesysCXBus) {
        try {
          window._genesysCXBus.command('WebChat.close');
        } catch (err) {
          console.error(
            '[Genesys] Error closing chat before plan switch:',
            err,
          );
        }
      }

      // Try to access the plan switcher from the store if exists
      try {
        if (window.__ZUSTAND_STORES__?.planStore) {
          window.__ZUSTAND_STORES__.planStore.getState().openPlanSwitcher();
        } else {
          // Fallback to focusing on a plan select dropdown
          const planSelect = document.getElementById('plan-select');
          if (planSelect) {
            planSelect.focus();
          }
        }
      } catch (err) {
        console.error('[Genesys] Error opening plan switcher:', err);
        alert('Unable to switch plans at this time. Please try again later.');
      }
    };

    // Define OpenChatDisclaimer for Terms & Conditions
    window.OpenChatDisclaimer = function () {
      console.log('[Genesys] Opening Chat Disclaimer');
      let title = 'Terms and Conditions';
      let message =
        'By using our chat service, you agree to our terms and conditions.';
      let url = '#';

      // Use LOB to determine the appropriate T&C content
      const lob = cfg.LOB || 'Default';

      switch (lob) {
        case 'BC': // BlueCare
          title = 'BlueCare Chat Terms';
          message =
            'By using BlueCare chat services, you agree to our terms and conditions.';
          url = '/terms/bluecare-terms';
          break;
        case 'BA': // SeniorCare
          title = 'SeniorCare Chat Terms';
          message =
            'By using SeniorCare chat services, you agree to our terms and conditions.';
          url = '/terms/seniorcare-terms';
          break;
        case 'INDV': // Individual
          title = 'Individual Plan Chat Terms';
          message =
            'By using Individual Plan chat services, you agree to our terms and conditions.';
          url = '/terms/individual-terms';
          break;
        case 'INDVMX': // BlueElite
          title = 'BlueElite Chat Terms';
          message =
            'By using BlueElite chat services, you agree to our terms and conditions.';
          url = '/terms/blueelite-terms';
          break;
        default:
        // Use defaults already set
      }

      // Create and display the modal
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.zIndex = '9999';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';

      const content = document.createElement('div');
      content.style.backgroundColor = 'white';
      content.style.padding = '20px';
      content.style.borderRadius = '5px';
      content.style.maxWidth = '500px';
      content.style.width = '80%';

      content.innerHTML = `
        <h3 style="margin-top:0">${title}</h3>
        <p>${message}</p>
        <div style="text-align:center">
          <button id="terms-ok" style="padding:8px 16px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer">OK</button>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      document
        .getElementById('terms-ok')
        .addEventListener('click', function () {
          document.body.removeChild(modal);
        });

      return false; // Prevent default link behavior
    };
  }

  // === LEGACY SCRIPT LOADER ===
  (function () {
    // Only load in legacy mode
    if (cfg.chatMode === 'cloud') {
      console.log(
        '[Genesys] Cloud mode detected, skipping legacy script loading',
      );
      return;
    }

    console.log('[Genesys] Legacy mode detected, loading widgets script');

    // Add event listener for manual button creation
    document.addEventListener('genesys:create-button', () => {
      console.log('[Genesys] Received create-button event');
      if (window.forceCreateChatButton) {
        window.forceCreateChatButton();
      }
    });

    // Track script loading state globally
    window._genesysScriptLoadingState = {
      widgetsScriptLoaded: false,
      widgetsScriptFailed: false,
      initializedWidgets: false,
    };

    // Add a function to explicitly check if widgets are ready
    window._genesysCheckWidgetsReady = function () {
      console.log('[Genesys] Checking widgets readiness');

      // Method 1: Check for widgets.main.initialise function
      const hasMainFunction =
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.main &&
        typeof window._genesys.widgets.main.initialise === 'function';

      // Method 2: Check for CXBus availability
      const hasCXBus =
        window._genesysCXBus &&
        typeof window._genesysCXBus.command === 'function';

      // Method 3: Check for Genesys UI widgets loaded
      const hasUIComponents = document.querySelector('.cx-widget') !== null;

      // Method 4: Check if chat button exists (strongest indicator)
      const hasChatButton =
        document.querySelector('.cx-widget.cx-webchat-chat-button') !== null;

      // Log all available initialization indicators
      console.log('[Genesys] Initialization indicators:', {
        hasMainFunction,
        hasCXBus,
        hasUIComponents,
        hasChatButton,
      });

      // Consider widgets ready if we have either the main function or CXBus
      // or if we can see UI components already
      return hasMainFunction || hasCXBus || hasUIComponents || hasChatButton;
    };

    // Load widgets.min.js script if in legacy mode
    const localWidgetsUrl = '/assets/genesys/plugins/widgets.min.js';

    console.log(
      '[Genesys] Attempting to load local widgets script from',
      localWidgetsUrl,
    );
    loadResource
      .script(localWidgetsUrl, { id: 'genesys-widgets-script' })
      .then((scriptEl) => {
        console.log('[Genesys] Local widgets script loaded successfully');
        window._genesysScriptLoadingState.widgetsScriptLoaded = true;

        // Set up a timeout to verify widgets initialization
        let checkCount = 0;
        const maxChecks = 20; // Increase max check attempts
        const checkInterval = 500; // Increase check interval for more time

        const checkWidgetsReady = function () {
          checkCount++;

          if (window._genesysCheckWidgetsReady()) {
            console.log(
              '[Genesys] Widgets successfully initialized after script load',
            );
            window._genesysScriptLoadingState.initializedWidgets = true;

            // Check for button after widgets are ready
            if (!document.querySelector('.cx-widget.cx-webchat-chat-button')) {
              console.log(
                '[Genesys] No button after widgets ready, creating one',
              );
              if (window.forceCreateChatButton) {
                window.forceCreateChatButton();
              }
            }

            return;
          }

          if (checkCount < maxChecks) {
            console.log(
              `[Genesys] Widgets not initialized yet, check ${checkCount}/${maxChecks}`,
            );

            // If we're at a specific threshold, try explicit initialization
            if (checkCount === 5) {
              console.log(
                '[Genesys] Triggering explicit initialization to help loading process',
              );
              initializeWidgetsExplicitly();
            }

            setTimeout(checkWidgetsReady, checkInterval);
          } else {
            console.warn(
              '[Genesys] Widgets failed to initialize after maximum checks, using fallback initialization',
            );

            // Last resort: try full explicit initialization
            initializeWidgetsExplicitly();

            // Try to force button creation anyway after a short delay
            setTimeout(function () {
              if (window.forceCreateChatButton) {
                window.forceCreateChatButton();
              }
            }, 1000);
          }
        };

        // Start checking if widgets are initialized
        setTimeout(checkWidgetsReady, checkInterval);
      })
      .catch((err) => {
        console.error(
          '[Genesys] Failed to load local widgets script for legacy mode:',
          err,
        );
        window._genesysScriptLoadingState.widgetsScriptFailed = true;

        // Trigger error event and notify user that widgets failed to load
        document.dispatchEvent(
          new CustomEvent('genesys:script:error', {
            detail: { error: err },
          }),
        );

        console.warn(
          '[Genesys] Attempting fallback button creation despite script loading failure',
        );
        // Attempt fallback button creation on failure
        if (window.forceCreateChatButton) {
          window.forceCreateChatButton();
        }
      });
  })();

  // Expose key functions to window for external access
  window.GenesysChat = {
    forceCreateButton: window.forceCreateChatButton,
    openChat: () =>
      window._genesysCXBus && window._genesysCXBus.command('WebChat.open'),
    closeChat: () =>
      window._genesysCXBus && window._genesysCXBus.command('WebChat.close'),
    startCoBrowse: window.startCoBrowseCall,
  };

  // Log initialization complete
  console.log('[Genesys] Chat initialization complete');
})(window, document);
