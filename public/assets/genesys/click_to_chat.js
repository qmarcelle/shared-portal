// chat-widget.js – Full conversion of legacy JSPF into a standalone
// JavaScript module. All server‑injected values are supplied at runtime
// through window.chatSettings (populated by a tiny JSP include).
// -------------------------------------------------------------------
// EXPECTED GLOBALS CREATED IN JSP PRIOR TO THIS SCRIPT TAG:
//   window.chatSettings = { ... }   // see chat-settings.jspf
//   jQuery (alias $)                // loaded globally
//   CXBus (Genesys) & CobrowseIO loaders will run here

// Safety wrapper to ensure jQuery is available
(function (window, document) {
  'use strict';

  // Log function for better debugging
  function logMessage(msg) {
    console.log('[GenesysChat] ' + msg);
  }

  // Function to check if jQuery is available
  function isJQueryAvailable() {
    return typeof window.jQuery !== 'undefined';
  }

  // Function to load jQuery if not already available
  function loadJQuery(callback) {
    logMessage('jQuery not found, loading it now...');
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = function () {
      logMessage('jQuery loaded successfully');
      callback(window.jQuery);
    };
    script.onerror = function () {
      console.error('[GenesysChat] Failed to load jQuery');
    };
    document.head.appendChild(script);
  }

  // Main initialization function that will run once jQuery is available
  function initializeChatWidget($, cfg) {
    logMessage('Initializing chat widget with jQuery and config');

    if (!cfg) {
      console.error('chat-widget.js: window.chatSettings missing. Aborting.');
      return;
    }
    if (Array.isArray(cfg) && !cfg[1]) {
      console.warn('[Genesys] chatSettings[1] missing — skipping widget init');
      return false;
    }

    /* -------------------------------------------------------------
     * 1.  CONSTANTS / ENUMS
     * ----------------------------------------------------------- */
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

    /* -------------------------------------------------------------
     * 2.  UTILITY FUNCTIONS (ported 1‑for‑1 from JSPF)
     * ----------------------------------------------------------- */
    const defaultedClientID = (id) => {
      const list = ['INDVMX', 'BA', 'INDV', 'CK', 'BC', 'DS', 'CT'];
      if (!id) return 'Default';
      return list.includes(id.trim()) ? id.trim() : 'Default';
    };

    const isDentalOnly = () => {
      return (
        !(
          cfg.isMedical === 'true' ||
          cfg.isVision === 'true' ||
          cfg.isWellnessOnly === 'true'
        ) && cfg.isDental === 'true'
      );
    };

    const chatType = (cid) => {
      switch (cid) {
        case clientIdConst.BlueCare:
        case clientIdConst.BlueCarePlus:
        case clientIdConst.CoverTN:
        case clientIdConst.CoverKids:
          return chatTypeConst.BlueCareChat;
        case clientIdConst.SeniorCare:
        case clientIdConst.BlueElite:
          return chatTypeConst.SeniorCareChat;
        case clientIdConst.Individual:
        default:
          return chatTypeConst.DefaultChat;
      }
    };

    const setOptions = (optVar) => {
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
      const push = (text, value) => opts.push({ text, value });

      switch (optVar) {
        case clientIdConst.BlueCare:
          push('Eligibility', 'Eligibility');
          push('TennCare PCP', 'TennCare PCP');
          push('Benefits', 'Benefits');
          push('Transportation', 'Transportation');
          if (
            cfg.isIDCardEligible === 'true' &&
            cfg.isChatbotEligible === 'true'
          )
            push('ID Card Request', 'OrderIDCard');
          break;
        case clientIdConst.BlueCarePlus:
        case clientIdConst.CoverTN:
        case clientIdConst.CoverKids:
          push('Eligibility', 'Eligibility');
          push('Benefits', 'Benefits');
          push('Claims Financial', 'Claims Financial');
          if (
            cfg.isIDCardEligible === 'true' &&
            cfg.isChatbotEligible === 'true'
          )
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
          if (
            cfg.isIDCardEligible === 'true' &&
            cfg.isChatbotEligible === 'true'
          )
            push('ID Card Request', 'OrderIDCard');
          push('Other', 'Other');
          break;
        case clientIdConst.Individual:
          push('Benefits and Coverage', 'Benefits and Coverage');
          push('New or Existing Claims', 'New Or Existing Claims');
          push('Premium Billing', 'Premium Billing');
          push('Deductibles', 'Deductibles');
          push('Pharmacy and Prescriptions', 'Pharmacy And Prescriptions');
          push('Find Care', 'Find Care');
          if (cfg.isDental === 'true') push('Dental', 'Dental');
          if (
            cfg.isIDCardEligible === 'true' &&
            cfg.isChatbotEligible === 'true'
          )
            push('ID Card Request', 'OrderIDCard');
          push('Other', 'Other');
          break;
        case clientIdConst.BlueElite:
          push('Address Update', 'Address Update');
          push('Bank Draft', 'Bank Draft');
          push('Premium Billing', 'Premium Billing');
          push('Report Date of Death', 'Report Date of Death');
          if (cfg.isDental === 'true') push('Dental', 'Dental');
          if (
            cfg.isIDCardEligible === 'true' &&
            cfg.isChatbotEligible === 'true'
          )
            push('ID Card Request', 'OrderIDCard');
          push('All Other', 'All Other');
          break;
        default:
          push('Benefits and Coverage', 'Benefits and Coverage');
          push('New or Existing Claims', 'New Or Existing Claims');
          push('Deductibles', 'Deductibles');
          push('Pharmacy and Prescriptions', 'Pharmacy And Prescriptions');
          push('Find Care', 'Find Care');
          if (cfg.isDental === 'true') push('Dental', 'Dental');
          if (cfg.isCobraEligible === 'true') push('COBRA', 'COBRA');
          if (
            cfg.isIDCardEligible === 'true' &&
            cfg.isChatbotEligible === 'true'
          )
            push('ID Card Request', 'OrderIDCard');
          push('Other', 'Other');
      }
      return opts;
    };

    /* -------------------------------------------------------------
     * 3.  DERIVED VALUES FROM cfg
     * ----------------------------------------------------------- */
    const calculatedCiciId = (() => {
      if (cfg.isBlueEliteGroup === 'true') return clientIdConst.BlueElite;
      if (cfg.groupType === 'INDV') return clientIdConst.Individual;
      return cfg.memberClientID;
    })();

    // Chat audio alert
    const webAlert = new Audio(
      '/wps/wcm/myconnect/member/26d05c9c-2858-4ba9-ad5a-64c914a01f79/bell.mp3?MOD=AJPERES&attachment=true&id=1677782288070',
    );
    webAlert.muted = true;

    /* -------------------------------------------------------------
     * 4.  Load CobrowseIO script (promise)
     * ----------------------------------------------------------- */
    (function (w, t, c, p, s, e) {
      p = new Promise(function (resolve) {
        w[c] = {
          client: function () {
            if (!s) {
              s = document.createElement(t);
              s.src = 'https://js.cobrowse.io/CobrowseIO.js';
              s.async = 1;
              e = document.getElementsByTagName(t)[0];
              e.parentNode.insertBefore(s, e);
              s.onload = function () {
                resolve(w[c]);
              };
            }
            return p;
          },
        };
      });
    })(window, 'script', 'CobrowseIO');

    CobrowseIO.license = cfg.coBrowseLicence;
    CobrowseIO.customData = {
      user_id: cfg.memberClientID,
      user_name: cfg.formattedFirstName,
    };
    CobrowseIO.capabilities = [
      'cursor',
      'keypress',
      'laser',
      'pointer',
      'scroll',
      'select',
    ];

    /* Consent & remoteConsent classes (verbatim HTML preserved) */
    function buildConsent(title, message) {
      return new Promise((resolve) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
        <div style="background: rgba(50,50,50,0.4); position: fixed; z-index:2147483647; inset:0;">
          <div class="cobrowse-card">
            <div style="text-align:left; margin-bottom:10px"><b>${title}</b></div>
            <div>${message}</div>
            <div style="float:left; color:rgb(0,122,255);">
              <a class="cobrowse-allow btn btn-primary" style="margin-left:10px;">Yes</a>
              <a class="cobrowse-deny btn btn-secondary">No</a>
            </div>
          </div>
        </div>`;
        wrapper.querySelector('.cobrowse-allow').onclick = () => {
          resolve(true);
          wrapper.remove();
          setTimeout(() => {
            document.querySelector('.cbio_session_controls').innerHTML =
              'End Screen Sharing';
          }, 400);
        };
        wrapper.querySelector('.cobrowse-deny').onclick = () => {
          resolve(false);
          wrapper.remove();
        };
        document.body.appendChild(wrapper);
      });
    }

    CobrowseIO.confirmSession = () =>
      buildConsent(
        "We'd like to share your screen",
        'Sharing your screen with us only lets us see your BCBST.com account in your browser. We cannot see anything else on your screen. Is that OK?',
      );

    CobrowseIO.confirmRemoteControl = () =>
      buildConsent(
        "We'd like to share control of your screen",
        'We can see your BCBST.com screen. If you agree to share control with us, we can help you further. Is that OK?',
      );

    /* -------------------------------------------------------------
     * 5.  Genesys widget INITIAL CONFIGURATION
     * ----------------------------------------------------------- */
    const gmsServicesConfig = {
      GMSChatURL: () =>
        cfg.isDemoMember === 'true'
          ? cfg.clickToChatDemoEndPoint
          : cfg.clickToChatEndpoint,
    };

    function initLocalWidgetConfiguration() {
      if (!window._genesys) window._genesys = {};
      if (!window._gt) window._gt = [];
      if (!window._genesys.widgets) window._genesys.widgets = {};

      // MAIN
      window._genesys.widgets.main = {
        debug: false,
        theme: 'light',
        lang: 'en',
        mobileMode: 'auto',
        downloadGoogleFont: false,
        plugins: [],
        i18n: { en: {} },
        header: { Authorization: 'Bearer ' + cfg.clickToChatToken },
      };

      /* CallUs i18n */
      window._genesys.widgets.main.i18n.en.callus = {
        CallUsTitle: 'Call Us',
        SubTitle: '',
        CancelButtonText: '',
        CoBrowseText:
          "<span class='cx-cobrowse-offer'>Already on a call? </br><a role='link' tabindex='0' class='cx-cobrowse-link'>Share your screen with us</a></span>",
        CoBrowse: 'Start screen sharing',
        CoBrowseWarning:
          'Co-browse allows your agent to see and control your desktop, to help guide you. When on a live call with an Agent, request a code to start Co-browse and enter it below. Not yet on a call? Just cancel out of this screen to return to Call Us page.',
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

      /* ---- CHAT ENABLED? ------------------------------------------------ */
      if (cfg.isChatEligibleMember === 'true' || cfg.isDemoMember === 'true') {
        const plugins = window._genesys.widgets.main.plugins;
        plugins.push('cx-webchat-service');
        plugins.push('cx-webchat');

        // Build webchat i18n depending on demo vs prod
        const commonText = {
          ChatButton: 'Chat with us',
          ChatTitle: 'Chat with us',
          BotConnected: '',
          BotDisconnected: '',
          ChatFormSubmit: 'START CHAT',
          ConfirmCloseWindow:
            "<div class='modalTitle'>We'll be right here if we can</br>help with anything else.</div></br></br>Closing this window will end the session.",
          ChatEndCancel: 'STAY',
          ChatEndConfirm: 'CLOSE CHAT',
          ConfirmCloseCancel: 'STAY',
          ActionsCobrowseStart: 'Share Screen',
          ConfirmCloseConfirm: 'CLOSE CHAT',
          ChatEndQuestion:
            "<div class='modalTitle'>We'll be right here if we can</br>help with anything else.</div></br></br>Closing this window will end our chat.",
        };

        if (cfg.isDemoMember === 'true') {
          window._genesys.widgets.main.i18n.en.webchat = {
            ...commonText,
            Errors: {
              StartFailed:
                "<div class='modalTitle'>This is a Demo only chat.</div>",
            },
          };
        } else {
          window._genesys.widgets.main.i18n.en.webchat = { ...commonText };
        }

        // Amplify label adjustments
        if (cfg.isAmplifyMem === 'true') {
          const w = window._genesys.widgets.main.i18n.en.webchat;
          w.ChatButton = 'Chat with an advisor';
          w.ChatTitle = 'Chat with an advisor';
        }

        /* Chat availability branches */
        if (cfg.isChatAvailable === 'false') {
          window._genesys.widgets.webchat = {
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
            form: {
              inputs: [
                {
                  custom:
                    "<tr><td colspan='2' class='i18n' data-message='You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.' style='font-family: universStd;'></td></tr>",
                },
                {
                  custom:
                    "<tr><td id='reachUs' colspan='2' class='i18n' style='font-family: universStd;'>Reach us " +
                    cfg.chatHours +
                    '</td></tr>',
                },
              ],
            },
          };
        } else {
          /* ---- ACTIVE CHAT FORM ---------------------------------------- */
          window._genesys.widgets.webchat = {
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
            userData: {
              firstname: cfg.formattedFirstName,
              lastname: cfg.memberLastName,
            },
            form: { inputs: buildActiveChatInputs() },
          };
        }
      }
    }

    // Build the giant inputs array (one‑for‑one with original JSPF)
    function buildActiveChatInputs() {
      const inputs = [];
      const amplify = cfg.isAmplifyMem === 'true';
      inputs.push({
        custom: amplify
          ? "<tr class='activeChat'><td colspan='2' class='i18n' data-message='Questions or need advice? Let&#39;s talk.' style='font-size:30px'></td></tr>"
          : "<tr class='activeChat'><td colspan='2' class='i18n' data-message='We&#39;re right here <br>for you. Let&#39;s chat.' style='font-size:30px'></td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      if (cfg.routingchatbotEligible !== true) {
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
        // Hidden fields for routing chatbot
        inputs.push({ name: 'SERV_TYPE', value: null, type: 'hidden' });
        inputs.push({
          name: 'ChatBotID',
          value: 'RoutingChatbot',
          type: 'hidden',
        });
      }

      inputs.push({
        id: 'LOB',
        name: 'LOB',
        value: defaultedClientID(calculatedCiciId),
        type: 'hidden',
      });
      inputs.push({
        id: 'IsMedicalEligible',
        name: 'IsMedicalEligible',
        value: cfg.isMedical,
        type: 'hidden',
      });
      inputs.push({
        id: 'IsDentalEligible',
        name: 'IsDentalEligible',
        value: cfg.isDental,
        type: 'hidden',
      });
      inputs.push({
        id: 'IsVisionEligible',
        name: 'IsVisionEligible',
        value: cfg.isVision,
        type: 'hidden',
      });
      inputs.push({
        id: 'IDCardBotName',
        name: 'IDCardBotName',
        value: cfg.routingchatbotEligible ? cfg.idCardChatBotName : '',
        type: 'hidden',
      });
      inputs.push({
        custom:
          "<tr class='activeChat'><td>By clicking on the button, you agree with our <a href='#' onclick='OpenChatDisclaimer(); return false;'>Terms and Conditions</a> for chat.</td></tr>",
      });
      inputs.push({
        custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>",
      });

      // Member demographic hidden fields
      inputs.push({
        id: 'firstName_field',
        name: 'firstname',
        value: cfg.formattedFirstName,
        type: 'hidden',
      });
      inputs.push({
        id: 'lastname_field',
        name: 'lastname',
        value: cfg.memberLastName,
        type: 'hidden',
      });
      inputs.push({
        id: 'memberId_field',
        name: 'MEMBER_ID',
        value: cfg.subscriberID + '-' + cfg.sfx,
        type: 'hidden',
      });
      inputs.push({
        id: 'groupId_field',
        name: 'GROUP_ID',
        value: cfg.groupId,
        type: 'hidden',
      });
      inputs.push({
        id: 'planId_field',
        name: 'PLAN_ID',
        value: cfg.memberMedicalPlanID,
        type: 'hidden',
      });
      inputs.push({
        id: 'dob_field',
        name: 'MEMBER_DOB',
        value: cfg.memberDOB,
        type: 'hidden',
      });
      inputs.push({
        id: 'inquiryType_field',
        name: 'INQ_TYPE',
        value: chatType(calculatedCiciId),
        type: 'hidden',
      });

      return inputs;
    }

    /* -------------------------------------------------------------
     * 6.  INITIALISE WIDGET CONFIG
     * ----------------------------------------------------------- */
    initLocalWidgetConfiguration();

    /* -------------------------------------------------------------
     * 7.  LOCAL CUSTOM PLUGIN (CXBus subscriptions)
     * ----------------------------------------------------------- */
    let localWidgetPlugin;

    window._genesys.widgets.onReady = function (CXBus) {
      localWidgetPlugin = CXBus.registerPlugin('LocalCustomization');

      /* WebChat.opened */
      localWidgetPlugin.subscribe('WebChat.opened', function () {
        customizeAmplify();
        // UI tweaks & After‑hours insertion (replicated from JSPF)
        const nowNY = new Date().toLocaleTimeString('en-US', {
          hour12: false,
          timeZone: 'America/New_York',
        });
        const currentHrMin = parseFloat(
          nowNY.split(':')[0] + '.' + nowNY.split(':')[1],
        );
        let endHrMin = parseFloat(cfg.rawChatHours.split('_').pop());
        if (endHrMin < 12 && endHrMin !== 24) endHrMin += 12;

        if (cfg.isChatAvailable === 'true' && currentHrMin > endHrMin) {
          const tempForm = { inputs: [] };
          tempForm.inputs.push({
            custom:
              "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.</td></tr>",
          });
          tempForm.inputs.push({
            custom:
              "<tr><td id='reachUs' colspan='2' class='i18n' style='font-family: universStd;'>Reach us " +
              cfg.chatHours +
              '</td></tr>',
          });
          addAfterHoursLinks(tempForm);
          $('.activeChat').hide();
          tempForm.inputs.forEach((el) => {
            if (el.custom)
              $('.cx-form > .cx-form-inputs > table').append(el.custom);
          });
          $(
            '.cx-button-group.cx-buttons-binary button[data-message="ChatFormSubmit"]',
          ).hide();
        }

        // senior care tweaks
        if (calculatedCiciId === clientIdConst.SeniorCare) {
          $('#question_field').hide();
          $('button[data-message="ChatFormSubmit"]')
            .removeAttr('disabled')
            .attr({
              id: 'startChat',
              class: 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide',
            });
        }

        if (cfg.isChatAvailable === 'false') {
          $('.cx-button-group.cx-buttons-binary').hide();
        }
      });

      /* WebChat.messageAdded */
      localWidgetPlugin.subscribe('WebChat.messageAdded', function (e) {
        $('.cx-avatar.bot').find('svg').replaceWith(chatBotAvatar);
        webAlert.muted = false;
        if (e.data.message.type === 'Agent') webAlert.play();
      });

      localWidgetPlugin.subscribe('WebChat.errors', OpenChatConnectionError);
      localWidgetPlugin.subscribe('WebChat.submitted', function () {
        applyMessageScaler();
        customizeAmplify();
      });

      localWidgetPlugin.subscribe('CallUs.opened', function () {
        $('.cx-phone-number').after(
          "<div class='cx-phone-subtitle'><span>Once you&rsquo;re on the line with us, say you want to &ldquo;share you screen.&rdquo;</span></div>",
        );
        $('.cx-call-us .cx-availability .cx-hours').prepend(
          '<span><b>Hours of operation</b></span>',
        );
        $('.cx-call-us .cx-availability').after(
          "<div class='cx-shareScreen-link'><span class='cx-cobrowse-offer' style='display: inline;'>Already on a call? <br><a role='link' href='javascript:startCoBrowseCall()' tabindex='0' class='cx-cobrowse-link'>Share your screen with us</a></span></div>",
        );
      });
    };

    /* -------------------------------------------------------------
     * 8.  GLOBAL HELPERS EXPOSED (for HTML modal buttons)
     * ----------------------------------------------------------- */
    window.startCoBrowseCall = function () {
      $('#cobrowse-sessionConfirm').modal({
        backdrop: 'static',
        keyboard: false,
      });
    };
    window.endCoBrowseCall = function () {
      try {
        CobrowseIO.client().then((cb) => cb.exitSession());
      } catch (e) {
        console.error('Co-browse API unavailable', e);
      }
    };

    /* ... additional helpers OpenChatDisclaimer, CloseChatDisclaimer, etc. remain unchanged ... */

    /* -------------------------------------------------------------
     * 9.  STYLE / MODAL HTML
     * ----------------------------------------------------------- */
    // NOTE: Original <style> block and modal <div id="cobrowse-sessionConfirm" ...>
    // should remain in the JSP/HTML template, or be migrated to dedicated
    // CSS/HTML partials.  They are not injected via JS in this file.

    /* -------------------------------------------------------------
     * 10. VISUAL TWEAKS
     * ----------------------------------------------------------- */
    function customizeAmplify() {
      if (cfg.isAmplifyMem === 'true') {
        $('.cx-webchat').addClass('amplifyHealth');
        $('div.cx-icon, span.cx-icon').html(
          '<img src="/wps/wcm/myconnect/member/029bc5b8-e440-485e-89f5-6bdc04a0325e/Chat-Icon-40x40.svg?MOD=AJPERES&ContentCache=NONE&CACHE=NONE&CVID=oe5Lict" alt="" style="width:45px;height:45px;padding-bottom:10px;padding-right:10px;">',
        );
      }
    }

    function applyMessageScaler() {
      const t = chatType(calculatedCiciId);
      const webchatDiv = $('.cx-webchat');
      const transcriptDiv = $('.cx-webchat .cx-body .cx-transcript');
      if (
        webchatDiv &&
        (t === chatTypeConst.SeniorCareChat || t === chatTypeConst.BlueCareChat)
      )
        webchatDiv.addClass(
          'webchatScaler' +
            (t === chatTypeConst.SeniorCareChat ? ' webchatSenior' : ''),
        );
      if (transcriptDiv) transcriptDiv.addClass('transcriptScaler');
    }

    /* Dummy SVG avatar string extraction */
    const chatBotAvatar = function () {
      /* <svg ...> ... full bot svg here ... */
    }
      .toString()
      .match(/[^]*\/\*([^]*)\*\/\}$/)[1];

    /* Error overlay helpers */
    function OpenChatConnectionError() {
      localWidgetPlugin.command('WebChat.showOverlay', {
        html: $(
          "<div><p class='termsNConditions'><span class='modalTitle'>Error Connecting to Chat Server</span><br><br>We're sorry for the inconvenience, please logout and log back in.</p></div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatConnectionError();'>CLOSE</button></div>",
        ),
        hideFooter: false,
      });
    }

    window.CloseChatConnectionError = function () {
      localWidgetPlugin.command('WebChat.hideOverlay');
    };

    /* Add‑After‑Hours Links helper (selfServiceLinks loop converted to cfg.selfServiceLinks) */
    function addAfterHoursLinks(form) {
      form.inputs.push({
        custom:
          "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>In the meantime, you can use your BCBST.com account to:</td></tr>",
      });
      (cfg.selfServiceLinks || []).forEach(({ key, value }) => {
        const href = value.startsWith('http') ? value : value; // assume value already URL‑resolved server‑side
        form.inputs.push({
          custom: `<tr><td colspan='2'><a style='margin:10px 0; font-size:13px; text-transform:capitalize;' class='btn btn-secondary buttonWide' href='${href}' target='_blank'>${key}</a></td></tr>`,
        });
      });
    }

    /* Ensure bell audio can play (Chrome policy) */
    $(document).on('click', '.cx-widget.cx-webchat-chat-button', () => {
      if (webAlert.muted) webAlert.play();
    });

    function enableChatButton() {
      if (
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.webchat
      ) {
        window._genesys.widgets.webchat.chatButton = {
          enabled: true,
          openDelay: 100,
          effectDuration: 200,
          hideDuringInvite: false,
        };

        console.log('Chat button enabled and configured.');
      } else {
        console.error('Genesys widget is not initialized.');
      }
    }

    // Call the function to enable the chat button
    enableChatButton();
  }

  // Start the initialization process
  if (isJQueryAvailable()) {
    logMessage('jQuery already available, initializing chat widget');
    initializeChatWidget(window.jQuery, window.chatSettings);
  } else {
    logMessage('jQuery not available, will load it first');
    loadJQuery(function ($) {
      // Ensure $ is globally available as expected by the script
      window.jQuery = $;
      window.$ = $;
      logMessage('jQuery globally assigned, initializing chat widget');
      initializeChatWidget($, window.chatSettings);
    });
  }
})(window, document);

/**
 * click_to_chat.js - Client-side implementation for Genesys chat
 * This is a client-side version of the JSP fragment for initializing the Genesys chat widget
 */

(function () {
  // Initialize global variables that would normally come from the server
  // These will be populated from the API response
  window.clickToChatToken = '';
  window.clickToChatEndpoint = '';
  window.coBrowseLicence = '';
  window.cobrowseSource = '';
  window.cobrowseURL = '';
  window.opsPhone = '';
  window.opsPhoneHours = '';
  window.routingchatbotEligible = false;

  // Add a custom logger for tracking Genesys script loading
  const genesysLogger = {
    log: function (message, data) {
      console.log(`[GenesysChat] ${message}`, data || '');
    },
    error: function (message, error) {
      console.error(`[GenesysChat Error] ${message}`, error || '');
    },
    warn: function (message, data) {
      console.warn(`[GenesysChat Warning] ${message}`, data || '');
    },
    info: function (message, data) {
      console.info(`[GenesysChat Info] ${message}`, data || '');
    },
  };

  // Sound for chat notifications (adapt as needed)
  window.webAlert = new Audio('/assets/sounds/bell.mp3');
  window.webAlert.muted = true;

  // Initialize Genesys chat once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // This function is called when the page loads
    genesysLogger.log('DOM Content Loaded, initializing Genesys chat widget');

    // Check if we already have the Genesys scripts loaded
    const hasGenesysWidget = typeof window._genesys !== 'undefined';
    const hasCXBus = typeof window.CXBus !== 'undefined';

    genesysLogger.info('Initial Genesys state check:', {
      hasGenesysWidget,
      hasCXBus,
      hasWindowGenesys: typeof window.Genesys !== 'undefined',
      documentReadyState: document.readyState,
    });

    // The actual initialization will happen via the LegacyChatWrapper component
    // which sets up the proper _genesys object

    // Set up Global CXBus event handlers if not already initialized
    if (window.CXBus && typeof window.CXBus.subscribe === 'function') {
      genesysLogger.log('CXBus found, setting up event handlers');

      // These event handlers match what would be in the original click_to_chat.jspf

      // Handle new messages from agent
      window.CXBus.subscribe('WebChat.messageAdded', function (data) {
        genesysLogger.log('Message added:', data);
        // Play sound for new messages if from agent
        if (data && data.type === 'Message' && data.from && data.from.type !== 'Customer') {
          try {
            webAlert.muted = false;
            webAlert.play().catch(function (error) {
              genesysLogger.error('Audio play failed:', error);
            });
          } catch (e) {
            genesysLogger.error('Unable to play notification sound:', e);
          }
        }
      });

      // Handle chat session ending
      window.CXBus.subscribe('WebChat.ended', function () {
        genesysLogger.log('Chat session ended');
      });
    } else {
      genesysLogger.warn('CXBus not found on page load');
    }
  });

  // Add a MutationObserver to detect when Genesys scripts are injected into the page
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const scriptNodes = addedNodes.filter(
          (node) =>
            node.nodeType === 1 &&
            node.tagName === 'SCRIPT' &&
            (node.src?.includes('genesys') || node.innerHTML?.includes('genesys')),
        );

        if (scriptNodes.length > 0) {
          scriptNodes.forEach((script) => {
            genesysLogger.info('Genesys script detected:', {
              src: script.src,
              hasContent: !!script.innerHTML,
            });
          });
        }
      }
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Periodically check for Genesys objects
  const checkGenesysInterval = setInterval(function () {
    const hasGenesys = typeof window.Genesys !== 'undefined';
    const hasGenesysUnder = typeof window._genesys !== 'undefined';
    const hasCXBus = typeof window.CXBus !== 'undefined';

    if (hasGenesys || hasGenesysUnder || hasCXBus) {
      genesysLogger.log('Genesys object detected', {
        hasGenesys,
        hasGenesysUnder,
        hasCXBus,
      });

      if (hasCXBus) {
        genesysLogger.info('CXBus plugins:', window.CXBus.getAllPlugins?.() || 'Not available');
      }

      if (hasGenesysUnder) {
        genesysLogger.info('_genesys configuration:', {
          hasWidgets: typeof window._genesys.widgets !== 'undefined',
          widgetKeys: window._genesys.widgets ? Object.keys(window._genesys.widgets) : [],
        });
      }

      clearInterval(checkGenesysInterval);
    }
  }, 1000);

  // Export any utility functions needed for the chat
  window.startChat = function () {
    genesysLogger.log('startChat called');
    if (window.CXBus && typeof window.CXBus.command === 'function') {
      genesysLogger.log('Opening WebChat via CXBus');
      window.CXBus.command('WebChat.open');
    } else {
      genesysLogger.error('Cannot open chat - CXBus not available');
    }
  };

  window.endChat = function () {
    genesysLogger.log('endChat called');
    if (window.CXBus && typeof window.CXBus.command === 'function') {
      genesysLogger.log('Closing WebChat via CXBus');
      window.CXBus.command('WebChat.close');
    } else {
      genesysLogger.error('Cannot close chat - CXBus not available');
    }
  };
})();

/**
 * Genesys chat button configuration
 * This file enables and customizes the chat button functionality
 */

// Configuration function for the Genesys chat button
function enableChatButton() {
  console.log('[Genesys] Attempting to configure chat button...');
  
  // Check if Genesys widgets are available
  if (window._genesys && window._genesys.widgets && window._genesys.widgets.webchat) {
    // Configure the chat button
    window._genesys.widgets.webchat.chatButton = {
      enabled: true,
      openDelay: 100,
      effectDuration: 200,
      hideDuringInvite: false,
      template: '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
    };

    // Configure button position and appearance
    window._genesys.widgets.webchat.position = {
      bottom: { px: 20 },
      right: { px: 20 },
      width: { pct: 50 },
      height: { px: 400 }
    };

    console.log('[Genesys] Chat button successfully configured');
    
    // Force button visibility if it hasn't appeared
    setTimeout(function() {
      // Add class to ensure button visibility
      const chatButton = document.querySelector('.cx-webchat-chat-button');
      if (chatButton) {
        chatButton.style.display = 'flex';
        chatButton.style.opacity = '1';
        console.log('[Genesys] Enhanced chat button visibility');
      } else {
        console.log('[Genesys] Chat button not found in DOM');
      }
    }, 2000);
    
    return true;
  } else {
    console.warn('[Genesys] Genesys widgets not fully initialized, will retry...');
    return false;
  }
}

// Track retry count to prevent infinite loops
let retryCount = 0;
const MAX_RETRIES = 10;

// Function to initialize chat when the page loads
function initializeChatButton() {
  console.log('[Genesys] Initializing chat button...');
  
  if (retryCount >= MAX_RETRIES) {
    console.warn('[Genesys] Maximum retry attempts reached. Chat button initialization failed.');
    return;
  }
  
  if (!enableChatButton()) {
    // If enableChatButton fails, retry after a delay with exponential backoff
    retryCount++;
    const delay = Math.min(1000 * Math.pow(1.5, retryCount), 10000); // Exponential backoff with 10s max
    console.log(`[Genesys] Retrying chat button initialization in ${delay/1000} seconds... (attempt ${retryCount} of ${MAX_RETRIES})`);
    setTimeout(initializeChatButton, delay);
  }
}

// Clear any potentially existing intervals to prevent duplicates
if (window._genesysChatButtonTimer) {
  clearTimeout(window._genesysChatButtonTimer);
  window._genesysChatButtonTimer = null;
}

// Track if we've already registered commands to prevent duplicates
let commandsRegistered = false;

// Function to register the chat commands with CXBus when available
function registerChatCommands() {
  if (commandsRegistered) return;
  
  if (window.CXBus && typeof window.CXBus.registerPlugin === 'function') {
    console.log('[Genesys] Registering chat commands with CXBus');
    
    try {
      window.CXBus.registerPlugin('ChatButton', {
        open: function() {
          console.log('[Genesys] Opening chat via CXBus command');
          if (window.CXBus && typeof window.CXBus.command === 'function') {
            window.CXBus.command('WebChat.open');
          }
        }
      });
      commandsRegistered = true;
    } catch (e) {
      console.error('[Genesys] Error registering plugin:', e);
    }
  } else {
    console.log('[Genesys] CXBus not available yet, will try again');
    if (window._genesysCXBusRetryCount < 5) {
      window._genesysCXBusRetryCount++;
      setTimeout(registerChatCommands, 2000);
    }
  }
}

// Initialize counter
window._genesysCXBusRetryCount = 0;

// Expose global functions for manual triggering if needed
window.openGenesysChat = function() {
  console.log('[Genesys] Manual chat open requested');
  
  if (window.CXBus && typeof window.CXBus.command === 'function') {
    window.CXBus.command('WebChat.open');
  } else {
    console.error('[Genesys] CXBus not available for manual triggering');
  }
};

// Single event listener function that we can add/remove
function genesysDOMLoadedHandler() {
  console.log('[Genesys] DOM fully loaded, checking for chat button initialization');
  
  // Check all required components
  const hasGenesys = typeof window._genesys !== 'undefined';
  const hasCXBus = typeof window.CXBus !== 'undefined';
  const hasJQuery = typeof window.jQuery !== 'undefined';
  
  console.log('[Genesys] Components check:', {
    hasGenesys,
    hasCXBus,
    hasJQuery,
    hasWebChat: hasGenesys && typeof window._genesys.widgets?.webchat !== 'undefined'
  });
  
  // Only start initialization if we haven't reached max retries
  if (retryCount < MAX_RETRIES) {
    // Additional check after DOM is fully loaded
    setTimeout(function() {
      if (!document.querySelector('.cx-webchat-chat-button')) {
        console.log('[Genesys] Chat button not found after DOM load, initializing again');
        initializeChatButton();
      }
    }, 2000);
  }
  
  // Register commands if CXBus is available
  registerChatCommands();
}

// Clean up any existing listeners to prevent duplicates
if (window._genesysDOMLoadedHandler) {
  document.removeEventListener('DOMContentLoaded', window._genesysDOMLoadedHandler);
}

// Store reference to handler for cleanup
window._genesysDOMLoadedHandler = genesysDOMLoadedHandler;

// Add event listener
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', genesysDOMLoadedHandler);
} else {
  // DOM already loaded, call directly
  genesysDOMLoadedHandler();
}

// Start the initialization process only once
if (!window._genesysInitializationStarted) {
  window._genesysInitializationStarted = true;
  initializeChatButton();
  registerChatCommands();
}
