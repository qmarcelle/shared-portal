(function (window, document) {
  'use strict';

  // === 0) Grab config ===
  const cfg = window.chatSettings || {};

  // JSPF parity: mirror all JSP-injected values
  const clickToChatToken = cfg.clickToChatToken;
  const clickToChatEndpoint = cfg.clickToChatEndpoint;
  const clickToChatDemoEndPoint = cfg.clickToChatDemoEndPoint;
  const coBrowseLicence = cfg.coBrowseLicence;
  const cobrowseSource = cfg.cobrowseSource;
  const cobrowseURL = cfg.cobrowseURL;
  const opsPhone = cfg.opsPhone;
  const opsPhoneHours = cfg.opsPhoneHours;
  const routingchatbotEligible = cfg.routingchatbotEligible === 'true';
  const isChatEligibleMember = cfg.isChatEligibleMember === 'true';
  const isDemoMember = cfg.isDemoMember === 'true';
  const isAmplifyMem = cfg.isAmplifyMem === 'true';
  const isCobrowseActive = cfg.isCobrowseActive === 'true';
  const isMagellanVAMember = cfg.isMagellanVAMember === 'true';
  const isMedicalAdvantageGroup = cfg.isMedicalAdvantageGroup === 'true';
  const selfServiceLinks = cfg.selfServiceLinks || [];
  const rawChatHrs = cfg.rawChatHrs;

  // Restore gmsServicesConfig exactly as in JSPF
  const gmsServicesConfig = {
    GMSChatURL: () =>
      isDemoMember ? clickToChatDemoEndPoint : clickToChatEndpoint,
  };

  // Simplified logging
  console.log('[Genesys] Initializing chat widget', {
    chatMode: cfg.chatMode || 'legacy',
    userInfo: {
      firstname: cfg.firstname || cfg.formattedFirstName || '',
      lastname: cfg.lastname || cfg.memberLastName || '',
    },
    chatAvailable: cfg.isChatAvailable !== 'false',
    timestamp: new Date().toISOString(),
  });

  // Validate critical settings
  if (cfg.chatMode === 'cloud' && (!cfg.deploymentId || !cfg.orgId)) {
    console.error('[Genesys] Cloud chat mode requires deploymentId and orgId', {
      deploymentId: cfg.deploymentId,
      orgId: cfg.orgId,
    });
  }

  // === 1) Inject JSPF CSS ===
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
  const styleEl = document.createElement('style');
  styleEl.id = 'genesys-chat-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // === 2) Inject JSPF modals ===
  function injectModals() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
<div id="cobrowse-sessionConfirm" class="modal" style="background: rgba(50, 50, 50, 0.4); position: fixed; bottom: 0; top: 0; left: 0; right: 0">
  <div class="cobrowse-card" style="width:100%">
    <div style="text-align:left; margin-bottom:5px"><b>Are you on the phone with us?</b></div>
    <div>We can help better if we can see your screen.</div>
    <div style="float:left;margin-top:10px;color:rgb(0,122,255)">
      <a class="btn btn-secondary cobrowse-deny-button" onclick="showCobrowseContactUsModal()">No</a>
      <a class="btn btn-primary cobrowse-allow-button" style="margin-left:10px" onclick="showCobrowseModal()">Yes</a>
    </div>
  </div>
</div>

<div class="modal" id="cobrowse-sessionYesModal" tabindex="-1" role="dialog">
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

<div class="modal" id="cobrowse-contactUsScreen1" tabindex="-1" role="dialog" style="background: rgba(50, 50, 50, 0.4); position: fixed; bottom: 0; top: 0; left: 0; right: 0">
  <div style="color: #333; font-family:sans-serif; line-height:230%; position:fixed; padding:25px; background:white; top:50px; left:50%; width:75%; max-width:520px; transform:translateX(-50%);">
    <div class="scrSharingHead">How would you like to talk to us?</div>
    <div class="cobrowse-scrSharingSubHead">Choose an option to talk to our Member Services team</div>
    <button id="phoneDetails_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="cobrowseContactUsOption()">PHONE <span class="phoneIcon cobrowse-phoneicon"></span></button>
    ${isChatEligibleMember || isDemoMember ? `<button id="openChat_coBrowse" class="cobrowse-btn cobrowse-btn-secondary cobrowse-channelBtn" onclick="openWebChatWidget()">CHAT <span class="chatIcon cobrowse-chaticon"></span></button>` : ''}
  </div>
</div>

<div class="modal" id="cobrowse-contactUsScreen2" tabindex="-1" role="dialog">
  <div style="background: rgba(50, 50, 50, 0); position: fixed; bottom: 0; top: 0; left: 0; right: 0">
    <div style="color: #333; font-family:sans-serif; line-height:230%; position:fixed; padding:25px; background:white; border-radius:15px; top:50px; left:50%; width:75%; max-width:700px; transform:translateX(-50%);">
      <a class="cobrowse-chatClose" onclick="cobrowseClosePopup()">&times;</a>
      <div class="cobrowse-main-phone">
        <div class="cobrowse-phone-title"><span>Call us at</span></div>
        <div class="cobrowse-phone-number"><span class="href-col">${opsPhone}</span></div>
        <div class="cobrowse-phone-subtitle"><span>Once you're on the line with us, say "share your screen."</span></div>
      </div>
      <div class="cobrowse-availability">
        <div class="cobrowse-hours"><b>Hours of operation</b></div>
        <div class="hrs-opt">${opsPhoneHours}</div>
      </div>
      <div class="cobrowse-shareScreen-link"><span class="cobrowse-cobrowse-offer">Already on a call? <a class="cobrowse-cobrowse-link" onclick="cobrowseSessionModal()">Share your screen</a></span></div>
    </div>
  </div>
</div>
    `;
    document.body.appendChild(wrapper);
  }
  injectModals();

  // === 3) Audio alert ===
  const webAlert = new Audio();
  try {
    const audioPath = '/assets/genesys/sounds/bell.mp3';
    webAlert.src = audioPath;
    webAlert.muted = true;
    webAlert.addEventListener('error', (e) =>
      console.error('[Genesys] Audio error', e),
    );
  } catch (err) {
    webAlert.play = () => console.log('[Genesys] Audio unavailable');
  }

  // === 4) Utility & CobrowseIO boot-strap ===
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

  window.CobrowseIO = window.CobrowseIO || {};
  CobrowseIO.confirmSession = () =>
    buildConsent(
      "We'd like to share your screen",
      'Sharing only your BCBST.com tab. OK?',
    );
  CobrowseIO.confirmRemoteControl = () =>
    buildConsent("We'd like control", 'We can click to help. OK?');

  // === 5) jQuery loader & main init ===
  const loadJQ = (cb) => {
    const s = document.createElement('script');
    s.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    s.onload = () => cb(window.jQuery);
    document.head.appendChild(s);
  };
  Promise.resolve(window.jQuery || loadJQ).then(($) =>
    initializeChatWidget($, cfg),
  );

  // === 6) initializeChatWidget ===
  function initializeChatWidget($, cfg) {
    // 6.1) Constants & utilities
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

    // 6.2) setOptions
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

    // 6.3) Derived
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

    // 6.5) buildActiveChatInputs
    function buildActiveChatInputs() {
      const inputs = [];
      inputs.push({
        custom: isAmplifyMem
          ? "<tr class='activeChat'><td colspan='2' data-message='Questions or need advice? Let\'s talk.' style='font-size:30px'></td></tr>"
          : "<tr class='activeChat'><td colspan='2' data-message='We\'re right here <br>for you. Let\'s chat.' style='font-size:30px'></td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });
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
      // hidden: LOB, IsMedicalEligible, IsDentalEligible, IsVisionEligible, IDCardBotName
      [
        'LOB',
        'IsMedicalEligible',
        'IsDentalEligible',
        'IsVisionEligible',
        'IDCardBotName',
      ].forEach((key) => {
        const m = {
          LOB: defaultedClientID(calculatedCiciId),
          IsMedicalEligible: cfg.isMedical,
          IsDentalEligible: cfg.isDental,
          IsVisionEligible: cfg.isVision,
          IDCardBotName: routingchatbotEligible ? cfg.idCardChatBotName : '',
        }[key];
        inputs.push({ id: key, name: key, value: m, type: 'hidden' });
      });
      inputs.push({
        custom:
          "<tr class='activeChat'><td>By clicking on the button, you agree with our <a href='#' onclick='OpenChatDisclaimer();return false;'>Terms and Conditions</a> for chat.</td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });
      // demographics: firstName_field, lastname_field, memberId_field, groupId_field, planId_field, dob_field, inquiryType_field
      [
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
        { id: 'groupId_field', name: 'GROUP_ID', value: cfg.groupId },
        { id: 'planId_field', name: 'PLAN_ID', value: cfg.memberMedicalPlanID },
        { id: 'dob_field', name: 'MEMBER_DOB', value: cfg.memberDOB },
        {
          id: 'inquiryType_field',
          name: 'INQ_TYPE',
          value: getChatType(calculatedCiciId),
        },
      ].forEach((f) => inputs.push(f));
      return inputs;
    }

    // 6.6) Init Genesys widgets
    function initLocalWidgetConfiguration() {
      window._genesys = window._genesys || {};
      window._gt = window._gt || [];
      window._genesys.widgets = window._genesys.widgets || {};

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

      // CallUs
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

      // Chat plugins
      if (isChatEligibleMember || isDemoMember) {
        window._genesys.widgets.main.plugins.push(
          'cx-webchat-service',
          'cx-webchat',
        );
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
        window._genesys.widgets.main.i18n.en.webchat = isDemoMember
          ? {
              ...commonText,
              Errors: {
                StartFailed:
                  "<div class='modalTitle'>This is a Demo only chat.</div>",
              },
            }
          : commonText;
        if (isAmplifyMem) {
          const w = window._genesys.widgets.main.i18n.en.webchat;
          w.ChatButton = 'Chat with an advisor';
          w.ChatTitle = 'Chat with an advisor';
        }

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
    initLocalWidgetConfiguration();

    // === 7) CXBus subscriptions & after-hours ===
    window._genesys.widgets.onReady = (CXBus) => {
      const plugin = CXBus.registerPlugin('LocalCustomization');
      plugin.subscribe('WebChat.opened', () => {
        // after-hours
        const now = parseFloat(
          new Date()
            .toLocaleTimeString('en-US', {
              hour12: false,
              timeZone: 'America/New_York',
            })
            .replace(':', '.')
            .slice(0, 4),
        );
        let end = parseFloat(rawChatHrs.split('_').pop());
        if (end < 12) end += 12;
        if (cfg.isChatAvailable === 'true' && now > end) {
          const links = selfServiceLinks;
          links.forEach((e) => {
            if (e.value.startsWith('http'))
              $('.cx-form table').append(
                `<tr><td colspan='2'><a class='btn btn-secondary' href='${e.value}' target='_blank'>${e.key}</a></td></tr>`,
              );
          });
          $('.activeChat').hide();
          $('button[data-message="ChatFormSubmit"]').hide();
        }
      });

      // Message added handler
      plugin.subscribe('WebChat.messageAdded', (data) => {
        try {
          if (data && data.response && data.response.message) {
            // Unmute and play alert
            webAlert.muted = false;
            webAlert
              .play()
              .catch((e) => console.log('[Genesys] Audio play error:', e));

            // Focus chat if unfocused
            if (document.visibilityState !== 'visible') {
              console.log(
                '[Genesys] Document not visible, showing notification',
              );
            }
          }
        } catch (err) {
          console.error('[Genesys] Error in messageAdded handler:', err);
        }
      });

      // Error handler
      plugin.subscribe('WebChat.error', (error) => {
        console.error('[Genesys] WebChat error:', error);

        // Common error handling
        if (error && error.error === 'websocket.error') {
          // Handle websocket errors
          setTimeout(() => {
            try {
              CXBus.command('WebChat.close');
              // Could add reconnection logic here
            } catch (e) {
              console.error('[Genesys] Error during error recovery:', e);
            }
          }, 1000);
        }
      });

      // Form submitted handler
      plugin.subscribe('WebChat.submitted', (data) => {
        console.log('[Genesys] Chat form submitted:', data);
        // Enhancement opportunity: track form analytics
      });
    };

    // Cobrowse helpers
    window.startCoBrowseCall = () =>
      $('#cobrowse-sessionConfirm').modal({
        backdrop: 'static',
        keyboard: false,
      });
    window.openWebChatWidget = () => CXBus.command('WebChat.open');
    window.openCallUsWidget = () => CXBus.command('CallUs.open');
    window.showCobrowseModal = () => {
      $('#cobrowse-sessionConfirm').modal('hide');
      CobrowseIO.client().then((c) =>
        c
          .createSessionCode()
          .then(
            (code) =>
              (document.getElementById('cobrowse-sessionToken').textContent =
                code.match(/.{1,3}/g).join('-')),
          ),
      );
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };
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
      CobrowseIO.client().then((c) =>
        c
          .createSessionCode()
          .then(
            (code) =>
              (document.getElementById('cobrowse-sessionToken').textContent =
                code.match(/.{1,3}/g).join('-')),
          ),
      );
      $('#cobrowse-sessionYesModal').modal({ backdrop: 'static' });
    };
    window.endCoBrowseCall = () =>
      CobrowseIO.client()
        .then((c) => c.exitSession())
        .catch(console.error);

    // Add function to force create chat button for fallback
    window.forceCreateChatButton = function () {
      console.log('[Genesys] Forcing chat button creation');

      // Only create if it doesn't exist
      const existingButton = document.querySelector(
        '.cx-widget.cx-webchat-chat-button',
      );
      if (!existingButton) {
        const button = document.createElement('div');
        button.className =
          'cx-widget cx-webchat-chat-button fallback-chat-button';
        button.textContent = 'Chat Now';
        button.addEventListener('click', () => {
          try {
            if (window.CXBus && CXBus.command) {
              CXBus.command('WebChat.open');
            } else if (
              window._genesys &&
              window._genesys.widgets &&
              window._genesys.widgets.main
            ) {
              window._genesys.widgets.main.startChat();
            } else {
              alert('Chat is currently unavailable. Please try again later.');
            }
          } catch (err) {
            console.error('[Genesys] Error opening chat:', err);
            alert('Chat is currently unavailable. Please try again later.');
          }
        });
        document.body.appendChild(button);
        return true;
      }
      return false;
    };

    // Make accessible globally
    window._forceChatButtonCreate = window.forceCreateChatButton;
  }

  // === 8) Genesys script loader (legacy mode) ===
  (function () {
    // Only load in legacy mode
    if (cfg.chatMode === 'cloud') {
      console.log(
        '[Genesys] Cloud mode detected, skipping legacy script loading',
      );
      return;
    }

    console.log('[Genesys] Legacy mode detected, loading scripts');

    // Helper for loading scripts
    function loadScript(src, callback) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;

      if (callback) {
        script.onload = callback;
      }

      document.head.appendChild(script);
    }

    // Setup time check
    setTimeout(() => {
      if (!document.querySelector('.cx-widget.cx-webchat-chat-button')) {
        console.log(
          '[Genesys] No chat button found after timeout, forcing creation',
        );
        if (window.forceCreateChatButton) {
          window.forceCreateChatButton();
        }
      }
    }, 5000);

    // Add event listener for manual button creation
    document.addEventListener('genesys:create-button', () => {
      console.log('[Genesys] Received create-button event');
      if (window.forceCreateChatButton) {
        window.forceCreateChatButton();
      }
    });

    // Load widgets.min.js script if not using cloud mode
    const widgetsUrl =
      cfg.genesysWidgetUrl ||
      'https://apps.mypurecloud.com/widgets/9.0/widgets.min.js';
    loadScript(widgetsUrl, () => {
      console.log('[Genesys] Widgets script loaded');

      // Check for button after script loads
      setTimeout(() => {
        const button = document.querySelector(
          '.cx-widget.cx-webchat-chat-button',
        );
        if (!button) {
          console.log(
            '[Genesys] Button not found after widgets loaded, creating fallback',
          );
          if (window.forceCreateChatButton) {
            window.forceCreateChatButton();
          }
        }
      }, 2000);
    });
  })();
})(window, document);
