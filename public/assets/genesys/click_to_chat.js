(function (window, document) {
  'use strict';

  console.log('[click_to_chat.js] STARTING EXECUTION');
  console.log(
    '[click_to_chat.js] Initial window.chatSettings:',
    JSON.parse(JSON.stringify(window.chatSettings || {})),
  );
  // debugger; // Optionally add a debugger statement here

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

    console.log(
      '[click_to_chat.js] Validated cfg:',
      JSON.parse(JSON.stringify(cfg)),
    );
    // debugger;

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
    /* Enhanced button styling */
    background-color: #0056b3 !important;
    color: white !important;
    border-radius: 50px !important;
    padding: 10px 20px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
    transition: all 0.3s ease !important;
    min-width: 100px !important;
    min-height: 45px !important;
    align-items: center !important;
    justify-content: center !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  .cx-widget.cx-webchat-chat-button:hover {
    background-color: #003d7a !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
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

  // Safety timeout - ensure button is visible after 10 seconds no matter what
  setTimeout(() => {
    console.log('[Genesys] Safety timeout: Ensuring chat button is visible');

    // First check if button already exists
    const existingButton = document.querySelector(
      '.cx-widget.cx-webchat-chat-button',
    );

    if (!existingButton) {
      console.log('[Genesys] Button not found after 10s, forcing creation');

      // Try various methods to create the button
      if (window._forceChatButtonCreate) {
        window._forceChatButtonCreate();
      }

      if (window._genesysCXBus) {
        try {
          window._genesysCXBus.command('WebChat.showChatButton');
        } catch (e) {
          console.error('[Genesys] Error showing button via CXBus:', e);
        }
      }

      // As a last resort, create a custom button style to force visibility
      const style = document.createElement('style');
      style.textContent = `
        .cx-widget.cx-webchat-chat-button {
          display: block !important;
          visibility: visible !important; 
          opacity: 1 !important;
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(style);

      // Dispatch the event to create the button
      document.dispatchEvent(new CustomEvent('genesys:create-button'));
    } else {
      console.log('[Genesys] Button exists after 10s, ensuring visibility');
      existingButton.style.display = 'flex';
      existingButton.style.visibility = 'visible';
      existingButton.style.opacity = '1';
    }
  }, 10000);

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
      // Prevent multiple simultaneous executions
      if (window._genesysButtonCreationInProgress) {
        console.log(
          '[Genesys] Button creation already in progress, skipping duplicate call',
        );
        return false;
      }

      // Set flag to prevent multiple executions
      window._genesysButtonCreationInProgress = true;

      // First check if button already exists - search only for the official button
      const existingButton = document.querySelector(
        '.cx-widget.cx-webchat-chat-button',
      );

      if (existingButton) {
        console.log(
          '[Genesys] Chat button already exists, not creating a new one',
        );
        window._genesysButtonCreationInProgress = false;
        return true;
      }

      // Only use the official CXBus mechanism to create buttons
      console.log('[Genesys] Forcing official button initialization');

      if (cfg.chatMode === 'legacy') {
        console.log('[Genesys] Using legacy mode button creation approach');

        try {
          // Only use official CXBus command to show the button
          if (
            window._genesysCXBus &&
            typeof window._genesysCXBus.command === 'function'
          ) {
            console.log('[Genesys] Legacy mode: Using CXBus.command()');

            // Debounce multiple calls to CXBus.command - only attempt if no recent call was made
            const now = Date.now();
            if (
              !window._genesysLastCXBusCommandTime ||
              now - window._genesysLastCXBusCommandTime > 1000
            ) {
              window._genesysLastCXBusCommandTime = now;

              // Using the official WebChat.showChatButton API
              window._genesysCXBus.command('WebChat.showChatButton', {
                immediate: true,
              });
            }
          } else {
            console.log(
              '[Genesys] Legacy mode: CXBus not available for button creation',
            );
            initializeWidgetsExplicitly();
          }
        } catch (e) {
          console.error('[Genesys] Error creating button in legacy mode:', e);
          initializeWidgetsExplicitly();
        }
      } else if (cfg.chatMode === 'cloud') {
        console.log('[Genesys] Using cloud mode button creation approach');

        try {
          if (
            window._genesys &&
            window._genesys.widgets &&
            window._genesys.widgets.bus
          ) {
            console.log('[Genesys] Using widgets.bus for cloud mode button');
            window._genesys.widgets.bus.command('WebChat.showChatButton');
          }
        } catch (e) {
          console.error('[Genesys] Error creating button in cloud mode:', e);
        }
      }

      // Clear flag to allow future attempts
      window._genesysButtonCreationInProgress = false;
      return true;
    };

    // Add a function to explicitly load the widgets script if needed
    function loadWidgetsScriptExplicitly() {
      // Check if widgets script is already being loaded
      if (
        document.getElementById('genesys-widgets-script-explicit') ||
        document.getElementById('genesys-widgets-script') ||
        window._genesysScriptLoadExplicitlyInProgress
      ) {
        console.log(
          '[Genesys] Widgets script already being loaded explicitly or in progress',
        );
        return;
      }

      // Set flag to prevent multiple simultaneous loads
      window._genesysScriptLoadExplicitlyInProgress = true;

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
        window._genesysScriptLoadExplicitlyInProgress = false; // Clear loading flag
        initializeWidgetsExplicitly();
      };
      script.onerror = function (err) {
        console.error(
          '[Genesys] Failed to load local widgets script explicitly:',
          err,
        );
        window._genesysScriptLoadExplicitlyInProgress = false; // Clear loading flag
        console.warn(
          '[Genesys] Script loading failed - unable to initialize chat widget',
        );
      };

      document.head.appendChild(script);
    }

    // Function to explicitly initialize widgets after script loading
    function initializeWidgetsExplicitly() {
      // Guard against multiple initializations
      if (window._genesysWidgetsInitializationInProgress) {
        console.log(
          '[Genesys] Widgets initialization already in progress, skipping duplicate call',
        );
        return;
      }

      window._genesysWidgetsInitializationInProgress = true;
      console.log('[Genesys] Attempting explicit widgets initialization');

      try {
        // For legacy mode, we need to use the v1 webchat configuration
        if (cfg.chatMode === 'legacy') {
          console.log(
            '[Genesys] Setting up legacy mode v1 webchat configuration',
          );

          // Ensure minimal _genesys structure
          window._genesys = window._genesys || {};
          window._genesys.widgets = window._genesys.widgets || {};
          window._genesys.widgets.main = window._genesys.widgets.main || {
            theme: 'light',
            lang: 'en',
            preload: ['webchat'],
            header: { Authorization: `Bearer ${clickToChatToken}` },
          };

          // Configure webchat properly
          window._genesys.widgets.webchat =
            window._genesys.widgets.webchat || {};
          const webchatConfig = {
            transport: {
              type: 'purecloud-v1-xhr',
              dataURL: isDemoMember
                ? clickToChatDemoEndPoint
                : clickToChatEndpoint,
              deploymentKey: clickToChatToken,
            },
            userData: {
              firstName: cfg.firstname || cfg.formattedFirstName || 'Guest',
              lastName: cfg.lastname || cfg.memberLastName || 'User',
            },
            targetContainer: cfg.targetContainer || 'genesys-chat-container',
            chatButton: {
              enabled: true,
              template:
                '<div class="cx-widget cx-webchat-chat-button cx-side-button" role="button" tabindex="0" data-message="ChatButton" data-gcb-service-node="true"><span class="cx-icon" data-icon="chat"></span><span class="i18n cx-chat-button-label" data-message="ChatButton"></span></div>',
              openDelay: 1000,
              effectDuration: 300,
              hideDuringInvite: true,
            },
          };

          // Apply webchat configuration
          Object.assign(window._genesys.widgets.webchat, webchatConfig);

          // Add a completed callback to show button
          window._genesys.widgets.onReady = function () {
            console.log(
              '[Genesys] Widgets onReady event fired, explicitly showing button',
            );
            if (window._genesysCXBus) {
              window._genesysCXBus.command('WebChat.showChatButton');
            }
          };
        }

        // Attempt to get the "widgets.main" object
        console.log('[Genesys] Checking for widget options');

        // Delay slightly to allow widgets to initialize internally
        setTimeout(function () {
          if (typeof window._genesys.widgets.main.initialise === 'function') {
            console.log(
              '[Genesys] Found widgets.main.initialise, triggering it',
            );
            try {
              // Attempt to initialize
              window._genesys.widgets.main.initialise();
              setTimeout(function () {
                window._genesysWidgetsInitializationInProgress = false;

                // Explicitly force button visibility after initialization
                console.log(
                  '[Genesys] Explicitly showing chat button after initialization',
                );
                if (window._genesysCXBus) {
                  window._genesysCXBus.command('WebChat.showChatButton');
                }
              }, 1000);
            } catch (err) {
              console.error('[Genesys] Error initializing widgets:', err);
              window._genesysWidgetsInitializationInProgress = false;
            }
          } else {
            console.log(
              '[Genesys] widgets.main.initialise is not a function, checking widgets readiness',
            );
            checkWidgetsReady();
          }
        }, 100);
      } catch (error) {
        console.error(
          '[Genesys] Error in explicit widgets initialization:',
          error,
        );
        window._genesysWidgetsInitializationInProgress = false;
      }
    }

    // Make accessible globally
    window._forceChatButtonCreate = window.forceCreateChatButton;
    window._initializeWidgetsExplicitly = initializeWidgetsExplicitly;

    // Add a flag to prevent duplicate script loading
    window._genesysScriptAlreadyAttempted =
      window._genesysScriptAlreadyAttempted || false;

    // Setup button check timeout - only do this once
    if (!window._genesysButtonCheckTimeout) {
      window._genesysButtonCheckTimeout = true;
      setTimeout(() => {
        if (!document.querySelector('.cx-widget.cx-webchat-chat-button')) {
          console.log(
            '[Genesys] No chat button found after timeout, initializing official button',
          );
          window.forceCreateChatButton();
        }
      }, 2000);
    }

    // === LEGACY SCRIPT LOADER ===
    (function () {
      window._genesysScriptAlreadyAttempted = true;

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

        try {
          if (cfg.chatMode === 'legacy') {
            console.log('[Genesys] Using legacy mode widgets readiness checks');

            // Legacy mode checks for different indicators
            let hasMainFunction = false;
            let hasCXBus = false;
            let hasV1Transport = undefined;
            let hasUIComponents = false;
            let hasChatButton = false;

            try {
              hasMainFunction =
                typeof window._genesys?.widgets?.main?.initialise ===
                'function';
              hasCXBus = Boolean(window._genesysCXBus?.command);
              hasV1Transport =
                window._genesys?.widgets?.webchat?.transport?.type ===
                'purecloud-v1-xhr';
              hasUIComponents = Boolean(
                window._genesys?.widgets?.webChat?.renderer?.create,
              );
              hasChatButton = Boolean(
                document.querySelector('.cx-widget.cx-webchat-chat-button'),
              );
            } catch (e) {
              console.error('[Genesys] Error checking widget status:', e);
            }

            console.log('[Genesys] Legacy mode initialization indicators:', {
              hasMainFunction,
              hasCXBus,
              hasV1Transport,
              hasUIComponents,
              hasChatButton,
            });

            // If CXBus is available, that's usually sufficient to proceed
            if (hasCXBus) {
              console.log(
                '[Genesys] Widgets successfully initialized after script load',
              );
              window._genesysWidgetsInitializationInProgress = false;

              // Explicitly show the button
              console.log(
                '[Genesys] Explicitly showing chat button after widgets ready',
              );
              try {
                window._genesysCXBus.command('WebChat.showChatButton');
              } catch (e) {
                console.error('[Genesys] Error showing chat button:', e);
              }

              // But still check if we need to create a button if none exists
              setTimeout(function () {
                if (
                  !document.querySelector('.cx-widget.cx-webchat-chat-button')
                ) {
                  console.log(
                    '[Genesys] No button after widgets ready, creating one',
                  );
                  window.forceCreateChatButton();
                }
              }, 500);

              return;
            }

            // No CXBus yet, continue polling
            setTimeout(checkWidgetsReady, 250);
          }
          // Cloud mode readiness checks
          else if (cfg.chatMode === 'cloud') {
            console.log('[Genesys] Using cloud mode widget readiness checks');

            // If Genesys Cloud API is available, try using it
            if (window._genesys?.widgets?.bus) {
              console.log('[Genesys] Widgets bus detected for cloud mode');
              window._genesysWidgetsInitializationInProgress = false;

              // Explicit show button call
              try {
                window._genesys.widgets.bus.command('WebChat.showChatButton');
              } catch (e) {
                console.error(
                  '[Genesys] Error showing button in cloud mode:',
                  e,
                );
              }

              return;
            }

            // Continue polling
            setTimeout(checkWidgetsReady, 250);
          }
        } catch (err) {
          console.error('[Genesys] Error in widget readiness check:', err);
          // Try again
          setTimeout(checkWidgetsReady, 500);
        }
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
              if (
                !document.querySelector('.cx-widget.cx-webchat-chat-button')
              ) {
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

    // Script loaded successfully, now initialize the widget
    console.log(
      '[Genesys] Widgets script loaded successfully, proceeding with initialization',
    );

    // Schedule readiness check to ensure button is shown
    setTimeout(checkWidgetsReady, 500);

    // Start proper initialization
    initializeWidgetsExplicitly();
  }

  // Expose key functions to window for external access
  window.GenesysChat = {
    // Standard APIs
    openChat: () =>
      window._genesysCXBus && window._genesysCXBus.command('WebChat.open'),
    closeChat: () =>
      window._genesysCXBus && window._genesysCXBus.command('WebChat.close'),
    showButton: () =>
      window._genesysCXBus &&
      window._genesysCXBus.command('WebChat.showChatButton'),
    hideButton: () =>
      window._genesysCXBus &&
      window._genesysCXBus.command('WebChat.hideChatButton'),
    // CoBrowse integration
    startCoBrowse: window.startCoBrowseCall,
  };

  // Log initialization complete
  console.log('[Genesys] Chat initialization complete');
})(window, document);
