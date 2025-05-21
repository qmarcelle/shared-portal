(function (window, document) {
  'use strict';

  console.log('[click_to_chat.js] STARTING EXECUTION');
  // Initialize global flags for coordinating chat open requests
  window.genesysLegacyChatOpenRequested = false;
  window.genesysLegacyChatIsReady = false;
  console.log(
    '[click_to_chat.js] Initial window.chatSettings:',
    JSON.parse(JSON.stringify(window.chatSettings || {})),
  );
  // debugger; // Optionally add a debugger statement here

  // === CONFIG SECTION ===
  // Validate and set configuration with defaults
  const validateConfig = (cfg) => {
    const requiredLegacy = ['clickToChatToken', 'clickToChatEndpoint'];
    const requiredCloud = ['deploymentId', 'orgId']; // Added for cloud mode

    // Determine mode and check required fields
    const mode = cfg.chatMode || 'legacy'; // Default to legacy if chatMode is not set
    let missingFields = [];

    if (mode === 'legacy') {
      missingFields = requiredLegacy.filter((field) => !cfg[field]);
    } else if (mode === 'cloud') {
      missingFields = requiredCloud.filter((field) => !cfg[field]);
    } else {
      console.error('[Genesys] Unknown chat mode in validateConfig:', mode);
      // Treat unknown mode as invalid or handle as per requirements
      missingFields = [...requiredLegacy, ...requiredCloud]; // Or some other default error state
    }

    if (missingFields.length > 0) {
      console.error(
        `[Genesys] Missing required fields for ${mode} mode:`,
        missingFields.join(', '),
      );
      // Optionally, you could throw an error here or return an invalid status
      // For now, it just logs the error, original behavior was to proceed.
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

  // --- TEMP: FORCE LEGACY MODE FOR TESTING ---
  // TODO: Remove this line after testing legacy mode
  // cfg.chatMode = 'legacy'; // REMOVED THIS LINE
  // console.log(
  //   '[click_to_chat.js] TEMP OVERRIDE: chatMode forced to legacy',
  //   JSON.parse(JSON.stringify(cfg)),
  // );
  // --- END TEMP ---

  // Backwards compatibility: mirror all JSP-injected values directly on window
  // These constants provide local, convenient access to cfg properties.
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

        // Improved cache-busting: appends _t parameter correctly.
        const cacheBuster = `_t=${Date.now()}`;
        const finalSrc = src + (src.includes('?') ? '&' : '?') + cacheBuster;

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
        throw err; // Propagate error to stop initialization if jQuery fails
      });
  };

  // Load jQuery and initialize chat widget
  loadJQuery()
    .then(($) => initializeChatWidget($, cfg))
    .catch((err) =>
      console.error(
        '[Genesys] Failed to initialize chat widget due to jQuery load error:',
        err,
      ),
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
          console.error(
            '[Genesys] Error showing button via CXBus in safety timeout:',
            e,
          );
        }
      }

      // As a last resort, create a custom button style to force visibility
      const style = document.createElement('style');
      style.id = 'genesys-safety-timeout-styles'; // Add an ID for easier debugging
      style.textContent = `
        .cx-widget.cx-webchat-chat-button {
          display: flex !important; /* Use flex to match injected CSS */
          visibility: visible !important; 
          opacity: 1 !important;
          z-index: 9999 !important; /* Ensure it's on top */
        }
      `;
      document.head.appendChild(style);

      // Dispatch the event to create the button (if applicable, depends on how widgets.min.js listens)
      document.dispatchEvent(new CustomEvent('genesys:create-button'));
    } else {
      console.log('[Genesys] Button exists after 10s, ensuring visibility');
      existingButton.style.display = 'flex'; // Match defined style
      existingButton.style.visibility = 'visible';
      existingButton.style.opacity = '1';
    }
  }, 10000);

  // === CHAT WIDGET INITIALIZATION ===
  function initializeChatWidget($, cfg) {
    console.log('[Genesys] Beginning chat widget initialization');
    console.log(
      `[click_to_chat.js] Timestamp: ${Date.now()} - initializeChatWidget START`,
    );

    // Define mapChatSettingsToUserData here
    function mapChatSettingsToUserData(settings) {
      if (!settings) {
        console.warn(
          '[click_to_chat.js] mapChatSettingsToUserData: chatSettings is undefined. Returning empty userData.',
        );
        return {};
      }
      const userData = {
        // Genesys standard fields (names might need adjustment based on specific Genesys widget version/config)
        firstName: settings.formattedFirstName || settings.firstname || '',
        lastName: settings.memberLastName || settings.lastname || '',
        email: settings.email || '', // Assuming email might be in settings

        // Custom data fields - these can be used for routing or display in agent desktop
        userID: settings.userID || '',
        memberMedicalPlanID: settings.memberMedicalPlanID || '',
        subscriberID: settings.subscriberID || '',
        sfx: settings.sfx || '',
        groupId: settings.groupId || '',
        isDemoMember: String(
          // Ensures string "true" or "false"
          settings.isDemoMember === true || settings.isDemoMember === 'true',
        ),
        isAmplifyMem: String(
          // Ensures string "true" or "false"
          settings.isAmplifyMem === true || settings.isAmplifyMem === 'true',
        ),
        currentPlanName: settings.currentPlanName || '', // Added this as it seems useful
        // Add any other relevant fields from chatSettings that should be passed
      };

      // Clean up userData: remove any properties that are empty strings, null, or undefined
      Object.keys(userData).forEach((key) => {
        if (
          userData[key] === undefined ||
          userData[key] === null ||
          userData[key] === ''
        ) {
          delete userData[key];
        }
      });

      console.log(
        '[click_to_chat.js] mapChatSettingsToUserData generated:',
        JSON.parse(JSON.stringify(userData)),
      );
      return userData;
    }

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
        cfg.isMedical === 'true' || // cfg here is the processed config
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

    // Note: calculatedCiciId would need to be defined based on cfg if it's used in this scope
    // For example: const calculatedCiciId = cfg.ciciId; (Assuming ciciId is part of cfg)
    // This part of the original script was missing its definition if used in buildActiveChatInputs.
    // Assuming it's available through `cfg` or another mechanism.
    // For the purpose of this refactoring, I'll assume `calculatedCiciId` is a correctly scoped variable
    // from the original context if `buildActiveChatInputs` is called.
    // If `buildActiveChatInputs` is meant to be self-contained or relies on a `cfg` property,
    // it should be passed or accessed, e.g., `cfg.calculatedCiciId`.
    // For now, I will leave `calculatedCiciId` as is, assuming it's defined in the original scope.
    // Let's assume it's meant to be derived from cfg for the example:
    const calculatedCiciId = cfg.ciciId || 'Default'; // Placeholder if not explicitly in cfg

    // === Chat Form Builder ===
    function buildActiveChatInputs() {
      const inputs = [];

      // Title section
      inputs.push({
        custom: isAmplifyMem // Uses the const from outer scope
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
        // Uses const from outer scope
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
          // setOptions function was not provided in the original snippet, assuming it exists in scope
          options:
            typeof setOptions === 'function'
              ? setOptions(isDentalOnly() ? 'dentalOnly' : calculatedCiciId)
              : [],
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
        inputs.push({ name: 'SERV_TYPE', value: null, type: 'hidden' }); // Value could be explicitly null or not set
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
          value: String(cfg.isMedical === 'true' || cfg.isMedical === true), // Ensure string true/false from cfg
          type: 'hidden',
        },
        {
          id: 'IsDentalEligible',
          name: 'IsDentalEligible',
          value: String(cfg.isDental === 'true' || cfg.isDental === true), // Ensure string true/false from cfg
          type: 'hidden',
        },
        {
          id: 'IsVisionEligible',
          name: 'IsVisionEligible',
          value: String(cfg.isVision === 'true' || cfg.isVision === true), // Ensure string true/false from cfg
          type: 'hidden',
        },
        {
          id: 'IDCardBotName',
          name: 'IDCardBotName',
          value: routingchatbotEligible ? cfg.idCardChatBotName || '' : '',
          type: 'hidden',
        },
      ];

      hiddenFields.forEach((field) => inputs.push(field));

      // Terms and conditions
      inputs.push({
        custom:
          // OpenChatDisclaimer function was not provided, assuming it exists in scope
          "<tr class='activeChat'><td>By clicking on the button, you agree with our <a href='#' onclick='OpenChatDisclaimer();return false;'>Terms and Conditions</a> for chat.</td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      // User demographics fields (these are often used by Genesys to pre-fill or pass data)
      const demographicFields = [
        {
          id: 'firstName_field', // ID might be for specific styling/DOM manipulation if needed
          name: 'firstname', // Standard Genesys field name
          value: cfg.formattedFirstName || cfg.firstname || '',
        },
        {
          id: 'lastname_field',
          name: 'lastname',
          value: cfg.memberLastName || cfg.lastname || '',
        },
        {
          id: 'memberId_field',
          name: 'MEMBER_ID', // Custom field name for your backend/agent desktop
          value: `${cfg.subscriberID || ''}-${cfg.sfx || ''}`,
        },
        {
          id: 'groupId_field',
          name: 'GROUP_ID',
          value: cfg.groupId || '',
        },
        {
          id: 'planId_field',
          name: 'PLAN_ID',
          value: cfg.memberMedicalPlanID || '',
        },
        {
          id: 'dob_field',
          name: 'MEMBER_DOB',
          value: cfg.memberDOB || '',
        },
        {
          id: 'inquiryType_field',
          name: 'INQ_TYPE',
          value: getChatType(calculatedCiciId),
        },
      ];

      // Add demographic fields to inputs. These might not be 'hidden' in the traditional sense
      // but are often part of the data payload for the chat.
      demographicFields.forEach((field) => {
        // If these are meant to be actual hidden form inputs, they'd need type: 'hidden'
        // If they are just data passed to the widget, this structure is fine.
        inputs.push({ ...field, type: field.type || 'hidden' }); // Default to hidden if type not specified
      });

      return inputs;
    }

    // === Genesys Widget Configuration ===
    function initLocalWidgetConfiguration() {
      console.log('[click_to_chat.js] initLocalWidgetConfiguration called.');
      console.log(
        `[click_to_chat.js] Timestamp: ${Date.now()} - initLocalWidgetConfiguration START`,
      );
      // Initialize namespace objects
      window._genesys = window._genesys || {};
      window._gt = window._gt || []; // Typically for GTag, but might be used by Genesys extensions
      window._genesys.widgets = window._genesys.widgets || {};
      window._genesys.widgets.main = window._genesys.widgets.main || {}; // Ensure main object exists
      window._genesys.widgets.webchat = window._genesys.widgets.webchat || {}; // Ensure webchat object exists

      // Main configuration - MERGE new settings
      Object.assign(window._genesys.widgets.main, {
        debug: window.chatSettings.debug || false, // Use raw chatSettings for these general widget settings
        theme: window.chatSettings.theme || 'light',
        lang: window.chatSettings.lang || 'en',
        mobileMode: 'auto', // Or specific setting from chatSettings if available
        downloadGoogleFont:
          window.chatSettings.downloadGoogleFont === undefined
            ? false
            : window.chatSettings.downloadGoogleFont,
        preload: window.chatSettings.preloadWidgets || ['webchat'], // e.g. ['webchat', 'sidebar']
        // Any other main settings from chatSettings
      });

      console.log(
        '[click_to_chat.js] Main config after Object.assign:',
        JSON.parse(JSON.stringify(window._genesys.widgets.main)),
      );

      // WebChat configuration - MERGE new settings
      Object.assign(window._genesys.widgets.webchat, {
        userData: {
          ...mapChatSettingsToUserData(window.chatSettings), // Use raw chatSettings for mapping user data
          // Add any other user data fields here that are static or derived differently
        },
        autoInvite: {
          // Default autoInvite settings, override with chatSettings if present
          enabled: window.chatSettings.autoInviteEnabled || false,
          timeToInviteSeconds: window.chatSettings.timeToInviteSeconds || 20,
          inviteTimeoutSeconds: window.chatSettings.inviteTimeoutSeconds || 30,
        },
        chatButton: {
          // Default chatButton settings, override with chatSettings if present
          enabled:
            window.chatSettings.chatButtonEnabled === undefined
              ? true
              : window.chatSettings.chatButtonEnabled,
          template:
            window.chatSettings.chatButtonTemplate ||
            // MODIFIED TEMPLATE with INLINE STYLES for positioning:
            '<button id="cx_chat_form_button" role="button" tabindex="0" data-message="ChatButton" data-gcb-service-node="true" onclick="window.requestChatOpen && window.requestChatOpen(); return false;" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary hover:bg-primary-600 text-white" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">Start Chat</button>',
          // Original template was:
          // '<div class="cx-widget cx-widget-chat cx-webchat-chat-button" id="cx_chat_form_button" role="button" tabindex="0" data-message="ChatButton" data-gcb-service-node="true" onclick="window.requestChatOpen && window.requestChatOpen(); return false;"><span class="cx-icon" data-icon="chat"></span><span class="cx-text">Chat With Us</span></div>',
          effectDuration: window.chatSettings.chatButtonEffectDuration || 300,
          openDelay: window.chatSettings.chatButtonOpenDelay || 1000,
          hideDuringInvite:
            window.chatSettings.chatButtonHideDuringInvite === undefined
              ? true
              : window.chatSettings.chatButtonHideDuringInvite,
        },
        transport:
          cfg.chatMode === 'cloud'
            ? {
                type: 'purecloud-v2-sockets',
                deploymentKey: cfg.deploymentId, // cfg is window.chatSettings via validateConfig
                orgGuid: cfg.orgId,
                environment: cfg.environment, // Added environment for cloud
                // dataURL is intentionally omitted for cloud mode with purecloud-v2-sockets
              }
            : {
                // Legacy mode transport configuration
                type: 'rest', // Or whatever the legacy transport type was, default often implies REST/long-polling for older widgets
                dataURL: cfg.clickToChatEndpoint, // Used by legacy
                // Other legacy-specific transport settings if any
              },
        form: {
          wrapper: '<table></table>', // Standard Genesys form wrapper
          inputs: window.chatSettings.chatFormInputs || [
            // Allow full override from chatSettings
            // Default form inputs if not overridden
            {
              name: 'nickname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderNickname', // Uses i18n keys
              label: '@i18n:webchat.ChatFormNickname',
              value: window.chatSettings.formattedFirstName || '', // Pre-fill from raw chatSettings
            },
            {
              name: 'firstname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderFirstName',
              label: '@i18n:webchat.ChatFormFirstName',
              value: window.chatSettings.firstname || '', // Pre-fill
              isHidden: true, // Often hidden if nickname is primary display
            },
            {
              name: 'lastname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderLastName',
              label: '@i18n:webchat.ChatFormLastName',
              value: window.chatSettings.lastname || '', // Pre-fill
              isHidden: true, // Often hidden
            },
            {
              name: 'subject',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderSubject',
              label: '@i18n:webchat.ChatFormSubject',
              value: 'Member Inquiry', // Default subject
              isHidden: true, // Often hidden, can be made visible
            },
            // Potentially add custom fields from buildActiveChatInputs() if structure matches
            // ...buildActiveChatInputs() // This line was in the original, ensure it's correctly placed and formatted
          ],
        },
        // Any other webchat settings from chatSettings (e.g., title, effects)
        ...(window.chatSettings.webchatExtensions || {}), // Merge any additional webchat settings
      });

      // If buildActiveChatInputs provides the *entire* form structure, use it directly:
      // window._genesys.widgets.webchat.form.inputs = buildActiveChatInputs();
      // Or if it provides additional fields to merge with standard ones:
      // window._genesys.widgets.webchat.form.inputs.push(...buildActiveChatInputs());
      // The original script had it outside, then inside. Let's assume it defines the primary inputs:
      // This was a point of ambiguity. If `buildActiveChatInputs` returns the format Genesys expects for `form.inputs`,
      // then it should replace or augment the default `inputs` array above.
      // For now, I'll assume `buildActiveChatInputs` is called and its results are used as THE form inputs
      // if that was the intent. The original code had `form.inputs` defined, then `buildActiveChatInputs` was called
      // without its result being directly assigned to `form.inputs` inside `initLocalWidgetConfiguration`.
      // Based on context, it's likely `buildActiveChatInputs` defines the *custom* form for this implementation.
      // If `cfg` (processed config) is needed by `buildActiveChatInputs`, it should be passed.
      // The original has `buildActiveChatInputs` defined but its result not explicitly assigned to `form.inputs`
      // within `initLocalWidgetConfiguration`. This needs clarification on how it's used by Genesys widget.
      // For this refactor, if `buildActiveChatInputs()` is the source of truth for the form:
      // window._genesys.widgets.webchat.form.inputs = buildActiveChatInputs();
      // However, the original script did *not* assign it here. It was used in older Genesys versions.
      // For modern Genesys Cloud, custom data is primarily via `userData` and `interactionData`.
      // The `form.inputs` is for the pre-chat survey.
      // If `buildActiveChatInputs` is for a custom pre-chat form, its output should be assigned.
      // Given the original structure, `buildActiveChatInputs` seems to be for a legacy/custom form mechanism.
      // For now, let's keep the default form and assume `buildActiveChatInputs` is used by a plugin or older method.

      console.log(
        '[click_to_chat.js] WebChat config after Object.assign:',
        JSON.parse(JSON.stringify(window._genesys.widgets.webchat)),
      );
      console.log(
        `[click_to_chat.js] Timestamp: ${Date.now()} - initLocalWidgetConfiguration END`,
      );
    }

    // === Load widgets.min.js AND THEN initialize ===
    console.log(
      '[click_to_chat.js] Now responsible for loading widgets.min.js',
    );
    // Corrected: Declare widgetsMinJsUrl BEFORE using it in the log below
    const widgetsMinJsUrl =
      cfg.widgetsMinJsUrl || '/assets/genesys/plugins/widgets.min.js';
    console.log(
      `[click_to_chat.js] Timestamp: ${Date.now()} - About to load ${widgetsMinJsUrl}`,
    );
    loadResource
      .script(widgetsMinJsUrl, { id: 'genesys-widgets-min-script-dynamic' })
      .then(() => {
        // Existing log for SCRIPT TAG LOADED
        console.log(
          `[click_to_chat.js] Timestamp: ${Date.now()} - ${widgetsMinJsUrl} SCRIPT TAG LOADED. Defining onReady.`,
        );

        // <<< ADDED DEBUG LOGS >>>
        console.log(
          `[DEBUG click_to_chat.js] Timestamp: ${Date.now()} - Immediately after widgets.min.js script tag loaded. Checking window._genesys...`,
        );
        console.log(
          '[DEBUG click_to_chat.js] window._genesys:',
          window._genesys,
        );
        console.log(
          '[DEBUG click_to_chat.js] typeof window._genesys:',
          typeof window._genesys,
        );
        if (window._genesys && window._genesys.widgets) {
          console.log(
            '[DEBUG click_to_chat.js] Genesys widgets are available:',
            window._genesys.widgets,
          );
        } else {
          console.log(
            '[DEBUG click_to_chat.js] window._genesys or window._genesys.widgets NOT available here.',
          );
        }
        // <<< END ADDED DEBUG LOGS >>>

        // Original console logs about _genesys state (can be redundant now but kept for consistency)
        console.log(
          '[click_to_chat.js] State of window._genesys IMMEDIATELY AFTER widgets.min.js load:',
          typeof window._genesys,
          window._genesys
            ? JSON.parse(JSON.stringify(window._genesys || {}))
            : 'undefined or non-serializable', // Be careful with stringify
        );
        console.log(
          '[click_to_chat.js] State of window._genesys.widgets IMMEDIATELY AFTER widgets.min.js load:',
          typeof window._genesys?.widgets,
          window._genesys?.widgets
            ? JSON.parse(JSON.stringify(window._genesys.widgets || {}))
            : 'undefined or non-serializable',
        );
        console.log(
          '[click_to_chat.js] Is window._genesys.widgets.onReady defined by widgets.min.js itself BEFORE we define it?',
          typeof window._genesys?.widgets?.onReady,
        );
        // debugger; // Optional: pause here to inspect

        console.log(
          `[click_to_chat.js] ${widgetsMinJsUrl} dynamically loaded. Defining onReady callback.`,
        );

        // Define onReady. initLocalWidgetConfiguration and initialise() will be called INSIDE it.
        if (window._genesys && window._genesys.widgets) {
          window._genesys.widgets.onReady = (CXBus) => {
            console.log(
              `[click_to_chat.js] Timestamp: ${Date.now()} - window._genesys.widgets.onReady CALLED by widgets.min.js. CXBus valid: ${!!(CXBus && CXBus.command)}`,
            ); // ADDED
            // ADD THESE LOGS:
            console.log(
              '[click_to_chat.js] PRIMARY onReady CALLED (around line 950). CXBus object received:',
              typeof CXBus,
              CXBus,
            );
            if (CXBus && typeof CXBus.command === 'function') {
              console.log(
                '[click_to_chat.js] PRIMARY onReady: CXBus looks valid and has a command method.',
              );
            } else {
              console.error(
                '[click_to_chat.js] PRIMARY onReady: CXBus is INVALID or missing command method!',
                CXBus,
              );
              // debugger; // Pause if CXBus is bad
            }
            console.log(
              '[click_to_chat.js] PRIMARY onReady: Current window._genesys.widgets.main before initLocalWidgetConfiguration:',
              window._genesys?.widgets?.main
                ? JSON.parse(JSON.stringify(window._genesys.widgets.main || {}))
                : 'undefined or non-serializable',
            );
            console.log(
              '[click_to_chat.js] PRIMARY onReady: Current window._genesys.widgets.webchat before initLocalWidgetConfiguration:',
              window._genesys?.widgets?.webchat
                ? JSON.parse(
                    JSON.stringify(window._genesys.widgets.webchat || {}),
                  )
                : 'undefined or non-serializable',
            );

            console.log(
              '[click_to_chat.js] CXBus ready (via onReady callback). Ordering: 1. initLocalWidgetConfiguration, 2. CXBus App.main, 3. Further CXBus commands/plugins.',
            );

            // 1. Call initLocalWidgetConfiguration()
            console.log(
              `[click_to_chat.js] Timestamp: ${Date.now()} - onReady: BEFORE initLocalWidgetConfiguration()`, // ADDED
            );
            initLocalWidgetConfiguration(); // Configures _genesys.widgets.main and .webchat
            console.log(
              `[click_to_chat.js] Timestamp: ${Date.now()} - onReady: AFTER initLocalWidgetConfiguration()`, // ADDED
            );

            // 2. Initialize Genesys Widgets using CXBus command
            console.log(
              `[click_to_chat.js] Timestamp: ${Date.now()} - onReady: BEFORE CXBus.command(\'App.main\')`, // ADDED
            );
            console.log(
              "[click_to_chat.js] PRIMARY onReady: BEFORE CXBus.command('App.main').",
            );
            try {
              CXBus.command('App.main')
                .done(() => {
                  console.log(
                    `[click_to_chat.js] Timestamp: ${Date.now()} - App.main().done() EXECUTED.`,
                  ); // ADDED
                  console.log(
                    `[click_to_chat.js] App.main().done(): window.genesysLegacyChatOpenRequested is ${window.genesysLegacyChatOpenRequested}`,
                  ); // ADDED
                  console.log(
                    "[click_to_chat.js] PRIMARY onReady: CXBus.command('App.main') SUCCEEDED and its 'done' callback executed.",
                  );
                  // More robust: Set ready and check for pending request *after* App.main fully completes.
                  // Or, subscribe to 'App.ready' if that's more reliable.
                  // For now, setting it here post App.main success.

                  console.log(
                    '[click_to_chat.js] Setting genesysLegacyChatIsReady = true',
                  );
                  window.genesysLegacyChatIsReady = true;
                  document.dispatchEvent(
                    new CustomEvent('genesys:appMainReady'),
                  ); // Custom event

                  if (window.genesysLegacyChatOpenRequested) {
                    console.log(
                      '[click_to_chat.js] genesysLegacyChatOpenRequested was true. Commanding WebChat.open now.',
                    );
                    if (CXBus && typeof CXBus.command === 'function') {
                      CXBus.command('WebChat.open');
                      window.genesysLegacyChatOpenRequested = false; // Reset flag
                    } else {
                      console.error(
                        '[click_to_chat.js] CXBus not available to open chat for pending request.',
                      );
                    }
                  } else {
                    console.log(
                      '[click_to_chat.js] No pending chat open request (genesysLegacyChatOpenRequested is false).',
                    );
                  }
                })
                .fail((appMainErr) => {
                  console.error(
                    `[click_to_chat.js] Timestamp: ${Date.now()} - App.main().fail() EXECUTED. Error:`,
                    appMainErr,
                  ); // ADDED
                  console.error(
                    "[click_to_chat.js] PRIMARY onReady: CXBus.command('App.main') FAILED in its 'fail' callback:",
                    appMainErr,
                  );
                  document.dispatchEvent(
                    new CustomEvent('genesys:error', {
                      detail: {
                        message:
                          "Error from CXBus.command('App.main') 'fail' callback in onReady",
                        error: appMainErr,
                      },
                    }),
                  );
                });
              // Original success log, keeping for now, but 'done' callback above is more precise
              // console.log(
              //   "[click_to_chat.js] PRIMARY onReady: CXBus.command('App.main') SUCCEEDED (command issued).",
              // );
            } catch (cxCommandError) {
              console.error(
                "[click_to_chat.js] PRIMARY onReady: CXBus.command('App.main') FAILED:",
                cxCommandError,
              );
              // debugger; // Pause on error
              document.dispatchEvent(
                new CustomEvent('genesys:error', {
                  detail: {
                    message:
                      "Error calling CXBus.command('App.main') in onReady",
                    error: cxCommandError,
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
              console.log('[click_to_chat.js] WebChat opened event');
              try {
                if (cfg.numberOfPlans > 1 && cfg.currentPlanName) {
                  const titlebar = $('.cx-widget.cx-webchat .cx-titlebar');
                  if (titlebar.length && !titlebar.data('plan-info-added')) {
                    const originalTitle = titlebar.text().trim() || 'Chat'; // Default if empty
                    titlebar.html(
                      // Sanitize output if currentPlanName or originalTitle can contain HTML
                      `<span>${$('<div>').text(cfg.currentPlanName).html()}</span> - <span>${$('<div>').text(originalTitle).html()}</span>`,
                    );
                    titlebar.data('plan-info-added', true); // Mark as added
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
                if (rawChatHrs) {
                  // Only proceed if rawChatHrs is available
                  const now = parseFloat(
                    new Date()
                      .toLocaleTimeString('en-US', {
                        hour12: false,
                        timeZone: 'America/New_York', // Ensure this is the correct timezone
                      })
                      .replace(':', '.')
                      .slice(0, 5), // HH.MM format
                  );

                  const hoursParts = rawChatHrs.split('_'); // e.g., "08.00_17.00"
                  if (hoursParts.length === 2) {
                    // let start = parseFloat(hoursParts[0]); // Not used in this logic block
                    let end = parseFloat(hoursParts[1]);

                    // Assuming end times like "5.00" PM are "17.00" in 24hr format.
                    // If rawChatHrs provides AM/PM or needs complex parsing, this needs adjustment.
                    // This logic assumes 24-hour format in rawChatHrs (e.g., 17.00 for 5 PM)
                    // The original code had `if (end < 12) end += 12;` which might be an attempt to convert 12hr PM to 24hr.
                    // For safety, ensure times are consistently 24hr format in rawChatHrs.

                    if (
                      cfg.isChatAvailable === 'true' &&
                      now > end /* || now < start if checking start time too */
                    ) {
                      console.log(
                        '[Genesys] After hours detected based on rawChatHrs, showing self-service options',
                      );

                      const links = selfServiceLinks || [];
                      const formTable = $('.cx-form table'); // Genesys form table
                      if (formTable.length) {
                        links.forEach((e) => {
                          if (e.value && e.value.startsWith('http')) {
                            formTable.append(
                              // Sanitize link text and ensure valid URL
                              `<tr><td colspan='2'><a class='btn btn-secondary' href='${encodeURI(e.value)}' target='_blank' rel='noopener noreferrer'>${$('<div>').text(e.key).html()}</a></td></tr>`,
                            );
                          }
                        });
                        $('.activeChat').hide(); // Hide default chat form elements
                        $('button[data-message="ChatFormSubmit"]').hide(); // Hide submit
                      }
                    }
                  } else {
                    console.warn(
                      '[Genesys] rawChatHrs format is unexpected:',
                      rawChatHrs,
                    );
                  }
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

            // Message added handler (agent or bot message)
            plugin.subscribe('WebChat.messageAdded', (eventData) => {
              // Check if the message is from the agent/bot (not the user)
              if (
                eventData &&
                eventData.data &&
                eventData.data.message &&
                eventData.data.message.from.type === 'Agent'
              ) {
                console.log(
                  '[click_to_chat.js] New message received from agent/bot',
                );
                try {
                  if (webAlert) {
                    webAlert.muted = false;
                    webAlert
                      .play()
                      .catch((e) =>
                        console.warn(
                          '[Genesys] Audio play error (non-critical):',
                          e,
                        ),
                      );
                  }

                  if (document.visibilityState !== 'visible') {
                    console.log(
                      '[Genesys] Document not visible, dispatching notification event for agent message',
                    );
                    try {
                      document.dispatchEvent(
                        new CustomEvent('genesys:message:received', {
                          detail: {
                            message:
                              eventData.data.message.text || 'New message',
                          },
                        }),
                      );
                    } catch (e) {
                      console.error(
                        '[Genesys] Error dispatching message:received event:',
                        e,
                      );
                    }
                  }
                } catch (err) {
                  console.error(
                    '[Genesys] Error in messageAdded handler:',
                    err,
                  );
                }
              }
            });

            // WebChat.error handler
            plugin.subscribe('WebChat.error', (errorEvent) => {
              console.error(
                '[click_to_chat.js] WebChat.error event:',
                errorEvent,
              );
              const errorMessage =
                'There was an issue with your chat session. Please verify your connection and try again, or contact us via phone.';
              try {
                // Attempt to display error within the chat widget if it exists
                const chatWidget = $('.cx-widget.cx-webchat');
                if (
                  chatWidget.length &&
                  !chatWidget.find('.chat-error-message').length
                ) {
                  chatWidget.append(`
                      <div class="chat-error-message" style="padding:15px;background:#f8d7da;color:#721c24;margin:10px;border-radius:4px;text-align:center;">
                        <p>${$('<div>').text(errorMessage).html()}</p>
                        <button id="chat-error-ok" style="background:#dc3545;color:white;border:none;padding:5px 15px;border-radius:4px;cursor:pointer;margin-top:5px;">OK</button>
                      </div>
                    `);
                  $('#chat-error-ok').on('click', function () {
                    $(this).closest('.chat-error-message').remove();
                    // Optionally, try to reopen or reset the chat form
                    // if (window._genesysCXBus) {
                    //   window._genesysCXBus.command('WebChat.open');
                    // }
                  });
                } else if (!chatWidget.length) {
                  // Fallback if widget not rendered
                  alert(errorMessage);
                }
              } catch (err) {
                console.error(
                  '[Genesys] Error displaying chat error message UI:',
                  err,
                );
              }
              try {
                document.dispatchEvent(
                  new CustomEvent('genesys:webchat:error', {
                    detail: {
                      error: errorEvent, // Pass the original error object
                      message: errorMessage,
                    },
                  }),
                );
              } catch (e) {
                console.error(
                  '[Genesys] Error dispatching webchat:error custom event:',
                  e,
                );
              }
            });

            plugin.subscribe('WebChat.failedToStart', (event) => {
              console.error('[Genesys] WebChat.failedToStart event:', event);
              const errorMessage =
                "We couldn't start your chat session. Please check your internet connection and try again. If the problem persists, please call us.";
              try {
                alert(errorMessage); // Simple alert for critical failure
                document.dispatchEvent(
                  new CustomEvent('genesys:webchat:failedToStart', {
                    detail: { message: errorMessage, originalEvent: event },
                  }),
                );
              } catch (e) {
                console.error('[Genesys] Error handling failedToStart:', e);
              }
            });

            plugin.subscribe('WebChat.submitted', (data) => {
              console.log(
                '[Genesys] Chat form submitted (WebChat.submitted event)',
                data,
              );
              try {
                document.dispatchEvent(
                  new CustomEvent('genesys:webchat:submitted', {
                    detail: { formData: data }, // data usually contains the form submission
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
            if (cfg.isChatAvailable) {
              // Only show button if chat is configured as available
              // ADD THESE LOGS:
              console.log(
                `[click_to_chat.js] Timestamp: ${Date.now()} - onReady: BEFORE CXBus.command(\'WebChat.showChatButton\')`,
              ); // ADDED
              console.log(
                "[click_to_chat.js] PRIMARY onReady: BEFORE CXBus.command('WebChat.showChatButton').",
              );
              try {
                CXBus.command('WebChat.showChatButton');
                // Dispatch general ready *after* button is shown and App.main is likely done.
                // The genesys:appMainReady event above is more specific to App.main completion.
                console.log(
                  `[click_to_chat.js] Timestamp: ${Date.now()} - onReady: About to dispatch \'genesys:ready\' event.`,
                ); // ADDED
                document.dispatchEvent(new CustomEvent('genesys:ready'));
                console.log(
                  '[click_to_chat.js] PRIMARY onReady: WebChat.showChatButton SUCCEEDED.',
                );
              } catch (e) {
                console.error(
                  '[click_to_chat.js] PRIMARY onReady: Error showing chat button via CXBus:',
                  e,
                );
                // debugger; // Pause on error
              }
            } else {
              console.log(
                '[click_to_chat.js] onReady: Chat is not available (cfg.isChatAvailable is false), not showing chat button.',
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
        // Optionally display an error message to the user directly here.
      });

    // === CoBrowse Helper Functions (exposed to window) ===
    window.startCoBrowseCall = () => {
      console.log('[Genesys] Starting CoBrowse call flow');
      // Ensure jQuery and Bootstrap's modal are loaded if using $().modal
      if (typeof $ !== 'undefined' && $.fn.modal) {
        $('#cobrowse-sessionConfirm').modal({
          backdrop: 'static',
          keyboard: false,
        });
      } else {
        console.warn(
          '[Genesys] jQuery or Bootstrap modal not available for startCoBrowseCall.',
        );
        // Fallback: show a simpler confirm or direct to modal if $().modal is not present
        const modal = document.getElementById('cobrowse-sessionConfirm');
        if (modal) modal.style.display = 'block';
      }
    };

    window.openWebChatWidget = () => {
      console.log('[Genesys] Opening WebChat widget via command');
      if (window._genesysCXBus) {
        window._genesysCXBus.command('WebChat.open');
        // Hide CoBrowse modals if chat is opened this way
        $('#cobrowse-contactUsScreen1').modal('hide');
        $('#cobrowse-contactUsScreen2').modal('hide');
      } else {
        console.warn('[Genesys] CXBus not available to open WebChat widget.');
      }
    };

    // This function seems to be for a different Genesys widget (CallUs), ensure it's needed.
    window.openCallUsWidget = () => {
      console.log(
        '[Genesys] Opening CallUs widget command (if CallUs widget is loaded)',
      );
      if (window._genesysCXBus) {
        // Ensure the CallUs widget is part of the 'preload' array in main config if used.
        window._genesysCXBus.command('CallUs.open');
      } else {
        console.warn('[Genesys] CXBus not available to open CallUs widget.');
      }
    };

    window.showCobrowseModal = () => {
      console.log('[Genesys] Showing CoBrowse session ID modal');
      $('#cobrowse-sessionConfirm').modal('hide');

      if (typeof window.startCobrowse === 'function') {
        window.startCobrowse(); // This initiates the CobrowseIO session code generation
      } else {
        console.error(
          '[Genesys] Cobrowse start function (window.startCobrowse) not defined',
        );
      }
      // Show the modal that displays the session ID
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };

    // Defines the function that starts the CoBrowse.IO session code generation
    window.defineCobrowseStarter = function () {
      window.startCobrowse = function () {
        console.log(
          '[Genesys] CoBrowseIO.client().createSessionCode() requested by user action',
        );

        if (
          window.CobrowseIO &&
          typeof window.CobrowseIO.client === 'function'
        ) {
          CobrowseIO.client()
            .then(
              (
                c, // c is the CobrowseIO client instance
              ) =>
                c
                  .createSessionCode()
                  .then((code) => {
                    // code is the session code object, e.g., { value: "123-456" }
                    const sessionTokenEl = document.getElementById(
                      'cobrowse-sessionToken',
                    );
                    if (sessionTokenEl) {
                      // Assuming code.value is "123456", format it as "123-456"
                      let formattedCode = String(code.value || code); // code might be string or obj
                      if (
                        formattedCode.length === 6 &&
                        /^\d+$/.test(formattedCode)
                      ) {
                        formattedCode = formattedCode
                          .match(/.{1,3}/g)
                          .join('-');
                      }
                      sessionTokenEl.textContent = formattedCode;
                    } else {
                      console.error(
                        '[Genesys] cobrowse-sessionToken element not found.',
                      );
                    }
                  })
                  .catch((err) =>
                    console.error(
                      '[Genesys] Error creating CoBrowse session code:',
                      err,
                    ),
                  ),
            )
            .catch((clientErr) =>
              console.error(
                '[Genesys] Error getting CobrowseIO client:',
                clientErr,
              ),
            );
        } else {
          console.error(
            '[Genesys] CobrowseIO.client is not available or not a function.',
          );
        }
      };
    };
    defineCobrowseStarter(); // Define window.startCobrowse immediately

    window.showCobrowseContactUsModal = () => {
      console.log('[Genesys] Showing CoBrowse Contact Us options modal');
      $('#cobrowse-sessionConfirm').modal('hide');
      $('#cobrowse-contactUsScreen1').modal({ backdrop: 'static' });
    };

    window.cobrowseContactUsOption = () => {
      // Typically called when "PHONE" is chosen
      console.log('[Genesys] CoBrowse Contact Us - Phone option selected');
      $('#cobrowse-contactUsScreen1').modal('hide');
      $('#cobrowse-contactUsScreen2').modal('show'); // Shows phone details
    };

    window.cobrowseClosePopup = () => {
      console.log('[Genesys] Closing CoBrowse Contact Us phone details popup');
      $('#cobrowse-contactUsScreen2').modal('hide');
    };

    window.cobrowseSessionModal = () => {
      // "Share your screen" link from phone details
      console.log('[Genesys] Initiating CoBrowse from phone details modal');
      $('#cobrowse-contactUsScreen2').modal('hide');
      if (typeof window.startCobrowse === 'function') {
        window.startCobrowse(); // Generate session code
      } else {
        console.error(
          '[Genesys] Cobrowse start function not defined for cobrowseSessionModal.',
        );
      }
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' }); // Show session ID modal
    };

    window.endCoBrowseCall = () => {
      console.log('[Genesys] Attempting to end CoBrowse session');
      if (window.CobrowseIO && typeof CobrowseIO.client === 'function') {
        CobrowseIO.client()
          .then((c) => (c.endSession ? c.endSession() : c.exitSession())) // endSession or exitSession depending on SDK version
          .then(() => {
            console.log('[Genesys] CoBrowse session ended successfully.');
            $('#cobrowse-sessionYesModal').modal('hide'); // Hide the session ID modal
          })
          .catch((err) =>
            console.error('[Genesys] Error ending CoBrowse call/session:', err),
          );
      } else {
        console.warn(
          '[Genesys] CobrowseIO client not available to end session.',
        );
        $('#cobrowse-sessionYesModal').modal('hide'); // Still hide modal
      }
    };

    // === Fallback Button Creation & Widget Initialization Functions ===
    window.forceCreateChatButton = function () {
      if (window._genesysButtonCreationInProgress) {
        console.log(
          '[Genesys] Button creation already in progress, skipping duplicate call to forceCreateChatButton',
        );
        return false; // Indicate not run or already exists
      }
      window._genesysButtonCreationInProgress = true;

      const existingButton = document.querySelector(
        '.cx-widget.cx-webchat-chat-button',
      );
      if (existingButton && existingButton.offsetParent !== null) {
        // Check if visible
        console.log(
          '[Genesys] Chat button already exists and is likely visible, not forcing creation.',
        );
        window._genesysButtonCreationInProgress = false;
        return true; // Indicate button exists
      }

      console.log('[Genesys] Forcing chat button initialization/visibility');
      // This function is primarily a fallback. The main path is via CXBus.command in onReady.
      // It might be called by the safety timeout.

      if (cfg.chatMode === 'legacy' || cfg.chatMode === 'cloud') {
        // Unified approach for modern widgets
        console.log(
          `[Genesys] Using CXBus.command('WebChat.showChatButton') for ${cfg.chatMode} mode.`,
        );
        if (
          window._genesysCXBus &&
          typeof window._genesysCXBus.command === 'function'
        ) {
          try {
            // Prevent rapid successive calls if this gets spammed
            const now = Date.now();
            if (
              !window._genesysLastCXBusCommandTime ||
              now - window._genesysLastCXBusCommandTime > 1000 // Throttle: 1 sec
            ) {
              window._genesysLastCXBusCommandTime = now;
              window._genesysCXBus.command('WebChat.showChatButton', {
                immediate: true,
              });
              console.log(
                '[Genesys] CXBus WebChat.showChatButton commanded via forceCreate.',
              );
            } else {
              console.log(
                '[Genesys] CXBus WebChat.showChatButton throttled in forceCreate.',
              );
            }
          } catch (e) {
            console.error(
              '[Genesys] Error calling CXBus.command in forceCreateChatButton:',
              e,
            );
          }
        } else {
          console.warn(
            '[Genesys] CXBus not available for forceCreateChatButton. Button may not appear.',
          );
          // At this point, widgets.min.js or its initialization might have failed.
          // Consider dispatching an error or showing a manual message.
        }
      }
      // Ensure the variable is reset after execution.
      setTimeout(() => {
        window._genesysButtonCreationInProgress = false;
      }, 500);
      return true; // Indicate attempt was made
    };
    window._forceChatButtonCreate = window.forceCreateChatButton; // Expose globally for safety timeout

    console.log(
      '[click_to_chat.js] End of initializeChatWidget main logic. Initialization is now event-driven by widgets.min.js load.',
    );
  } // End of initializeChatWidget

  // Expose key functions to window for external access (if needed by other scripts or manual calls)
  // window.GenesysChat = { // Example of exposing an API
  //   open: window.openWebChatWidget,
  //   startCobrowse: window.startCoBrowseCall,
  //   cfg: cfg // Exposing validated config (be cautious with sensitive data)
  // };

  // Log initialization complete (of this script file)
  console.log(
    '[Genesys] click_to_chat.js script execution complete. Widget initialization is asynchronous.',
  );
  console.log(
    `[click_to_chat.js] Timestamp: ${Date.now()} - END OF SCRIPT FILE EXECUTION.`,
  );

  window.handleChatSettingsUpdate = function (newSettings) {
    // ADD/MODIFY LOGS:
    console.log(
      '[click_to_chat.js] handleChatSettingsUpdate CALLED. New settings:',
      newSettings ? JSON.parse(JSON.stringify(newSettings || {})) : {},
    );

    // 1. Optionally try to clean up/destroy existing widget
    if (
      window._genesysCXBus &&
      typeof window._genesysCXBus.command === 'function'
    ) {
      try {
        console.log(
          '[click_to_chat.js] Attempting to close and hide chat button via CXBus.',
        );
        window._genesysCXBus.command('WebChat.close');
        window._genesysCXBus.command('WebChat.hideChatButton');
        // If a more thorough destruction is needed and available:
        // window._genesysCXBus.command('WebChat.destroy');
      } catch (e) {
        console.warn(
          '[click_to_chat.js] Error during CXBus cleanup in handleChatSettingsUpdate:',
          e,
        );
      }
    }

    // If main.shutdown exists (good for a more complete reset)
    if (
      window._genesys &&
      window._genesys.widgets &&
      window._genesys.widgets.main &&
      typeof window._genesys.widgets.main.shutdown === 'function'
    ) {
      try {
        console.log(
          '[click_to_chat.js] Calling _genesys.widgets.main.shutdown().',
        );
        window._genesys.widgets.main.shutdown();
        // After shutdown, CXBus might be invalid or widgets object might be reset.
        // Clear related globals to allow re-initialization by widgets.min.js
        window._genesysCXBus = undefined;
        window._genesysCXBusReady = false;
        if (window._genesys.widgets) {
          window._genesys.widgets.onReady = undefined; // Allow onReady to be redefined by new widgets.min.js instance if it reloads
        }
      } catch (e) {
        console.warn(
          '[click_to_chat.js] Error during _genesys.widgets.main.shutdown():',
          e,
        );
      }
    }

    // 2. Re-validate and update the internal cfg for this call
    // We need to update the top-level `cfg` or ensure initializeChatWidget uses the new one.
    // For simplicity, as `initializeChatWidget` is self-contained with its jQuery and cfg parameters,
    // we can just pass a new cfg to it.
    const newValidatedCfg = validateConfig(newSettings || {});
    console.log(
      '[click_to_chat.js] New validated config for re-initialization:',
      JSON.parse(JSON.stringify(newValidatedCfg || {})),
    );

    // 3. Re-run initialization logic.
    // The `initializeChatWidget` function itself contains the logic to load widgets.min.js via `loadResource.script`
    // if it sets up `window._genesys.widgets.onReady` and then calls `main.initialise()`.
    // The original script structure has `loadJQuery().then(($) => initializeChatWidget($, cfg))` at the top level.
    // `initializeChatWidget` then proceeds to load `widgets.min.js` and sets `onReady`.
    // For re-initialization, we need to replicate this process.

    // Crucially, widgets.min.js might guard against multiple loads or its onReady might only fire once.
    // A robust way is to ensure widgets.min.js can be reloaded or its initialization re-triggered.
    // Forcing a re-run of initializeChatWidget with new config:
    if (window.jQuery) {
      console.log(
        '[click_to_chat.js] Re-initializing chat widget logic with new config.',
      );
      // Ensure widgets.min.js is reloaded or its initialization path is re-triggered
      // This might involve removing the old script tag for widgets.min.js if it exists
      const oldWidgetsScript = document.getElementById(
        'genesys-widgets-min-script-dynamic',
      );
      if (oldWidgetsScript) {
        console.log(
          '[click_to_chat.js] handleChatSettingsUpdate: Removing old widgets.min.js script tag.',
          oldWidgetsScript,
        );
        oldWidgetsScript.remove();
      } else {
        console.log(
          '[click_to_chat.js] handleChatSettingsUpdate: No old widgets.min.js script tag found to remove.',
        );
      }
      // Reset flags that widgets.min.js might use to prevent re-initialization
      if (window._genesys && window._genesys.widgets) {
        window._genesys.widgets.loaded = false; // Example flag, actual flags depend on widgets.min.js internals
        window._genesys.widgets.initialized = false; // Example
      }
      initializeChatWidget(window.jQuery, newValidatedCfg); // This will again try to load widgets.min.js and set up onReady
    } else {
      console.error(
        '[click_to_chat.js] jQuery not found for re-initialization. Attempting to load jQuery first.',
      );
      loadJQuery()
        .then(($) => {
          const oldWidgetsScript = document.getElementById(
            'genesys-widgets-min-script-dynamic',
          );
          if (oldWidgetsScript) oldWidgetsScript.remove();
          if (window._genesys && window._genesys.widgets) {
            window._genesys.widgets.loaded = false;
            window._genesys.widgets.initialized = false;
          }
          initializeChatWidget($, newValidatedCfg);
        })
        .catch((err) =>
          console.error(
            '[click_to_chat.js] Failed to re-initialize after jQuery load attempt:',
            err,
          ),
        );
    }
  };

  // Now that widgets.min.js is loaded, let's check its state.
  // ADD THESE LOGS:
  console.log('[click_to_chat.js] FINAL CHECK SECTION (around line 1700)');
  if (typeof window._genesys === 'undefined') {
    console.error(
      '[click_to_chat.js] FINAL CHECK: window._genesys is UNDEFINED. This is after the loadResource promise for widgets.min.js should have resolved or rejected.',
    );
    // debugger; // Good place to stop if _genesys is missing
    // Optionally, try to bail out or trigger a more robust error display
    // hideLoadingIndicator(); // REMOVED
    // ensureChatButtonVisibility(); // REMOVED
    // Consider dispatching a custom error event that the main app can listen to
    // document.dispatchEvent(new CustomEvent('genesys:error', { detail: { message: 'window._genesys not defined by widgets.min.js' } }));
    return; // Halt further processing in this script if _genesys isn't there.
  } else {
    console.log(
      '[click_to_chat.js] FINAL CHECK: window._genesys object (raw):',
      window._genesys, // Log raw object first
    );
    try {
      console.log(
        '[click_to_chat.js] FINAL CHECK: _genesys object (JSON.stringified):',
        JSON.stringify(window._genesys || {}), // Attempt to stringify, but guard it
      );
    } catch (e) {
      console.warn(
        '[click_to_chat.js] FINAL CHECK: Could not JSON.stringify(window._genesys):',
        e,
        'Raw object was:',
        window._genesys,
      );
    }
  }

  // Check if the onReady function is available
  if (!window._genesys || typeof window._genesys.widgets === 'undefined') {
    console.error(
      '[click_to_chat.js] FINAL CHECK FATAL: window._genesys.widgets is UNDEFINED. Cannot access onReady. Halting chat initialization.',
      'window._genesys current state:',
      window._genesys, // Log current state
    );
    // debugger;
    // hideLoadingIndicator(); // REMOVED
    // ensureChatButtonVisibility(); // REMOVED
    return;
  }

  // ADD THESE LOGS:
  console.log(
    '[click_to_chat.js] FINAL CHECK: typeof window._genesys.widgets.onReady:',
    typeof window._genesys.widgets.onReady,
  );
  // if (typeof window._genesys.widgets.onReady !== 'function') { // Original check
  //   console.error(
  //     '[click_to_chat.js] FINAL CHECK: window._genesys.widgets.onReady is not a function here. This might be okay if it was just defined and not yet called by an event.',
  //   );
  // }

  // Original onReady callback is preserved and called, but we also add our specific logic
  // The CXBus object is passed to the onReady callback.
  // CONSIDER COMMENTING OUT THIS ENTIRE BLOCK (lines ~1749-1782) AS IT LIKELY CONFLICTS
  // WITH THE PRIMARY onReady DEFINED AROUND LINE 948
  /*
  window._genesys.widgets.onReady = (CXBus) => {
    // ADD THESE LOGS:
    console.warn(
      '[click_to_chat.js] SUSPICIOUS SECONDARY onReady CALLED (around line 1749). CXBus object:',
      typeof CXBus, CXBus
    );
    // debugger; // Pause here to see when/if this is called
    console.log('[click_to_chat.js] CXBus ready. CXBus object:', CXBus);
    if (
      window._genesys &&
// ... existing code ...
  //   console.error('[click_to_chat.js] CXBus.command or window.chatSettings.genesysConfig is not available for fallback initialization.');
  // }
  // }

  // // Safety timeout remains important
  // setTimeout(() => {
  // // ... existing code ...
  // }, 10000);
  // };
  */
})(window, document);
