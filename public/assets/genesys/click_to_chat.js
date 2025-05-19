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
      console.log('[click_to_chat.js] initLocalWidgetConfiguration called.');
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
        preload: ['webchat'], // webchat will be loaded by widgets.min.js
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
            "<div class='modalTitle'>We\'ll be right here if we can</br>help with anything else.</div>",
          ChatEndCancel: 'STAY',
          ChatEndConfirm: 'CLOSE CHAT',
          ConfirmCloseCancel: 'STAY',
          ActionsCobrowseStart: 'Share Screen',
          ConfirmCloseConfirm: 'CLOSE CHAT',
          ChatEndQuestion:
            "<div class='modalTitle'>We\'ll be right here if we can</br>help with anything else.</div>",
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
            enabled: true, // Button should be enabled by default, visibility controlled by showChatButton
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

    // === Load widgets.min.js AND THEN initialize ===
    console.log(
      '[click_to_chat.js] Now responsible for loading widgets.min.js',
    );
    const widgetsMinJsUrl = '/assets/genesys/plugins/widgets.min.js';
    loadResource
      .script(widgetsMinJsUrl, { id: 'genesys-widgets-min-script-dynamic' })
      .then(() => {
        console.log(
          `[click_to_chat.js] ${widgetsMinJsUrl} dynamically loaded. Defining onReady callback.`,
        );

        // Define onReady. initLocalWidgetConfiguration and initialise() will be called INSIDE it.
        if (window._genesys && window._genesys.widgets) {
          window._genesys.widgets.onReady = (CXBus) => {
            console.log(
              '[click_to_chat.js] CXBus ready (via onReady callback). Ordering: 1. initLocalWidgetConfiguration, 2. main.initialise, 3. CXBus commands/plugins.',
            );

            // 1. Call initLocalWidgetConfiguration()
            console.log(
              '[click_to_chat.js] onReady: Calling initLocalWidgetConfiguration().',
            );
            initLocalWidgetConfiguration();
            console.log(
              '[click_to_chat.js] onReady: initLocalWidgetConfiguration() completed.',
            );

            // 2. Call _genesys.widgets.main.initialise()
            console.log(
              '[click_to_chat.js] onReady: Calling _genesys.widgets.main.initialise().',
            );
            if (
              window._genesys.widgets.main &&
              typeof window._genesys.widgets.main.initialise === 'function'
            ) {
              try {
                window._genesys.widgets.main.initialise();
                console.log(
                  '[click_to_chat.js] onReady: _genesys.widgets.main.initialise() called successfully.',
                );
              } catch (initError) {
                console.error(
                  '[click_to_chat.js] onReady: Error calling _genesys.widgets.main.initialise():',
                  initError,
                );
                // Dispatch an error event for the app to potentially pick up
                document.dispatchEvent(
                  new CustomEvent('genesys:error', {
                    detail: {
                      message: 'Error during main.initialise() in onReady',
                      error: initError,
                    },
                  }),
                );
              }
            } else {
              console.error(
                '[click_to_chat.js] onReady: _genesys.widgets.main.initialise is NOT a function. Cannot initialize. Current _genesys.widgets.main:',
                JSON.parse(JSON.stringify(window._genesys.widgets.main || {})),
              );
              document.dispatchEvent(
                new CustomEvent('genesys:error', {
                  detail: {
                    message:
                      '_genesys.widgets.main.initialise not found in onReady',
                  },
                }),
              );
            }

            // 3. Register CXBus plugins, event subscriptions, and show button
            console.log(
              '[click_to_chat.js] onReady: Storing CXBus reference and registering plugins.',
            );
            window._genesysCXBus = CXBus; // Store CXBus reference globally
            const plugin = CXBus.registerPlugin('LocalCustomization');

            // WebChat.opened handler
            plugin.subscribe('WebChat.opened', () => {
              console.log('[click_to_chat.js] WebChat opened');
              // ... (existing WebChat.opened logic from original script)
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

                  const links = selfServiceLinks || [];
                  links.forEach((e) => {
                    if (e.value && e.value.startsWith('http')) {
                      $('.cx-form table').append(
                        `<tr><td colspan='2'><a class='btn btn-secondary' href='${e.value}' target='_blank'>${e.key}</a></td></tr>`,
                      );
                    }
                  });

                  $('.activeChat').hide();
                  $('button[data-message="ChatFormSubmit"]').hide();
                }
              } catch (error) {
                console.error(
                  '[Genesys] Error handling after-hours logic:',
                  error,
                );
              }
              try {
                document.dispatchEvent(
                  new CustomEvent('genesys:webchat:opened'),
                );
              } catch (e) {
                console.error(
                  '[Genesys] Error dispatching webchat:opened event:',
                  e,
                );
              }
            });

            // Message added handler
            plugin.subscribe('WebChat.messageAdded', (data) => {
              console.log('[click_to_chat.js] New message received');
              // ... (existing WebChat.messageAdded logic from original script)
              try {
                if (data && data.response && data.response.message) {
                  webAlert.muted = false;
                  webAlert
                    .play()
                    .catch((e) =>
                      console.log('[Genesys] Audio play error:', e),
                    );

                  if (document.visibilityState !== 'visible') {
                    console.log(
                      '[Genesys] Document not visible, notifying user',
                    );
                    try {
                      document.dispatchEvent(
                        new CustomEvent('genesys:message:received', {
                          detail: { message: data.response.message },
                        }),
                      );
                    } catch (e) {
                      console.error(
                        '[Genesys] Error dispatching message event:',
                        e,
                      );
                    }
                  }
                }
              } catch (err) {
                console.error('[Genesys] Error in messageAdded handler:', err);
              }
            });

            // WebChat.error handler
            plugin.subscribe('WebChat.error', (error) => {
              console.error('[click_to_chat.js] WebChat error:', error);
              // ... (existing WebChat.error logic from original script)
              const errorMessage =
                'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.';
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
                    if (window._genesysCXBus) {
                      window._genesysCXBus.command('WebChat.open');
                    }
                  });
                }
              } catch (err) {
                console.error(
                  '[Genesys] Error displaying chat error message:',
                  err,
                );
              }
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

            plugin.subscribe('WebChat.failedToStart', () => {
              console.error('[Genesys] WebChat failed to start');
              const errorMessage =
                'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.';
              try {
                alert(errorMessage);
                document.dispatchEvent(
                  new CustomEvent('genesys:webchat:failedToStart', {
                    detail: { message: errorMessage },
                  }),
                );
              } catch (e) {
                console.error('[Genesys] Error handling failedToStart:', e);
              }
            });

            plugin.subscribe('WebChat.submitted', (data) => {
              console.log('[Genesys] Chat form submitted');
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

            // After CXBus is ready and handlers are set up, try to show the chat button
            console.log(
              '[click_to_chat.js] onReady: CXBus plugins registered. Attempting to show chat button.',
            );
            try {
              CXBus.command('WebChat.showChatButton');
              document.dispatchEvent(new CustomEvent('genesys:ready')); // Signal overall readiness
              console.log(
                '[click_to_chat.js] onReady: WebChat.showChatButton commanded successfully.',
              );
            } catch (e) {
              console.error(
                '[click_to_chat.js] onReady: Error showing chat button via CXBus:',
                e,
              );
            }
          };
          console.log(
            '[click_to_chat.js] window._genesys.widgets.onReady has been defined.',
          );
        } else {
          console.error(
            '[click_to_chat.js] _genesys.widgets object not available to set onReady after widgets.min.js load. Chat will likely fail.',
          );
          document.dispatchEvent(
            new CustomEvent('genesys:error', {
              detail: {
                message: '_genesys.widgets not available to define onReady.',
                error: new Error('_genesys.widgets undefined post load'),
              },
            }),
          );
        }

        // Rely on widgets.min.js internal load and onReady event to trigger further initialization.
        // No longer need to explicitly call initializeWidgetsExplicitly() from here.
        console.log(
          '[click_to_chat.js] Relying on widgets.min.js internal preloading and its onReady event to trigger configured initialization steps.',
        );
      })
      .catch((err) => {
        console.error(
          `[click_to_chat.js] CRITICAL: Failed to load ${widgetsMinJsUrl}:`,
          err,
        );
        document.dispatchEvent(
          new CustomEvent('genesys:error', {
            detail: {
              message: `Failed to load ${widgetsMinJsUrl}`,
              error: err,
            },
          }),
        );
        // Handle this critical failure - chat won't work.
        // Display an error message to the user or trigger an error state.
      });

    // The rest of initializeChatWidget (CoBrowse functions, _forceChatButtonCreate,
    // initializeWidgetsExplicitly, _genesysCheckWidgetsReady)
    // should be defined as they were, but their invocation related to widgets.min.js loading
    // is now controlled by the .then() block above.

    // === CoBrowse Helper Functions ===
    // ... (keep existing CoBrowse helper functions: startCoBrowseCall, openWebChatWidget, etc.) ...
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
    defineCobrowseStarter();

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

    // === Fallback Button Creation & Widget Initialization Functions ===
    // These functions (forceCreateChatButton, initializeWidgetsExplicitly, _genesysCheckWidgetsReady)
    // are now called AFTER widgets.min.js is loaded, from within the .then() block of loadResource.script.
    // Their definitions remain largely the same.

    window.forceCreateChatButton = function () {
      // ... (keep existing forceCreateChatButton logic) ...
      if (window._genesysButtonCreationInProgress) {
        console.log(
          '[Genesys] Button creation already in progress, skipping duplicate call',
        );
        return false;
      }
      window._genesysButtonCreationInProgress = true;
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
      console.log('[Genesys] Forcing official button initialization');
      if (cfg.chatMode === 'legacy') {
        console.log('[Genesys] Using legacy mode button creation approach');
        try {
          if (
            window._genesysCXBus &&
            typeof window._genesysCXBus.command === 'function'
          ) {
            console.log('[Genesys] Legacy mode: Using CXBus.command()');
            const now = Date.now();
            if (
              !window._genesysLastCXBusCommandTime ||
              now - window._genesysLastCXBusCommandTime > 1000
            ) {
              window._genesysLastCXBusCommandTime = now;
              window._genesysCXBus.command('WebChat.showChatButton', {
                immediate: true,
              });
            }
          } else {
            console.log(
              '[Genesys] Legacy mode: CXBus not available for button creation, attempting explicit init.',
            );
            if (typeof initializeWidgetsExplicitly === 'function')
              initializeWidgetsExplicitly();
          }
        } catch (e) {
          console.error('[Genesys] Error creating button in legacy mode:', e);
          if (typeof initializeWidgetsExplicitly === 'function')
            initializeWidgetsExplicitly();
        }
      } else if (cfg.chatMode === 'cloud') {
        // ... (cloud mode button logic - unlikely to be used if legacy is primary)
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
      window._genesysButtonCreationInProgress = false;
      return true;
    };
    window._forceChatButtonCreate = window.forceCreateChatButton; // Expose globally

    /*
    function initializeWidgetsExplicitly() {
      // This function is called after widgets.min.js is presumed to be loaded.
      console.log('[click_to_chat.js] initializeWidgetsExplicitly called.');
      if (
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.main &&
        typeof window._genesys.widgets.main.initialise === 'function'
      ) {
        console.log(
          '[click_to_chat.js] Calling window._genesys.widgets.main.initialise(). Current config:',
          JSON.parse(JSON.stringify(window._genesys.widgets.main)), // Log current main config
        );
        try {
          window._genesys.widgets.main.initialise();
          console.log(
            '[click_to_chat.js] window._genesys.widgets.main.initialise() called successfully.',
          );
          // The onReady callback should handle CXBus and subsequent button display.
        } catch (initError) {
          console.error(
            '[click_to_chat.js] Error calling window._genesys.widgets.main.initialise():',
            initError,
          );
        }
      } else {
        console.warn(
          '[click_to_chat.js] widgets.main.initialise is not available. Retrying with _genesysCheckWidgetsReady. Current state:',
          {
            has_genesys: typeof window._genesys !== 'undefined',
            has_widgets: typeof window._genesys?.widgets !== 'undefined',
            has_main: typeof window._genesys?.widgets?.main !== 'undefined',
            has_initialise:
              typeof window._genesys?.widgets?.main?.initialise === 'function',
          },
        );
        // if (typeof window._genesysCheckWidgetsReady === 'function') { // This check would be against a now-commented function
        //   setTimeout(window._genesysCheckWidgetsReady, 250); // Retry check
        // } else {
        //   console.error(
        //     '[click_to_chat.js] _genesysCheckWidgetsReady is not defined. Cannot retry initialization.',
        //   );
        // }
      }
    }
    */
    // window._initializeWidgetsExplicitly = initializeWidgetsExplicitly; // Expose globally

    /*
    window._genesysCheckWidgetsReady = function () {
      console.log(
        '[click_to_chat.js] _genesysCheckWidgetsReady: Checking for widgets main and initialise function...',
      );
      if (
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.main &&
        typeof window._genesys.widgets.main.initialise === 'function'
      ) {
        console.log(
          '[click_to_chat.js] _genesysCheckWidgetsReady: Widgets ready. Calling initializeWidgetsExplicitly.',
        );
        // initializeWidgetsExplicitly(); // This would call a now-commented function
      } else {
        console.log(
          '[click_to_chat.js] _genesysCheckWidgetsReady: Widgets not ready yet. Retrying in 1s. State:',
          {
            has_genesys: typeof window._genesys !== 'undefined',
            has_widgets: typeof window._genesys?.widgets !== 'undefined',
            has_main: typeof window._genesys?.widgets?.main !== 'undefined',
            has_initialise:
              typeof window._genesys?.widgets?.main?.initialise === 'function',
          },
        );
        // setTimeout(window._genesysCheckWidgetsReady, 1000); // Self-recursion for a commented function
      }
    };
    */

    // The original onWidgetsLoad function is effectively replaced by the .then() block
    // of the loadResource.script(widgetsMinJsUrl) call.

    // Remove or adapt the old "LEGACY SCRIPT LOADER" IIFE as its primary role
    // (loading widgets.min.js and then initializing) is now handled explicitly above.
    // The IIFE's legacyInnerCheckWidgetsReady might have some specific checks,
    // but the new structure should be more robust. For now, let's comment out the IIFE
    // to prevent conflicts.
    /*
    (function () {
      // ... old IIFE content ...
    })();
    */
    console.log(
      '[click_to_chat.js] End of initializeChatWidget main logic. Initialization is now event-driven by widgets.min.js load.',
    );
  } // End of initializeChatWidget

  // Expose key functions to window for external access (can remain as is)
  // ... (keep existing window.GenesysChat export)

  // Log initialization complete
  console.log('[Genesys] Chat initialization complete');
})(window, document);
