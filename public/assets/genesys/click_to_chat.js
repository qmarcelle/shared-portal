// public/genesys-chat.js
(function (window, document) {
  'use strict';

  // === 0) Grab config ===
  const cfg = window.chatSettings || {};

  // Add detailed logging of available configuration
  console.log('[Genesys] Initializing with configuration:', {
    chatSettingsAvailable: !!window.chatSettings,
    configKeys: Object.keys(cfg),
    chatMode: cfg.chatMode || 'legacy',
    cloudChatEligible: cfg.cloudChatEligible,
    isChatEligibleMember: cfg.isChatEligibleMember,
    isDemoMember: cfg.isDemoMember,
    isChatAvailable: cfg.isChatAvailable,
    timestamp: new Date().toISOString(),
  });

  // Validate critical settings
  if (!cfg.chatMode) {
    console.warn(
      '[Genesys] No chatMode specified in config, defaulting to legacy',
    );
  }

  if (cfg.chatMode === 'cloud' && (!cfg.deploymentId || !cfg.orgId)) {
    console.error(
      '[Genesys] Cloud chat mode requires deploymentId and orgId:',
      {
        deploymentId: cfg.deploymentId,
        orgId: cfg.orgId,
      },
    );
  }

  // === 1) Inject JSPF CSS ===
  const css = `
.cobrowse-card{color:#333;position:fixed;padding:25px;background:white;border-radius:10px;z-index:2147483647;top:50px;left:50%;max-width:496px;transform:translateX(-50%);box-shadow:0 0 15px #33333322;font-family:Roboto,Helvetica,sans-serif;}
.cobrowse-deny-button,.cobrowse-allow-button{cursor:pointer;padding:10px;margin-top:10px;width:115px;}
.scrSharingHead{font-size:16px;font-family:universStd;}
.scrSharingSubHead{font-size:12px;color:#666;}
.cobrowse-phone-title{width:50%;height:50px;font-size:36px;margin-top:-15px !important;}
.cobrowse-phone-title span,.cobrowse-phone-subtitle span{font-size:13px !important;color:#666;}
.cobrowse-phone-subtitle{margin-top:-15px;}
.cobrowse-phone-number{text-align:left !important;float:none !important;width:50%;height:50px;font-size:37px;}
.cobrowse-phone-number .href-col:hover{color:inherit !important;font-style:inherit !important;text-decoration:inherit !important;}
.href-col{color:black;}
.cobrowse-availability{float:left;max-width:200px;text-align:left;font-weight:400;color:#9fabb7;}
.hrs-opt{margin-top:-11px;}
.cobrowse-shareScreen-link{float:right;color:#666;font-weight:bold;margin-top:9px;line-height:22px;margin-right:20px;}
.cobrowse-cobrowse-link{margin-top:-15px;color:#005bbc;}
.cobrowse-chatClose{float:right;margin-top:-15px;margin-right:20px;transform:translateX(100%);font-size:18px;color:#005bbc;text-decoration:none;}
.cobrowse-scrSharingSubHead{font-size:12px;color:#666;margin-top:-6px;}
.cobrowse-channelBtn{padding:0 30px;margin-top:0;margin-right:15px;}
.cobrowse-btn-secondary{background:transparent!important;border:1px solid #005EB9!important;color:#005EB9!important;text-decoration:none!important;}
.cobrowse-btn{font-size:12px!important;border-radius:3px;margin-top:12px;}
.cobrowse-phoneicon{margin-left:3px;padding:3px 17px;background-size:16px;}
.cobrowse-chaticon{margin-left:3px;padding:7px 19px;background-size:14px;}
.cx-webchat .cx-menu>li>.cx-menu-item.cx-icon{display:none;}
`;
  const styleEl = document.createElement('style');
  styleEl.id = 'genesys-chat-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // === 2) Inject JSPF modals ===
  function injectModals() {
    // TODO: Temporarily commented out cobrowse modals to focus on chat implementation
    // Will be re-enabled once chat functionality is working properly
    /*
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
<div id="cobrowse-sessionConfirm" class="modal" style="background:rgba(50,50,50,0.4);position:fixed;inset:0;z-index:2147483647">
  <div class="cobrowse-card" style="width:100%">
    <div style="text-align:left;margin-bottom:5px"><b>Are you on the phone with us?</b></div>
    <div>We can help better if we can see your screen.</div>
    <div style="float:left;margin-top:10px;color:rgb(0,122,255);">
      <a class="btn btn-secondary cobrowse-deny-button" onclick="showCobrowseContactUsModal()">No</a>
      <a class="btn btn-primary cobrowse-allow-button" onclick="showCobrowseModal()" style="margin-left:10px">Yes</a>
    </div>
  </div>
</div>

<div class="modal" id="cobrowse-sessionYesModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-bottom">
    <div class="modal-content sessionmodalcontent">
      <div class="modal-body">
        <div class="scrSharingHead">Your session ID is <span id="cobrowse-sessionToken" class="sessiontoken"></span></div>
        <div class="scrSharingSubHead">Read this ID number to the representative you're speaking with.</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="endCoBrowseCall()">Cancel</button>
      </div>
    </div>
  </div>
</div>

<div class="modal" id="cobrowse-contactUsScreen1" tabindex="-1" role="dialog" style="background:rgba(50,50,50,0.4);position:fixed;inset:0">
  <div style="color:#333;font-family:sans-serif;line-height:230%;position:fixed;padding:25px;background:white;top:50px;left:50%;width:75%;max-width:520px;transform:translateX(-50%);">
    <div class="scrSharingHead">How would you like to talk to us?</div>
    <div class="cobrowse-scrSharingSubHead">Choose an option to talk to our Member Services team</div>
    <button id="phoneDetails_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="cobrowseContactUsOption()">PHONE <span class="phoneIcon cobrowse-phoneicon"></span></button>
    ${
      cfg.isChatEligibleMember === 'true' || cfg.isDemoMember === 'true'
        ? `<button id="openChat_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="openWebChatWidget()">CHAT <span class="chatIcon cobrowse-chaticon"></span></button>`
        : ''
    }
  </div>
</div>

<div class="modal" id="cobrowse-contactUsScreen2" tabindex="-1" role="dialog">
  <div style="background:rgba(50,50,50,0);position:fixed;inset:0">
    <div style="color:#333;font-family:sans-serif;line-height:230%;position:fixed;padding:25px;background:white;border-radius:15px;top:50px;left:50%;width:75%;max-width:700px;transform:translateX(-50%);">
      <a class="cobrowse-chatClose" onclick="cobrowseClosePopup()">&times;</a>
      <div class="cobrowse-main-phone">
        <div class="cobrowse-phone-title"><span>Call us at</span></div>
        <div class="cobrowse-phone-number"><span class="href-col">${cfg.opsPhone}</span></div>
        <div class="cobrowse-phone-subtitle"><span>Once you're on the line with us, say "share your screen."</span></div>
      </div>
      <div class="cobrowse-availability">
        <div class="cobrowse-hours"><b>Hours of operation</b></div>
        <div class="hrs-opt">${cfg.opsPhoneHours}</div>
      </div>
      <div class="cobrowse-shareScreen-link">
        <span class="cobrowse-cobrowse-offer">Already on a call? <a class="cobrowse-cobrowse-link" onclick="cobrowseSessionModal()">Share your screen</a></span>
      </div>
    </div>
  </div>
</div>
`;
    document.body.appendChild(wrapper);
    */
  }
  injectModals();

  // === 3) Audio alert ===
  const webAlert = new Audio();
  try {
    // Log audio initialization
    console.log('[Genesys] Setting up audio notification');

    // Use a simpler relative path that's more likely to work
    const audioPath = '/assets/genesys/sounds/bell.mp3';
    console.log('[Genesys] Using audio path:', audioPath);

    webAlert.src = audioPath;
    webAlert.muted = true;

    // Add error handling for the audio element
    webAlert.addEventListener('error', function (e) {
      console.error('[Genesys] Audio error:', {
        error: e.error,
        message: 'Could not load audio notification',
        src: webAlert.src,
        errorCode: webAlert.error ? webAlert.error.code : 'unknown',
      });
    });

    // Allow audio to be unmuted during first user interaction
    webAlert.addEventListener('canplaythrough', function () {
      console.log('[Genesys] Audio file loaded successfully and can play');
    });
  } catch (err) {
    console.error('[Genesys] Error setting up audio:', err);
    // Provide a dummy audio object that won't cause errors if called
    webAlert.play = function () {
      console.log('[Genesys] Audio play called but audio not available');
    };
  }

  // === 4) Utility & CoBrowseIO boot-strap ===
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
              <a class="cobrowse-deny  btn btn-secondary">No</a>
            </div>
          </div>
        </div>`;
      el.querySelector('.cobrowse-allow').onclick = () => {
        resolve(true);
        el.remove();
        setTimeout(
          () =>
            (document.querySelector('.cbio_session_controls').innerHTML =
              'End Screen Sharing'),
          400,
        );
      };
      el.querySelector('.cobrowse-deny').onclick = () => {
        resolve(false);
        el.remove();
      };
      document.body.appendChild(el);
    });
  }

  // TODO: Temporarily commented out Cobrowse functionality
  /*
  window.CobrowseIO = window.CobrowseIO || {};
  CobrowseIO.confirmSession = () =>
    buildConsent(
      "We'd like to share your screen",
      'Sharing lets us see only your BCBST.com tab. OK?',
    );
  CobrowseIO.confirmRemoteControl = () =>
    buildConsent("We'd like control", 'We can click to help you. OK?');
  */

  // === 5) Next: jQuery loader & main init ===
  function isJQ() {
    return !!window.jQuery;
  }
  function loadJQ(cb) {
    const s = document.createElement('script');
    s.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    s.onload = () => cb(window.jQuery);
    document.head.appendChild(s);
  }

  (isJQ()
    ? Promise.resolve(window.jQuery)
    : new Promise((res) => loadJQ(res))
  ).then(($) => {
    // === 5a) CoBrowse license & session code (JSPF parity) ===
    // TODO: Temporarily commented out Cobrowse functionality
    /*
    $(document).ready(() => {
      CobrowseIO.license = cfg.coBrowseLicence;
      CobrowseIO.customData = {
        user_id: cfg.userID,
        user_name: cfg.memberFirstname,
      };
      CobrowseIO.capabilities = [
        'cursor',
        'keypress',
        'laser',
        'pointer',
        'scroll',
        'select',
      ];
      CobrowseIO.client().then((client) => {
        client.start();
        client.createSessionCode().then((code) => {
          const el = document.getElementById('cobrowse-sessionToken');
          if (el) el.textContent = code.match(/.{1,3}/g).join('-');
        });
      });
    });
    */

    // === 5b) Main init ===
    initializeChatWidget($, cfg);
  });

  // === 6) The reproduce-JSPF initializeChatWidget (full parity) ===
  function initializeChatWidget($, cfg) {
    if (!cfg) {
      console.error('Missing chatSettings');
      return;
    }

    // 6.1) Enums & utility (port-for-port)
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
      const L = ['INDVMX', 'BA', 'INDV', 'CK', 'BC', 'DS', 'CT'];
      return id && L.includes(id.trim()) ? id.trim() : 'Default';
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

    // 6.2) setOptions (all branches)
    function setOptions(optVar) {
      const opts =
        calculatedCiciId === clientIdConst.SeniorCare
          ? []
          : [
              {
                disabled: 'disabled',
                selected: 'selected',
                text: 'Select one',
              },
            ];
      const push = (t, v) => opts.push({ text: t, value: v });
      switch (optVar) {
        case clientIdConst.BlueCare:
          ['Eligibility', 'TennCare PCP', 'Benefits', 'Transportation'].forEach(
            (t) => push(t, t),
          );
          if (cfg.isIDCardEligible === 'true' && cfg.chatbotEligible === 'true')
            push('ID Card Request', 'OrderIDCard');
          break;
        case clientIdConst.BlueCarePlus:
        case clientIdConst.CoverTN:
        case clientIdConst.CoverKids:
          ['Eligibility', 'Benefits', 'Claims Financial'].forEach((t) =>
            push(t, t),
          );
          if (cfg.isIDCardEligible === 'true' && cfg.chatbotEligible === 'true')
            push('ID Card Request', 'OrderIDCard');
          push('Member Update Information', 'Member Update Information');
          push('Pharmacy', 'Pharmacy');
          break;
        case clientIdConst.SeniorCare:
          break;
        case 'dentalOnly':
          push('Benefits and Coverage', 'Benefits and Coverage');
          push('New or Existing Claims', 'New Or Existing Claims');
          if (cfg.groupType === 'INDV')
            push('Premium Billing', 'Premium Billing');
          push('Deductibles', 'Deductibles');
          push('Find Care', 'Find Care');
          if (cfg.isCobraEligible === 'true') push('COBRA', 'COBRA');
          if (cfg.isIDCardEligible === 'true' && cfg.chatbotEligible === 'true')
            push('ID Card Request', 'OrderIDCard');
          push('Other', 'Other');
          break;
        case clientIdConst.Individual:
          [
            'Benefits and Coverage',
            'New or Existing Claims',
            'Premium Billing',
            'Deductibles',
            'Pharmacy and Prescriptions',
            'Find Care',
          ].forEach((t) => push(t, t));
          if (cfg.isDental === 'true') push('Dental', 'Dental');
          if (cfg.isIDCardEligible === 'true' && cfg.chatbotEligible === 'true')
            push('ID Card Request', 'OrderIDCard');
          push('Other', 'Other');
          break;
        case clientIdConst.BlueElite:
          [
            'Address Update',
            'Bank Draft',
            'Premium Billing',
            'Report Date of Death',
          ].forEach((t) => push(t, t));
          if (cfg.isDental === 'true') push('Dental', 'Dental');
          if (cfg.isIDCardEligible === 'true' && cfg.chatbotEligible === 'true')
            push('ID Card Request', 'OrderIDCard');
          push('All Other', 'All Other');
          break;
        default:
          [
            'Benefits and Coverage',
            'New or Existing Claims',
            'Deductibles',
            'Pharmacy and Prescriptions',
            'Find Care',
          ].forEach((t) => push(t, t));
          if (cfg.isDental === 'true') push('Dental', 'Dental');
          if (cfg.isCobraEligible === 'true') push('COBRA', 'COBRA');
          if (cfg.isIDCardEligible === 'true' && cfg.chatbotEligible === 'true')
            push('ID Card Request', 'OrderIDCard');
          push('Other', 'Other');
      }
      return opts;
    }

    // 6.3) Derived values
    const calculatedCiciId = (() => {
      if (cfg.isBlueEliteGroup === 'true') return clientIdConst.BlueElite;
      if (cfg.groupType === 'INDV') return clientIdConst.Individual;
      return cfg.memberClientID;
    })();

    // 6.4) Load CobrowseIO script
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

    // 6.5) Build active-chat inputs
    function buildActiveChatInputs() {
      const inputs = [];
      const amp = cfg.isAmplifyMem === 'true';
      inputs.push({
        custom: amp
          ? "<tr class='activeChat'><td colspan='2' data-message='Questions or need advice? Let&#39;s talk.' style='font-size:30px'></td></tr>"
          : "<tr class='activeChat'><td colspan='2' data-message='We&#39;re right here <br>for you. Let&#39;s chat.' style='font-size:30px'></td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      if (!cfg.routingchatbotEligible) {
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

      // Hidden fields
      const hiddenFields = [
        { id: 'LOB', name: 'LOB', value: defaultedClientID(calculatedCiciId) },
        {
          id: 'IsMedicalEligible',
          name: 'IsMedicalEligible',
          value: cfg.isMedical,
        },
        {
          id: 'IsDentalEligible',
          name: 'IsDentalEligible',
          value: cfg.isDental,
        },
        {
          id: 'IsVisionEligible',
          name: 'IsVisionEligible',
          value: cfg.isVision,
        },
        {
          id: 'IDCardBotName',
          name: 'IDCardBotName',
          value: cfg.routingchatbotEligible ? cfg.idCardChatBotName : '',
        },
      ];
      hiddenFields.forEach((f) => inputs.push(f));
      inputs.push({
        custom:
          "<tr class='activeChat'><td>By clicking on the button, you agree with our <a href='#' onclick='OpenChatDisclaimer();return false;'>Terms and Conditions</a> for chat.</td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      // Demographics
      const demo = [
        {
          id: 'firstName_field',
          name: 'firstname',
          value: cfg.formattedFirstName,
        },
        { id: 'lastname_field', name: 'lastname', value: cfg.memberLastName },
        {
          id: 'memberId_field',
          name: 'MEMBER_ID',
          value: `${cfg.subscriberID}-${cfg.sfx}`,
        },
        { id: 'groupId_field', name: 'GROUP_ID', value: cfg.groupId },
        { id: 'planId_field', name: 'PLAN_ID', value: cfg.memberMedicalPlanID },
        { id: 'dob_field', name: 'MEMBER_DOB', value: cfg.memberDOB },
        {
          id: 'inquiryType_field',
          name: 'INQ_TYPE',
          value: getChatType(calculatedCiciId),
        },
      ];
      demo.forEach((f) => inputs.push(f));
      return inputs;
    }

    // 6.6) Init Genesys widgets
    function initLocalWidgetConfiguration() {
      window._genesys = window._genesys || {};
      window._gt = window._gt || [];
      window._genesys.widgets = window._genesys.widgets || {};

      // Add combined custom CSS for both theming and layout
      const customCSS = document.createElement('style');
      customCSS.innerHTML = `
        /* Light theme customization based on Genesys documentation */
        .cx-widget.cx-theme-light {
          color: #333 !important;
          background: #FFFFFF !important;
        }
        
        .cx-widget.cx-theme-light .cx-titlebar {
          background: #0078d4 !important;
          color: #FFFFFF !important;
        }
        
        .cx-widget.cx-theme-light .cx-message.cx-system {
          background-color: #F2F2F2 !important;
          color: #333 !important;
        }
        
        .cx-widget.cx-theme-light .cx-message.cx-user {
          background-color: #0078d4 !important;
          color: #FFFFFF !important;
        }
        
        .cx-widget.cx-theme-light .cx-message.cx-agent {
          background-color: #FFFFFF !important;
          border: 1px solid #E0E0E0 !important;
          color: #333 !important;
        }
        
        .cx-widget.cx-theme-light button.cx-btn-primary {
          background-color: #0078d4 !important;
          color: #FFFFFF !important;
        }
        
        .cx-widget.cx-theme-light button.cx-btn-default {
          background-color: #F2F2F2 !important;
          color: #333 !important;
        }
        
        .cx-widget.cx-theme-light .cx-input {
          background-color: #FFFFFF !important;
          border: 1px solid #E0E0E0 !important;
          color: #333 !important;
        }
        
        /* Chat button styling */
        .cx-widget.cx-theme-light.cx-webchat-chat-button, 
        .cx-widget.cx-theme-light .cx-webchat-chat-button {
          background-color: #0078d4 !important;
          color: #FFFFFF !important;
        }
        
        /* === Layout and positioning fixes === */
        
        /* Fix widget positioning */
        .cx-widget.cx-webchat {
          position: fixed !important;
          right: 20px !important;
          bottom: 20px !important;
          max-width: 400px !important;
          max-height: 600px !important;
          width: 100% !important;
          height: auto !important;
          box-shadow: 0 0 10px rgba(0,0,0,0.2) !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        
        /* Hide the "Powered by Genesys" text */
        .cx-widget .cx-footer span,
        .cx-widget .cx-footer-container span {
          display: none !important;
        }
        
        /* Fix chat button positioning */
        .cx-widget.cx-webchat-chat-button {
          position: fixed !important;
          right: 20px !important;
          bottom: 20px !important;
          width: auto !important;
          height: auto !important;
          padding: 15px 25px !important;
          border-radius: 5px !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
          font-size: 16px !important;
          font-weight: bold !important;
          z-index: 999 !important;
        }
        
        /* Ensure proper icon sizes */
        .cx-widget.cx-webchat .cx-icon {
          width: 24px !important;
          height: 24px !important;
        }
        
        /* Fix close button positioning */
        .cx-widget.cx-webchat .cx-titlebar .cx-icon {
          position: absolute !important;
          right: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
      `;
      document.head.appendChild(customCSS);

      // Main config
      window._genesys.widgets.main = {
        debug: false,
        theme: 'light', // Use light theme
        lang: 'en',
        mobileMode: 'auto',
        downloadGoogleFont: false,
        plugins: [],
        i18n: { en: {} },
        header: { Authorization: `Bearer ${cfg.clickToChatToken}` },
        // Control the dimensions of the widget
        size: {
          width: 400, // standard widget width
          height: 600, // standard widget height
          minWidth: 400,
          minHeight: 600,
          windowWidth: '400px', // Use fixed width rather than percentage
          windowHeight: '600px', // Use fixed height rather than percentage
        },
        // Hide the Genesys logo
        showPoweredBy: false,
        // Additional customization callbacks
        customStylesheetID: 'genesys-widgets-custom',
        preload: ['webchat'], // Preload the webchat plugin
        actionsBar: {
          showPoweredBy: false, // Hide powered by in actions bar
        },
      };

      // CallUs text
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
            number: cfg.opsPhone,
          },
        ],
        hours: [cfg.opsPhoneHours],
      };

      // Chat plugins
      if (cfg.isChatEligibleMember === 'true' || cfg.isDemoMember === 'true') {
        window._genesys.widgets.main.plugins.push(
          'cx-webchat-service',
          'cx-webchat',
        );

        // i18n.webchat
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
        window._genesys.widgets.main.i18n.en.webchat =
          cfg.isDemoMember === 'true'
            ? {
                ...commonText,
                Errors: {
                  StartFailed:
                    "<div class='modalTitle'>This is a Demo only chat.</div>",
                },
              }
            : commonText;

        if (cfg.isAmplifyMem === 'true') {
          const w = window._genesys.widgets.main.i18n.en.webchat;
          w.ChatButton = 'Chat with an advisor';
          w.ChatTitle = 'Chat with an advisor';
        }

        // chat availability branches
        const base = {
          dataURL: () =>
            cfg.isDemoMember === 'true'
              ? cfg.clickToChatDemoEndPoint
              : cfg.clickToChatEndpoint,
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
            template:
              '<div class="cx-widget cx-webchat-chat-button cx-side-button" style="position:fixed; right:20px; bottom:20px; background-color:#0078d4; color:white; padding:15px 25px; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.2); font-size:16px; font-weight:bold; z-index:9999; cursor:pointer;">Chat Now</div>',
            width: 'auto',
            height: 'auto',
            position: {
              bottom: '20px',
              right: '20px',
            },
          },
          composerFooter: {
            showPoweredBy: false, // Hide powered by Genesys footer
          },
        };
        if (cfg.isChatAvailable === 'false') {
          window._genesys.widgets.webchat = {
            ...base,
            form: {
              inputs: [
                {
                  custom:
                    "<tr><td colspan='2' class='i18n' data-message='You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.' style='font-family:universStd;'></td></tr>",
                },
                {
                  custom: `<tr><td id='reachUs' colspan='2' class='i18n' style='font-family:universStd;'>Reach us ${cfg.chatHours}</td></tr>`,
                },
              ],
            },
            composerFooter: {
              showPoweredBy: false,
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
            composerFooter: {
              showPoweredBy: false,
            },
          };
        }
      }

      // Add additional CSS specifically to hide "Powered by Genesys" text
      const poweredByFix = document.createElement('style');
      poweredByFix.innerHTML = `
        /* Hide all "Powered by Genesys" text */
        .cx-widget .cx-footer span,
        .cx-widget .cx-footer-container span,
        .cx-widget.cx-webchat .cx-menu .cx-powered-by,
        .cx-widget.cx-webchat .cx-powered-by,
        .cx-widget .cx-powered-by,
        .cx-powered-by,
        [class*="-powered-by"],
        [class*="powered-by"],
        [class*="poweredby"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        
        /* Ensure the footer still looks nice without the text */
        .cx-widget .cx-footer,
        .cx-widget .cx-footer-container {
          height: auto !important;
          min-height: 10px !important;
          padding: 5px !important;
        }
      `;
      document.head.appendChild(poweredByFix);
    }

    initLocalWidgetConfiguration();

    // === 7) CXBus subscriptions ===
    let localWidgetPlugin;
    window._genesys.widgets.onReady = function (CXBus) {
      localWidgetPlugin = CXBus.registerPlugin('LocalCustomization');

      // Helper function to fix layout issues
      function fixChatWidgetLayout() {
        console.log('[Genesys] Applying layout fixes');

        // Fix widget container
        const widgetContainer = document.querySelector('.cx-widget.cx-webchat');
        if (widgetContainer) {
          Object.assign(widgetContainer.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            maxWidth: '400px',
            maxHeight: '600px',
            width: '400px',
            height: 'auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            overflow: 'hidden',
          });
        }

        // Fix chat button
        const chatButton = document.querySelector(
          '.cx-widget.cx-webchat-chat-button',
        );
        if (chatButton) {
          Object.assign(chatButton.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            backgroundColor: '#0078d4',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: '9999',
            cursor: 'pointer',
          });
        }

        // Hide "Powered by Genesys" in footer
        const footerElements = document.querySelectorAll(
          '.cx-widget .cx-footer span, .cx-widget .cx-footer-container span',
        );
        footerElements.forEach((el) => {
          if (el && el.textContent && el.textContent.includes('Genesys')) {
            el.style.display = 'none';
          }
        });
      }

      localWidgetPlugin.subscribe('WebChat.opened', () => {
        customizeAmplify();
        // Apply layout fixes when chat is opened
        setTimeout(fixChatWidgetLayout, 500);
      });

      localWidgetPlugin.subscribe('WebChat.messageAdded', (e) => {
        $('.cx-avatar.bot').find('svg').replaceWith(chatBotAvatar);
        if (e.data.message.type === 'Agent') webAlert.play();
      });

      localWidgetPlugin.subscribe('WebChat.errors', OpenChatConnectionError);
      localWidgetPlugin.subscribe('WebChat.submitted', () => {
        applyMessageScaler();
        customizeAmplify();
        // Apply layout fixes after form submit
        setTimeout(fixChatWidgetLayout, 500);
      });

      localWidgetPlugin.subscribe('CallUs.opened', () => {
        // same call-us UI tweaks as JSPF…
      });

      // Apply fixes when widget UI is ready
      setTimeout(fixChatWidgetLayout, 1000);
    };

    // === 8) Helpers for modals & disclaimers ===
    window.startCoBrowseCall = () =>
      $('#cobrowse-sessionConfirm').modal({
        backdrop: 'static',
        keyboard: false,
      });
    window.cobrowseContactUsOption = () => {
      $('#cobrowse-contactUsScreen1').style.display = 'none';
      $('#cobrowse-contactUsScreen2').style.display = 'block';
    };
    window.showCobrowseModal = () => {
      $('#cobrowse-sessionConfirm').modal('hide');
      CobrowseIO.createSessionCode().then((c) => c.createSessionCode());
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };
    window.showCobrowseContactUsModal = () => {
      $('#cobrowse-sessionConfirm').modal('hide');
      $('#cobrowse-contactUsScreen1').modal({ backdrop: 'static' });
    };
    window.cobrowseClosePopup = () =>
      $('#cobrowse-contactUsScreen2').modal('hide');
    window.cobrowseSessionModal = () => {
      $('#cobrowse-contactUsScreen2').modal('hide');
      CobrowseIO.createSessionCode().then((c) => c.createSessionCode());
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };
    window.endCoBrowseCall = () => {
      CobrowseIO.client()
        .then((c) => c.exitSession())
        .catch(console.error);
    };

    // Disclaimers
    function setChatDisclaimerMesg(cid) {
      switch (cid) {
        case clientIdConst.BlueCare:
        case clientIdConst.BlueCarePlus:
          return 'For quality assurance your chat may be monitored and/or recorded. Benefits…';
        case clientIdConst.CoverTN:
          return 'This information provided today is based on current eligibility and contract limitations…';
        default:
          return 'This information provided today is based on current eligibility…<long default text>';
      }
    }
    window.OpenChatDisclaimer = function () {
      if (!localWidgetPlugin) return;
      const msg = setChatDisclaimerMesg(calculatedCiciId);
      localWidgetPlugin.command('WebChat.showOverlay', {
        html: $(
          "<div id='disclaimerId'><p class='termsNConditions'><span class='modalTitle'>Terms and Conditions</span><br><br>" +
            msg +
            "</p></div><div style='padding-bottom:10px;background-color:#fff;'><button class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatDisclaimer()'>CLOSE</button></div>",
        ),
        hideFooter: true,
      });
      $('button[data-message="ChatFormSubmit"]').hide();
    };
    window.CloseChatDisclaimer = function () {
      localWidgetPlugin.command('WebChat.hideOverlay').done(() => {
        $('button[data-message="ChatFormSubmit"]').show();
      });
    };

    // Error overlays
    function OpenChatConnectionError() {
      localWidgetPlugin.command('WebChat.showOverlay', {
        html: $(
          "<div><p class='termsNConditions'><span class='modalTitle'>Error Connecting to Chat Server</span><br><br>We're sorry for the inconvenience, please logout and log back in.</p></div><div style='padding-bottom:10px;background-color:#fff;'><button class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatConnectionError()'>CLOSE</button></div>",
        ),
        hideFooter: false,
      });
    }
    window.CloseChatConnectionError = function () {
      localWidgetPlugin.command('WebChat.hideOverlay');
    };

    // === 9) Visual tweaks & debug override ===
    function customizeAmplify() {
      if (cfg.isAmplifyMem === 'true') {
        $('.cx-webchat').addClass('amplifyHealth');
        $('div.cx-icon,span.cx-icon').html(
          '<img src="/assets/chat.svg" style="width:45px;height:45px;padding-bottom:10px;padding-right:10px;">',
        );
      }
    }
    function applyMessageScaler() {
      const t = getChatType(calculatedCiciId);
      const w = $('.cx-webchat'),
        tr = $('.cx-transcript');
      if (
        w &&
        (t === chatTypeConst.BlueCareChat || t === chatTypeConst.SeniorCareChat)
      ) {
        w.addClass(
          'webchatScaler' +
            (t === chatTypeConst.SeniorCareChat ? ' webchatSenior' : ''),
        );
      }
      if (tr) tr.addClass('transcriptScaler');
    }

    function enableChatButton() {
      console.log('[Genesys] Forcing chat button enablement...');
      if (window._genesys && window._genesys.widgets) {
        window._genesys.widgets.webchat = window._genesys.widgets.webchat || {};
        window._genesys.widgets.webchat.chatButton = {
          enabled: true,
          template:
            '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
          openDelay: 100,
          effectDuration: 200,
          hideDuringInvite: false,
        };
        window._genesys.widgets.main.debug = false;
        setTimeout(() => {
          const btn = document.querySelector('.cx-webchat-chat-button');
          if (btn) {
            Object.assign(btn.style, {
              display: 'flex',
              opacity: '1',
              visibility: 'visible',
              backgroundColor: '#0078d4',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              position: 'fixed',
              right: '20px',
              bottom: '20px',
              zIndex: '9999',
            });
            if (btn.textContent.includes('Debug:'))
              btn.textContent = 'Chat Now';
            btn.onclick = () =>
              window.CXBus && window.CXBus.command('WebChat.open');
          }
        }, 2000);
      } else {
        console.warn('[Genesys] Widgets not ready, skipping force-enable');
      }
    }
    enableChatButton();

    // === 10) Play first click for audio policies ===
    $(document).on('click', '.cx-widget.cx-webchat-chat-button', () => {
      if (webAlert.muted) webAlert.play();
    });
  }

  // === Genesys script loader (cloud/legacy) ===
  (function () {
    var mode =
      (window.chatSettings && window.chatSettings.chatMode) || 'legacy';

    console.log('[Genesys] Script loader initializing with mode:', mode);

    if (mode === 'cloud') {
      // Genesys Cloud Messenger
      var environment = window.chatSettings.environment || 'usw2.pure.cloud';
      var deploymentId = window.chatSettings.deploymentId || '';
      var orgId = window.chatSettings.orgId || '';

      console.log('[Genesys] Cloud mode configuration:', {
        environment,
        deploymentId,
        orgId,
        hasRequiredParams: !!(deploymentId && orgId),
      });

      var script = document.createElement('script');
      script.async = true;
      script.charset = 'utf-8';
      script.src =
        'https://apps.' + environment + '/genesys-bootstrap/genesys.min.js';

      console.log('[Genesys] Loading cloud script from:', script.src);

      script.onload = function () {
        console.log('[Genesys] Cloud Messenger script loaded successfully');
        // Messenger bootstrap config (optional, can be handled by window.chatSettings)
        if (window.Genesys) {
          console.log('[Genesys] Genesys global object available');
          window.Genesys('subscribe', 'Messenger.ready', function () {
            console.log('[Genesys] Messenger ready event received');
            // Optionally set custom attributes or perform additional setup here
          });
        } else {
          console.error(
            '[Genesys] Genesys global object not available after script load',
          );
        }
      };

      script.onerror = function (error) {
        console.error(
          '[Genesys] Failed to load Cloud Messenger script:',
          error,
        );
      };

      document.head.appendChild(script);
      console.log('[Genesys] Cloud script element added to document');
    } else {
      // Legacy mode: ensure widgets.min.js is loaded
      console.log('[Genesys] Using legacy mode, checking for _genesys object');

      if (!window._genesys) {
        console.log('[Genesys] _genesys not found, loading widgets.min.js');
        var legacyScript = document.createElement('script');
        legacyScript.async = true;
        legacyScript.src = '/assets/genesys/plugins/widgets.min.js';

        legacyScript.onload = function () {
          console.log('[Genesys] Legacy widgets.min.js loaded successfully');

          // Check if the widget initialized properly
          if (window._genesys && window._genesys.widgets) {
            console.log('[Genesys] Legacy widgets detected in global scope');
          } else {
            console.error(
              '[Genesys] Legacy widgets not initialized after script load',
            );
          }
        };

        legacyScript.onerror = function (error) {
          console.error(
            '[Genesys] Failed to load legacy widgets script:',
            error,
          );
        };

        document.head.appendChild(legacyScript);
        console.log('[Genesys] Legacy script element added to document');
      } else {
        console.log('[Genesys] _genesys already exists, skipping script load');
      }
    }
  })();
})(window, document);
