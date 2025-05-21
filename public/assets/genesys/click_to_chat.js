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

    // Ported from JSPF: Chat Disclaimer, Error Overlay Functions, and Avatar
    // These may use calculatedCiciId and clientIdConst which are defined later in this function's scope.
    // The functions themselves are defined here at the top of initializeChatWidget for clarity.

    function setChatDisclaimerMesg(ciciId, consts) {
      // calculatedCiciId and clientIdConst will be in scope when called
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

    function OpenChatDisclaimer() {
      if (window._genesysCXBus) {
        // _genesysCXBus is set in onReady
        const disclaimerMesg = setChatDisclaimerMesg(
          calculatedCiciId,
          clientIdConst,
        ); // Ensure calculatedCiciId & clientIdConst are in scope when called
        window._genesysCXBus
          .command('WebChat.showOverlay', {
            html: $(
              "<div id='disclaimerId'><p class='termsNConditions'><span class='modalTitle'>Terms and Conditions</span> <br><br> " +
                disclaimerMesg +
                " </p> </div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatDisclaimer();'>CLOSE</button></div>",
            ),
            hideFooter: true,
          })
          .done(function (e) {
            $("button[data-message='ChatFormSubmit']").hide();
            console.log('[Genesys] OpenChatDisclaimer overlay shown.');
          })
          .fail(function (e) {
            console.error('[Genesys] OpenChatDisclaimer failed:', e);
          });
      } else {
        console.error('[Genesys] CXBus not available for OpenChatDisclaimer.');
      }
    }
    window.OpenChatDisclaimer = OpenChatDisclaimer;

    function CloseChatDisclaimer() {
      if (window._genesysCXBus) {
        window._genesysCXBus
          .command('WebChat.hideOverlay')
          .done(function (e) {
            $("button[data-message='ChatFormSubmit']").show();
            console.log('[Genesys] CloseChatDisclaimer overlay hidden.');
          })
          .fail(function (e) {
            console.error('[Genesys] CloseChatDisclaimer failed:', e);
          });
      } else {
        console.error('[Genesys] CXBus not available for CloseChatDisclaimer.');
      }
    }
    window.CloseChatDisclaimer = CloseChatDisclaimer;

    function OpenChatConnectionErrorOverlay() {
      if (window._genesysCXBus) {
        window._genesysCXBus
          .command('WebChat.showOverlay', {
            html: $(
              "<div><p class='termsNConditions'><span class='modalTitle'>Error Connecting to Chat Server</span><br><br>We're sorry for the inconvenience, please logout and log back in.</p></div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatConnectionErrorOverlay();'>CLOSE</button></div>",
            ),
            hideFooter: false,
          })
          .done(function (e) {
            console.log('[Genesys] OpenChatConnectionErrorOverlay shown.');
          })
          .fail(function (e) {
            console.error(
              '[Genesys] OpenChatConnectionErrorOverlay failed:',
              e,
            );
          });
      } else {
        console.error(
          '[Genesys] CXBus not available for OpenChatConnectionErrorOverlay.',
        );
      }
    }
    window.OpenChatConnectionErrorOverlay = OpenChatConnectionErrorOverlay;

    function CloseChatConnectionErrorOverlay() {
      if (window._genesysCXBus) {
        window._genesysCXBus
          .command('WebChat.hideOverlay')
          .done(function (e) {
            console.log('[Genesys] CloseChatConnectionErrorOverlay hidden.');
          })
          .fail(function (e) {
            console.error(
              '[Genesys] CloseChatConnectionErrorOverlay failed:',
              e,
            );
          });
      } else {
        console.error(
          '[Genesys] CXBus not available for CloseChatConnectionErrorOverlay.',
        );
      }
    }
    window.CloseChatConnectionErrorOverlay = CloseChatConnectionErrorOverlay;

    function closeChatWindow() {
      if (window._genesysCXBus) {
        console.log('[GA4] - Chat Interaction - End Chat'); // Placeholder for actual GA call
        // window.elementTag($(this).text(), "Chat", {action: "click", selection_type: "widget" }, "select_content", null);

        window._genesysCXBus
          .command('WebChat.close')
          .done(function (e) {
            console.log(
              '[Genesys] WebChat closed successfully via closeChatWindow.',
            );
          })
          .fail(function (e) {
            console.warn(
              '[Genesys] WebChat.close command failed or no active session (called by closeChatWindow).',
              e,
            );
          });
      } else {
        console.error('[Genesys] CXBus not available for closeChatWindow.');
      }
    }
    window.closeChatWindow = closeChatWindow;

    const chatBotAvatar = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
        <title>BCBST-chatbot-avatar-20210112</title>
        <g id="BCBST-chatbot-avatar-20210112" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Group">
                <g id="Group-33">
                    <path d="M15.9932914,31.9865828 C24.8261578,31.9865828 31.9865828,24.8261578 31.9865828,15.9932914 C31.9865828,7.16042504 24.8261578,0 15.9932914,0 C7.16042504,0 0,7.16042504 0,15.9932914 C0,24.8261578 7.16042504,31.9865828 15.9932914,31.9865828" id="Fill-1" fill="#00A6E0"></path>
                    <path d="M22.4895836,6.61774981 L9.95449874,6.61774981 C7.58772009,6.61774981 5.66898207,8.53648783 5.66898207,10.903495 L5.66898207,18.5133315 C5.66898207,22.6231504 8.74517744,22.7988482 8.74517744,22.7988482 L8.74517744,26.1286514 C8.74517744,26.8675415 9.61384163,27.2644036 10.1724645,26.7804923 L14.7703073,22.7988482 L22.4895836,22.7988482 C24.8561338,22.7988482 26.7746433,20.8801101 26.7746433,18.5133315 L26.7746433,10.903495 C26.7746433,8.53648783 24.8561338,6.61774981 22.4895836,6.61774981" id="Fill-3" fill="#FFFFFF"></path>
                </g>
                <g id="BCBST_logo_stacked_BlueBlack_CMYK_2019_rrChecked" transform="translate(7.681342, 11.069182)">
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
                    </g>
                </g>
            </g>
        </g>
    </svg>
    `;

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

    // Ported from JSPF: clientID() function to determine calculatedCiciId
    function getCalculatedCiciId(currentCfg) {
      // Ensure these are correctly populated in currentCfg from window.chatSettings
      // and that validateConfig handles string booleans appropriately
      if (String(currentCfg.isBlueEliteGroup) === 'true') return 'INDVMX'; // JSPF check was '${isBlueEliteGroup}' == 'true'
      if (currentCfg.groupType === 'INDV') return 'INDV'; // JSPF check was groupType === 'INDV'
      return currentCfg.memberClientID || 'Default'; // Fallback to Default
    }
    const calculatedCiciId = getCalculatedCiciId(cfg); // Call it with the cfg object

    // Ported from JSPF: setOptions function
    function setOptions(optionsVariable) {
      // Uses `calculatedCiciId` from the outer scope (now derived using cfg)
      // Uses `clientIdConst` from the outer scope (already defined in this file)
      // Access other JSPF globals via `cfg`
      var options =
        calculatedCiciId === clientIdConst.SeniorCare
          ? []
          : [
              {
                disabled: 'disabled',
                selected: 'selected',
                text: 'Select one',
              },
            ];

      switch (optionsVariable) {
        case clientIdConst.BlueCare:
          options.push({ text: 'Eligibility', value: 'Eligibility' });
          options.push({ text: 'TennCare PCP', value: 'TennCare PCP' });
          options.push({ text: 'Benefits', value: 'Benefits' });
          options.push({ text: 'Transportation', value: 'Transportation' });
          // Assuming routingchatbotEligible in cfg is equivalent to chatbotEligible in JSPF
          // Assuming validateConfig converts these to booleans
          if (cfg.isIDCardEligible && cfg.routingchatbotEligible)
            options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
          break;
        case clientIdConst.BlueCarePlus:
        case clientIdConst.CoverTN:
        case clientIdConst.CoverKids:
          options.push({ text: 'Eligibility', value: 'Eligibility' });
          options.push({ text: 'Benefits', value: 'Benefits' });
          options.push({ text: 'Claims Financial', value: 'Claims Financial' });
          if (cfg.isIDCardEligible && cfg.routingchatbotEligible)
            options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
          options.push({
            text: 'Member Update Information',
            value: 'Member Update Information',
          });
          options.push({ text: 'Pharmacy', value: 'Pharmacy' });
          break;
        case clientIdConst.SeniorCare:
          // No options added for SeniorCare initially in JSPF logic
          break;
        case 'dentalOnly':
          options.push({
            text: 'Benefits and Coverage',
            value: 'Benefits and Coverage',
          });
          options.push({
            text: 'New or Existing Claims',
            value: 'New Or Existing Claims',
          });
          if (cfg.groupType === 'INDV')
            // Use cfg
            options.push({ text: 'Premium Billing', value: 'Premium Billing' });
          options.push({ text: 'Deductibles', value: 'Deductibles' });
          options.push({ text: 'Find Care', value: 'Find Care' });
          if (cfg.isCobraEligible)
            // Use cfg
            options.push({ text: 'COBRA', value: 'COBRA' });
          if (cfg.isIDCardEligible && cfg.routingchatbotEligible)
            options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
          options.push({ text: 'Other', value: 'Other' });
          break;
        case clientIdConst.Individual:
          options.push({
            text: 'Benefits and Coverage',
            value: 'Benefits and Coverage',
          });
          options.push({
            text: 'New or Existing Claims',
            value: 'New Or Existing Claims',
          });
          options.push({ text: 'Premium Billing', value: 'Premium Billing' });
          options.push({ text: 'Deductibles', value: 'Deductibles' });
          options.push({
            text: 'Pharmacy and Prescriptions',
            value: 'Pharmacy And Prescriptions',
          });
          options.push({ text: 'Find Care', value: 'Find Care' });
          if (cfg.isDental)
            // Use cfg
            options.push({ text: 'Dental', value: 'Dental' });
          if (cfg.isIDCardEligible && cfg.routingchatbotEligible)
            options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
          options.push({ text: 'Other', value: 'Other' });
          break;
        case clientIdConst.BlueElite:
          options.push({ text: 'Address Update', value: 'Address Update' });
          options.push({ text: 'Bank Draft', value: 'Bank Draft' });
          options.push({ text: 'Premium Billing', value: 'Premium Billing' });
          options.push({
            text: 'Report Date of Death',
            value: 'Report Date of Death',
          });
          if (cfg.isDental)
            // Use cfg
            options.push({ text: 'Dental', value: 'Dental' });
          if (cfg.isIDCardEligible && cfg.routingchatbotEligible)
            options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
          options.push({ text: 'All Other', value: 'All Other' });
          break;
        default:
          options.push({
            text: 'Benefits and Coverage',
            value: 'Benefits and Coverage',
          });
          options.push({
            text: 'New or Existing Claims',
            value: 'New Or Existing Claims',
          });
          options.push({ text: 'Deductibles', value: 'Deductibles' });
          options.push({
            text: 'Pharmacy and Prescriptions',
            value: 'Pharmacy And Prescriptions',
          });
          options.push({ text: 'Find Care', value: 'Find Care' });
          if (cfg.isDental)
            // Use cfg
            options.push({ text: 'Dental', value: 'Dental' });
          if (cfg.isCobraEligible)
            // Use cfg
            options.push({ text: 'COBRA', value: 'COBRA' });
          if (cfg.isIDCardEligible && cfg.routingchatbotEligible)
            options.push({ text: 'ID Card Request', value: 'OrderIDCard' });
          options.push({ text: 'Other', value: 'Other' });
      }
      return options;
    }

    // Ported from JSPF: addAfterHoursLinks function
    function addAfterHoursLinks(formObject, currentCfg) {
      if (!formObject || !formObject.inputs) {
        console.error(
          '[Genesys] addAfterHoursLinks: Invalid formObject or missing inputs array.',
        );
        return;
      }
      // Ensure selfServiceLinks is an array. It's populated from cfg.
      if (!currentCfg || !Array.isArray(currentCfg.selfServiceLinks)) {
        console.warn(
          '[Genesys] addAfterHoursLinks: selfServiceLinks not available in currentCfg or not an array. No links will be added.',
        );
        return;
      }

      formObject.inputs.push({
        custom:
          "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>In the meantime, you can use your BCBST.com account to:</td></tr>",
      });

      currentCfg.selfServiceLinks.forEach(function (entry) {
        // Assuming entry.value in currentCfg.selfServiceLinks is always a fully resolved URL
        if (entry && entry.key && entry.value) {
          formObject.inputs.push({
            custom:
              "<tr><td colspan='2'><a style='margin: 10px 0; font-size: 13px; text-transform: capitalize;' class='btn btn-secondary buttonWide' href='" +
              entry.value +
              "' target='_blank'>" +
              entry.key +
              '</a></td></tr>',
          });
        } else {
          console.warn(
            '[Genesys] addAfterHoursLinks: Skipping invalid selfServiceLink entry:',
            entry,
          );
        }
      });
    }

    // Ported from JSPF: customizeAmplify function
    function customizeAmplify() {
      // cfg.isAmplifyMem should be a boolean from validateConfig
      if (cfg.isAmplifyMem === true) {
        $('.cx-webchat').addClass('amplifyHealth');
        // JSPF selector was: $( "div[class='cx-icon'], span[class='cx-icon']" )
        // This is a broad selector. Using a slightly more direct one.
        // It's crucial to test this selector against the rendered DOM.
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
        console.log('[Genesys] customizeAmplify applied.');
      }
    }

    // Ported from JSPF: applyMessageScaler function
    function applyMessageScaler() {
      const currentChatType = getChatType(calculatedCiciId); // Uses helpers from outer scope

      if (currentChatType === chatTypeConst.SeniorCareChat) {
        // chatTypeConst is already defined
        var webchatDiv = $('.cx-webchat');
        if (webchatDiv.length) {
          // Check if element exists
          webchatDiv.addClass('webchatScaler webchatSenior');
        }
        var transcriptDiv = $('.cx-webchat .cx-body .cx-transcript');
        if (transcriptDiv.length) {
          transcriptDiv.addClass('transcriptScaler');
        }
        console.log('[Genesys] applyMessageScaler applied for SeniorCareChat.');
      } else if (currentChatType === chatTypeConst.BlueCareChat) {
        var webchatDiv = $('.cx-webchat');
        if (webchatDiv.length) {
          webchatDiv.addClass('webchatScaler');
        }
        var transcriptDiv = $('.cx-webchat .cx-body .cx-transcript');
        if (transcriptDiv.length) {
          transcriptDiv.addClass('transcriptScaler');
        }
        console.log('[Genesys] applyMessageScaler applied for BlueCareChat.');
      }
    }

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
            // Use the original div structure that works with the injected CSS
            '<div class="cx-widget cx-widget-chat cx-webchat-chat-button" id="cx_chat_form_button" role="button" tabindex="0" data-message="ChatButton" data-gcb-service-node="true" onclick="window.requestChatOpen && window.requestChatOpen(); return false;"><span class="cx-icon" data-icon="chat"></span><span class="cx-text">Chat With Us</span></div>',
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
                asyncConfiguration: true, // Added for robustness
                reconnectOnError: true, // Added for robustness
                timeout: 60000, // Increased timeout to 60 seconds
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

      // Based on JSPF structure, buildActiveChatInputs() *does* define the primary form.
      // So, this assignment *should* happen.
      window._genesys.widgets.webchat.form.inputs = buildActiveChatInputs();

      console.log(
        '[click_to_chat.js] WebChat config after Object.assign and form.inputs override:',
        JSON.parse(JSON.stringify(window._genesys.widgets.webchat)),
        '[click_to_chat.js] Timestamp:',
        Date.now(),
        '- window._genesys.widgets.onReady CALLED by widgets.min.js.',
      );

      // This function now effectively IS the onReady callback logic for Genesys legacy
      // triggered after widgets.min.js signals it's ready and CXBus is available.

      // Store CXBus globally AFTER it's received and validated (assuming CXBus is passed or available globally)
      // This part of the code assumes CXBus is now available, as this logic is meant to run when Genesys is ready.
      const LocalCXBus = window.CXBus || window._genesysCXBus; // Prefer window.CXBus if defined by widgets.min.js in global scope

      if (LocalCXBus && typeof LocalCXBus.command === 'function') {
        window._genesysCXBus = LocalCXBus; // Make CXBus globally available
        console.log('[Genesys] CXBus object stored on window._genesysCXBus.');
      } else {
        console.error(
          '[Genesys] Invalid or missing CXBus object. Not storing globally. Chat might not function.',
        );
        return; // Critical dependency missing
      }

      // 1. Pre-initialization Checks (already performed by this point if onReady is firing)
      if (!window._genesys || !window._genesys.widgets) {
        console.error(
          '[Genesys] Critical: _genesys.widgets not available. Aborting further initialization.',
        );
        return;
      }
      console.log('[Genesys] CXBus and _genesys.widgets confirmed.');

      // 2. Widget configurations are assumed to be set by the preceding part of initLocalWidgetConfiguration.
      // No need to call initLocalWidgetConfiguration() again here.
      console.log(
        '[click_to_chat.js] Timestamp:',
        Date.now(),
        '- Widget configurations are set.',
      );

      // 3. Register Plugins FIRST
      const plugin = LocalCXBus.registerPlugin('LocalCustomization');
      plugin.subscribe('WebChat.opened', function () {
        console.log('[Genesys] WebChat.opened event received.');
        // Add any custom logic for when the chat window opens

        // Ported JSPF logic for real-time chat availability check
        // Ensure cfg properties like rawChatHrs, isChatAvailable, workingHrs are populated
        if (
          cfg.rawChatHrs &&
          typeof cfg.isChatAvailable !== 'undefined' &&
          cfg.workingHrs
        ) {
          let dt = new Date();
          // Genesys widgets typically operate in user's local time unless server interaction dictates otherwise.
          // JSPF used America/New_York. If this is critical, time zone conversion might be needed here
          // or cfg.rawChatHrs should be pre-adjusted. For now, using local time matching typical JS behavior.
          let dtTimeStr = dt.toLocaleTimeString('en-US', {
            hour12: false /*, timeZone: 'America/New_York' // Consider if TZ conversion is vital */,
          });
          dtTimeStr = dtTimeStr.split(':')[0] + '.' + dtTimeStr.split(':')[1];
          let currentHrMin = parseFloat(dtTimeStr);

          // Example: cfg.rawChatHrs = "Mon-Fri: 8am-8pm_Sat: 9am-1pm_Sun: Closed_16.00" (JSPF format had last part as end hour for today)
          // We need a robust way to get today's end hour from cfg.rawChatHrs or a dedicated cfg field.
          // For this example, let's assume cfg.endChatHourToday (e.g., 16.00 or 20.00) is provided.
          // This parsing logic from JSPF was: rawChatHrs.substring(rawChatHrs.lastIndexOf('_')+1);
          // This should be robustly set in cfg, e.g. cfg.todayEndChatHour (number)

          let endChatHrMin = null;
          if (cfg.rawChatHrs && cfg.rawChatHrs.includes('_')) {
            const parts = cfg.rawChatHrs.split('_');
            const endChatHoursStr = parts[parts.length - 1];
            endChatHrMin = parseFloat(endChatHoursStr);
            if (
              typeof endChatHrMin === 'number' &&
              0 < endChatHrMin &&
              endChatHrMin < 12 &&
              endChatHrMin !== 24
            ) {
              // JSPF 12hr PM logic
              // This JSPF logic for 12hr time might need care if cfg.todayEndChatHour is already 24hr
              // For simplicity, let's assume cfg.todayEndChatHour is in 24hr format (e.g., 16.5 for 4:30 PM)
            }
          } else if (typeof cfg.todayEndChatHour === 'number') {
            // Prefer a direct config value
            endChatHrMin = cfg.todayEndChatHour;
          }

          console.log(
            `[Genesys] Chat Availability Check: CurrentTime=${currentHrMin}, ConfiguredEndHour=${endChatHrMin}, IsChatInitiallyAvailable=${cfg.isChatAvailable}`,
          );

          // JSPF logic: (isChatAvailable === "true" && currentHrMin > endChatHrMin)
          // Assumes cfg.isChatAvailable is a boolean from validateConfig
          if (
            cfg.isChatAvailable &&
            endChatHrMin !== null &&
            currentHrMin > endChatHrMin
          ) {
            console.log(
              '[Genesys] Condition Met: Chat was available, but current time is past operating hours. Modifying form.',
            );
            let tempUnavailableChatForm = {
              inputs: [
                {
                  custom:
                    "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.</td></tr>",
                },
                {
                  // cfg.workingHrs should be like "Mon-Fri: 8 AM - 8 PM EST"
                  custom:
                    "<tr><td id='reachUs' colspan='2' class='i18n' style='font-family: universStd;'>Reach us " +
                    (cfg.workingHrs || 'during business hours') +
                    '</td></tr>',
                },
              ],
            };

            // Call addAfterHoursLinks if selfServiceLinks are available
            // The JSPF had a complex <c:if> here. For now, simplified:
            if (cfg.selfServiceLinks && cfg.selfServiceLinks.length > 0) {
              addAfterHoursLinks(tempUnavailableChatForm, cfg); // Pass cfg
            }

            $('.activeChat').hide(); // Hide original form elements

            // Append new "after hours" messages
            if (tempUnavailableChatForm.inputs) {
              tempUnavailableChatForm.inputs.forEach(function (element) {
                if (element.custom) {
                  // Ensure the target table exists
                  if ($('.cx-form > .cx-form-inputs > table').length) {
                    $('.cx-form > .cx-form-inputs > table').append(
                      element.custom,
                    );
                  } else {
                    console.warn(
                      '[Genesys] Chat form table not found for appending after hours links.',
                    );
                  }
                }
              });
            }

            $(
              '.cx-button-group.cx-buttons-binary > button[data-message="ChatFormSubmit"]',
            ).hide();
          }
        } else {
          console.warn(
            '[Genesys] Not performing real-time chat availability check due to missing cfg: rawChatHrs, isChatAvailable, or workingHrs.',
          );
        }

        // JSPF: if(isChatAvailable === "false") { $('.cx-button-group.cx-buttons-binary').hide(); }
        // This is if chat was *initially* unavailable when page loaded
        if (cfg.isChatAvailable === false) {
          // Assuming boolean from validateConfig
          console.log(
            '[Genesys] Chat is configured as initially unavailable. Hiding submit button group.',
          );
          $('.cx-button-group.cx-buttons-binary').hide();
        }

        // Other JSPF logic from WebChat.opened:
        customizeAmplify(); // Called on WebChat.opened as per JSPF structure
        $("button[data-message='ChatFormCancel']").hide();
        if (cfg.routingchatbotEligible) {
          // from validateConfig
          $("button[data-message='ChatFormSubmit']").attr({
            id: 'startChat',
            class: 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide',
          });
        } else {
          $("button[data-message='ChatFormSubmit']").attr({
            disabled: 'disabled',
            id: 'startChat',
            class:
              'cx-btn cx-btn-default cx-disabled i18n cx-btn-primary buttonWide',
          });
          $('#question_field').attr(
            'class',
            'cx-input cx-form-control dropdownInput i18n',
          );
        }
        $("button[data-message='ConfirmCloseCancel']").attr(
          'class',
          'cx-close-cancel cx-btn cx-btn-default i18n btn-secondary',
        );
        $("button[data-message='ChatEndCancel']").attr(
          'class',
          'cx-end-cancel cx-btn cx-btn-default i18n btn-secondary',
        );
        // $("button[data-message='ChatEndConfirm']").click(closeChatWindow); // We'll add closeChatWindow later
        $("textarea[data-message='ChatInputPlaceholder']").css(
          'background',
          'none',
        );

        // JSPF: if(calculatedCiciId == clientIdConst.SeniorCare){ ... }
        if (calculatedCiciId === clientIdConst.SeniorCare) {
          // calculatedCiciId from outer scope
          $('#question_field').hide();
          $('button[data-message="ChatFormSubmit"]').removeAttr('disabled');
          $('button[data-message="ChatFormSubmit"]').attr({
            id: 'startChat',
            class: 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide',
          });
        }
      });
      plugin.subscribe('WebChat.messageAdded', function () {
        console.log('[Genesys] WebChat.messageAdded event received.');
        // Add any custom logic for new messages
      });
      plugin.subscribe('WebChat.submitted', function (e) {
        console.log('[Genesys] WebChat.submitted event received.');
        // GA - start chat interactions (placeholder for GA logic)
        // window.elementTag($(this).text(), "Chat", {action: "click", selection_type: "widget" }, "select_content", null);
        applyMessageScaler();
        customizeAmplify(); // Also called here in JSPF
      });

      plugin.subscribe('WebChat.errors', function (e) {
        console.error('[Genesys] WebChat.errors event received:', e);
        // OpenChatConnectionError(); // We'll define and call this later
      });

      // JSPF had CallUs.opened subscription here. If CallUs widget is used, it would be similar.
      // plugin.subscribe('CallUs.opened', function(e){
      //     console.log("[Genesys] CallUs.opened event received.");
      //     // ... JSPF CallUs customizations ...
      // });

      // 4. ALWAYS run App.ready before ANY other commands
      LocalCXBus.command('App.ready');
      console.log(
        '[click_to_chat.js] Timestamp:',
        Date.now(),
        "- onReady: LocalCXBus.command('App.ready') sent.",
      );

      // 5. Only THEN run App.main, with robust error handling
      LocalCXBus.command('App.main')
        .done(function () {
          console.log('[Genesys] App.main completed successfully.');
          window.genesysLegacyChatIsReady = true; // Set your global flag here
          // 6. Show button ONLY after App.main completes
          LocalCXBus.command('WebChat.showChatButton');
          console.log(
            '[click_to_chat.js] Timestamp:',
            Date.now(),
            '- onReady: WebChat.showChatButton commanded after App.main success.',
          );

          // Dispatch a custom event indicating Genesys is ready from legacy script perspective
          var event = new CustomEvent('genesys:ready', {
            detail: { CXBus: LocalCXBus },
          });
          window.dispatchEvent(event);
          console.log(
            '[click_to_chat.js] Timestamp:',
            Date.now(),
            '- genesys:ready event dispatched.',
          );
        })
        .fail(function (err) {
          console.error('[Genesys] App.main failed:', err);
          // Fallback: If App.main fails, try to show the button directly, though chat initiation might still fail.
          LocalCXBus.command('WebChat.showChatButton');
          console.warn(
            '[Genesys] Attempted WebChat.showChatButton after App.main failure.',
          );

          // Dispatch an error event if App.main fails
          var errorEvent = new CustomEvent('genesys:error', {
            detail: { error: 'App.main failed', originalError: err },
          });
          window.dispatchEvent(errorEvent);
        });

      console.log(
        '[click_to_chat.js] Timestamp:',
        Date.now(),
        '- End of effective onReady callback execution.',
      );

      // JSPF also called customizeAmplify in a separate onReady.push, effectively after main init.
      // Calling it here ensures it runs after App.main has likely set up the main chat elements.
      customizeAmplify();
    }
    console.log(
      '[click_to_chat.js] window._genesys.widgets.onReady has been defined.',
    );

    // Explicitly load widgets.min.js and then perform final checks
    // This ensures that the FINAL CHECK logic runs *after* widgets.min.js has attempted to load.
    if (cfg.chatMode === 'legacy' && cfg.widgetUrl) {
      console.log(
        `[Genesys] Attempting to load legacy widgets.min.js from: ${cfg.widgetUrl}`,
      );
      loadResource
        .script(cfg.widgetUrl, { id: 'genesys-widgets-min-script-dynamic' })
        .then(() => {
          console.log(
            '[Genesys] Legacy widgets.min.js script loaded (or was already loaded). Performing final checks.',
          );
          // FINAL CHECK MOVED HERE
          console.log(
            '[click_to_chat.js] FINAL CHECK SECTION (after widgets.min.js load attempt)',
          );
          if (typeof window._genesys === 'undefined') {
            console.error(
              '[click_to_chat.js] FINAL CHECK: window._genesys is UNDEFINED. This is after the loadResource promise for widgets.min.js should have resolved or rejected.',
            );
            return;
          } else {
            console.log(
              '[click_to_chat.js] FINAL CHECK: window._genesys object (raw):',
              window._genesys,
            );
            try {
              console.log(
                '[click_to_chat.js] FINAL CHECK: _genesys object (JSON.stringified):',
                JSON.stringify(window._genesys || {}),
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

          if (
            !window._genesys ||
            typeof window._genesys.widgets === 'undefined' ||
            typeof window._genesys.widgets.onReady !== 'function'
          ) {
            console.error(
              '[click_to_chat.js] FINAL CHECK FATAL: window._genesys.widgets.onReady is not a function or widgets object is missing. Chat cannot initialize.',
              'window._genesys current state:',
              window._genesys,
            );
            return;
          }
          console.log(
            '[click_to_chat.js] FINAL CHECK: window._genesys.widgets.onReady is a function. Setup appears correct for legacy mode initialization via onReady.',
          );
        })
        .catch((err) => {
          console.error(
            '[Genesys] CRITICAL: Failed to load widgets.min.js:',
            err,
          );
          // Dispatch an error event that the main app can listen to
          document.dispatchEvent(
            new CustomEvent('genesys:error', {
              detail: { message: 'Failed to load widgets.min.js', error: err },
            }),
          );
        });
    } else if (cfg.chatMode === 'cloud') {
      // For cloud mode, initialization is typically handled by the Genesys Messenger SDK snippet itself
      // or by a different mechanism not reliant on this script's onReady for widgets.min.js.
      console.log(
        '[Genesys] Cloud mode: Initialization typically handled by Genesys Messenger SDK. No explicit widgets.min.js load here.',
      );
    }
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
      // Assign the onReady handler *before* loading widgets.min.js
      if (window._genesys && window._genesys.widgets) {
        window._genesys.widgets.onReady = initLocalWidgetConfiguration; // Assign the correct onReady handler
        console.log(
          '[click_to_chat.js] handleChatSettingsUpdate: window._genesys.widgets.onReady has been RE-ASSIGNED.',
        );
      } else {
        // If _genesys or _genesys.widgets is not defined, we need to initialize it first.
        window._genesys = window._genesys || {};
        window._genesys.widgets = window._genesys.widgets || {};
        window._genesys.widgets.onReady = initLocalWidgetConfiguration;
        console.log(
          '[click_to_chat.js] handleChatSettingsUpdate: window._genesys.widgets created and onReady has been ASSIGNED.',
        );
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
            window._genesys.widgets.onReady = initLocalWidgetConfiguration; // Assign onReady for re-initialization
            console.log(
              '[click_to_chat.js] handleChatSettingsUpdate (after jQuery load): window._genesys.widgets.onReady has been RE-ASSIGNED.',
            );
          } else {
            window._genesys = window._genesys || {};
            window._genesys.widgets = window._genesys.widgets || {};
            window._genesys.widgets.onReady = initLocalWidgetConfiguration;
            console.log(
              '[click_to_chat.js] handleChatSettingsUpdate (after jQuery load): window._genesys.widgets created and onReady has been ASSIGNED.',
            );
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

  // The old "FINAL CHECK" block that was here is now removed and integrated into initializeChatWidget.
})(window, document);
