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
    const chatBotAvatar = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="50px" height="50px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Icon-Enterprise/Primary/Chat-Received-Sent</title>
    <defs>
        <polygon id="path-1" points="0 0 15.9999002 0 15.9999002 16 0 16"></polygon>
    </defs>
    <g id="Icon-Enterprise/Primary/Chat-Received-Sent" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Icon-Chat">
            <g>
                <g id="Stroke-9" transform="translate(0, 1.39)">
                    <g id="Stroke-5" transform="translate(16.8941, 17.2051)" fill="#5DC1FD" fill-rule="nonzero">
                        <path d="M6.44080549,0 L25.2509949,0 C26.9654195,0 28.6086936,0.684445468 29.8160751,1.90132157 C31.0233532,3.11801588 31.6949511,4.766575 31.6817757,6.48074706 L31.6817757,17.8370844 C31.6817757,21.9435577 30.143454,24.08374 27.0668106,24.2576312 L27.0668106,29.2736822 C27.0751457,29.7830024 26.7839268,30.2498436 26.3228222,30.4663261 C25.8617215,30.6828048 25.316516,30.6086539 24.9299756,30.2768924 L18.0278845,24.2576312 L6.44080549,24.2576312 C2.88929311,24.2631803 0.00573348958,21.3885986 0,17.8370882 L0,6.48074515 C-0.0131888312,4.76483566 0.659781048,3.11474576 1.86937447,1.89761517 C3.07896981,0.680484581 4.72484816,-0.0027223707 6.4408074,0 L6.44080549,0 Z" id="Path-263"></path>
                    </g>
                    <g id="Fill-1" transform="translate(0, 1.9262)" fill="#5DC1FD">
                        <path d="M32.4839475,0 L8.27648418,0 C3.70550809,0 0,3.70550905 0,8.27648466 L0,22.9735128 C0,28.2704615 1.97966816,31.0292895 5.93900448,31.249997 L5.93900448,37.6805742 C5.93584438,38.3347136 6.31594069,38.9301171 6.91063666,39.2025955 C7.50533264,39.4750777 8.20447355,39.3741573 8.69783446,38.9446174 L17.5762432,31.249997 L32.4839475,31.249997 C37.0549212,31.249997 40.7604317,27.5444903 40.7604317,22.9735166 L40.7604317,8.27648466 C40.7604317,3.70550953 37.054925,0 32.4839475,0" id="Path-264"></path>
                    </g>
                    <g id="Stroke-5" transform="translate(19.0008, 15.0381)" fill-rule="nonzero">
                        <path d="M6.73154047,0.752407653 L24.227527,0.752407653 C27.5325976,0.752407653 30.219372,3.4169781 30.2467958,6.72172153 L30.2467958,17.3254426 C30.2467958,21.1443288 28.8155471,23.1507492 25.9530497,23.3447038 L25.9530497,27.9795339 C25.95928,28.4571058 25.6825958,28.8932013 25.2478666,29.0910007 C24.8131373,29.2888039 24.3025848,29.2109026 23.9466293,28.892455 L17.5361167,23.3447038 L6.73154047,23.3447038 C3.40719735,23.3447038 0.712279245,20.6497895 0.712279245,17.3254426 L0.712279245,6.72150913 C0.739819842,3.41676953 3.42668606,0.752407653 6.73154238,0.752407653 L6.73154047,0.752407653 Z" id="Path-265" fill="#FFFFFF"></path>
                        <path d="M24.6990399,29.9058136 C24.2311922,29.8987682 23.7805161,29.7284348 23.4249625,29.4242731 L17.2251231,24.0571001 L6.73154338,24.0571001 C3.01610389,24.051574 0.00552419254,21.0409943 0,17.3255567 L0,6.72162707 C0.00553758684,3.00781977 3.01772842,0 6.73153955,0 L24.2275299,0 C26.0180494,-0.0105573225 27.7390449,0.692563129 29.0098542,1.95396188 C30.2806634,3.21535681 30.9965581,4.93107687 30.9991987,6.72162707 L30.9991987,17.3255605 C30.9991987,22.2111931 28.0798572,23.555495 26.7054603,23.9266855 L26.7054603,27.9395263 C26.6994788,28.7142833 26.234532,29.4117016 25.5216681,29.7152012 C25.2640842,29.8363737 24.983665,29.9013475 24.6990399,29.9058136 Z M6.73154338,1.50493324 C3.84880655,1.50493324 1.51034715,3.83891511 1.50481722,6.72163472 L1.50481722,17.3255605 C1.51033758,20.2099123 3.84718966,22.5467663 6.73154146,22.5522848 L17.5060207,22.5522848 C17.6677895,22.5486492 17.8263129,22.5979708 17.9574661,22.6927336 L24.3679787,28.2404848 C24.5012941,28.3597438 24.6924499,28.3890429 24.8553629,28.3151867 C25.0182758,28.2413344 25.1222194,28.0782568 25.1203863,27.8993932 L25.1203863,23.3046924 C25.1195023,22.9079762 25.4267982,22.5787328 25.8226342,22.5522848 C25.9731173,22.5522848 29.4141248,22.2412882 29.4141248,17.3255605 L29.4141248,6.72162707 C29.4085948,3.83890746 27.0701297,1.50493324 24.1874005,1.50493324 L6.73154338,1.50493324 Z" id="Path-266" fill="#161616"></path>
                    </g>
                    <path d="M33.7680553,0.752407653 L10.8747988,0.752407653 C6.55705681,0.752407653 3.05529134,4.24969272 3.04975902,8.56742419 L3.04975902,22.4518478 C3.04975902,27.4545224 4.92241788,30.0628687 8.66773559,30.2768866 L8.66773559,36.2961479 C8.66911233,36.9101886 9.02722332,37.4674527 9.5851926,37.7238158 C10.1431609,37.9801789 10.7992502,37.8888987 11.2660502,37.4899628 L19.6528881,30.226725 L33.6978309,30.226725 C35.7722485,30.2267231 37.7615471,29.4019785 39.2274309,27.934208 C40.6933148,26.4664452 41.5155029,24.4760884 41.5128458,22.4016823 L41.5128458,8.56741845 C41.5128458,4.27826994 38.0564016,0.790773715 33.7677415,0.752407653 L33.7680553,0.752407653 Z" id="Path-267" fill="#FFFFFF" fill-rule="nonzero"></path>
                    <path d="M10.2728728,38.6737918 C9.92728641,38.6757305 9.5852591,38.6039065 9.26966257,38.4630788 C8.43988369,38.0867716 7.90924836,37.257408 7.91532746,36.3463046 L7.91532841,30.8988729 C6.26003148,30.5176539 2.29735137,28.8924525 2.29735137,22.4518429 L2.29735137,8.56741546 C2.30288752,3.83414015 6.14152062,0 10.8747993,0 L33.7680558,0 C38.497419,0.00552550805 42.3299458,3.8380532 42.3354757,8.56741642 L42.3354757,22.4518448 C42.3299573,27.1828383 38.4990378,31.0182429 33.768052,31.0292913 L19.9638832,31.0292913 L11.7877204,38.0517627 C11.3778931,38.4405725 10.8376779,38.6623821 10.2728737,38.6737918 L10.2728728,38.6737918 Z M10.9048953,1.55497445 C7.03786965,1.58230505 3.90975496,4.71041925 3.88242389,8.57744492 L3.88242389,22.4518448 C3.88242389,29.1633216 8.58747933,29.4743163 8.78812213,29.524476 C9.18791619,29.5458303 9.50097163,29.8765203 9.50040141,30.2768856 L9.50040141,36.2961449 C9.49384873,36.619556 9.67973867,36.9160485 9.9736967,37.0510515 C10.2676547,37.1860546 10.6136889,37.1338474 10.8547346,36.9181303 L19.1914128,29.7050541 C19.327895,29.5871479 19.5026332,29.5229586 19.6829856,29.5244779 L33.7279265,29.524476 C37.6063306,29.5244779 40.7503979,26.3804106 40.7503979,22.5020065 L40.7503979,8.56741546 C40.7503979,4.68901133 37.6063306,1.54494403 33.7279265,1.54494403 L10.9048953,1.55497445 Z" id="Path-268" fill="#161616" fill-rule="nonzero"></path>
                </g>
                <g id="50x50-Spacers" fill-rule="nonzero">
                    <rect id="Rectangle-112" x="0" y="0" width="50" height="50"></rect>
                </g>
            </g>
            <g id="Icon/Secondary" transform="translate(15.0001, 9)">
                <g id="Group-6" transform="translate(0, 0)">
                    <g id="Group-3">
                        <mask id="mask-2" fill="white">
                            <use xlink:href="#path-1"></use>
                        </mask>
                        <g id="Clip-2"></g>
                        <path d="M7.99800021,15.9999998 C12.4160002,16.001 15.9990002,12.42 16,8.002 C16.0010002,3.583 12.4200002,0.001 8.00100021,-2.09387736e-07 C3.58300021,-0.001 0.00100020939,3.58 0,7.998 C-0.000999790612,12.417 3.58000021,15.999 7.99800021,15.9999998" id="Fill-1" fill="#5DC1FD" mask="url(#mask-2)"></path>
                    </g>
                    <path d="M6.97790021,10.8218 L4.40690021,8.7508 C4.07590021,8.4838 4.02290021,7.9998 4.28990021,7.6688 C4.55690021,7.3368 5.04290021,7.2848 5.37190021,7.5518 L7.34990021,9.1438 L10.5149002,5.2898 C10.7849002,4.9608 11.2699002,4.9128 11.5989002,5.1828 C11.9269002,5.4528 11.9749002,5.9378 11.7059002,6.2668 L8.05590021,10.7108 C7.90290021,10.8958 7.68290021,10.9918 7.45990021,10.9918 C7.29090021,10.9918 7.11990021,10.9358 6.97790021,10.8218 Z" id="Fill-4" fill="#FFFFFF"></path>
                </g>
            </g>
        </g>
    </g>
</svg>`;

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
        if (
          data &&
          data.type === 'Message' &&
          data.from &&
          data.from.type !== 'Customer'
        ) {
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
            (node.src?.includes('genesys') ||
              node.innerHTML?.includes('genesys')),
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
        genesysLogger.info(
          'CXBus plugins:',
          window.CXBus.getAllPlugins?.() || 'Not available',
        );
      }

      if (hasGenesysUnder) {
        genesysLogger.info('_genesys configuration:', {
          hasWidgets: typeof window._genesys.widgets !== 'undefined',
          widgetKeys: window._genesys.widgets
            ? Object.keys(window._genesys.widgets)
            : [],
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
  if (
    window._genesys &&
    window._genesys.widgets &&
    window._genesys.widgets.webchat
  ) {
    // Configure the chat button
    window._genesys.widgets.webchat.chatButton = {
      enabled: true,
      openDelay: 100,
      effectDuration: 200,
      hideDuringInvite: false,
      template:
        '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
    };

    // Configure button position and appearance
    window._genesys.widgets.webchat.position = {
      bottom: { px: 20 },
      right: { px: 20 },
      width: { pct: 50 },
      height: { px: 400 },
    };

    console.log('[Genesys] Chat button successfully configured');

    // Force button visibility if it hasn't appeared
    setTimeout(function () {
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
    console.warn(
      '[Genesys] Genesys widgets not fully initialized, will retry...',
    );
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
    console.warn(
      '[Genesys] Maximum retry attempts reached. Chat button initialization failed.',
    );
    return;
  }

  if (!enableChatButton()) {
    // If enableChatButton fails, retry after a delay with exponential backoff
    retryCount++;
    const delay = Math.min(1000 * Math.pow(1.5, retryCount), 10000); // Exponential backoff with 10s max
    console.log(
      `[Genesys] Retrying chat button initialization in ${delay / 1000} seconds... (attempt ${retryCount} of ${MAX_RETRIES})`,
    );
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
        open: function () {
          console.log('[Genesys] Opening chat via CXBus command');
          if (window.CXBus && typeof window.CXBus.command === 'function') {
            window.CXBus.command('WebChat.open');
          }
        },
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
window.openGenesysChat = function () {
  console.log('[Genesys] Manual chat open requested');

  if (window.CXBus && typeof window.CXBus.command === 'function') {
    window.CXBus.command('WebChat.open');
  } else {
    console.error('[Genesys] CXBus not available for manual triggering');
  }
};

// Single event listener function that we can add/remove
function genesysDOMLoadedHandler() {
  console.log(
    '[Genesys] DOM fully loaded, checking for chat button initialization',
  );

  // Check all required components
  const hasGenesys = typeof window._genesys !== 'undefined';
  const hasCXBus = typeof window.CXBus !== 'undefined';
  const hasJQuery = typeof window.jQuery !== 'undefined';

  console.log('[Genesys] Components check:', {
    hasGenesys,
    hasCXBus,
    hasJQuery,
    hasWebChat:
      hasGenesys && typeof window._genesys.widgets?.webchat !== 'undefined',
  });

  // Only start initialization if we haven't reached max retries
  if (retryCount < MAX_RETRIES) {
    // Additional check after DOM is fully loaded
    setTimeout(function () {
      if (!document.querySelector('.cx-webchat-chat-button')) {
        console.log(
          '[Genesys] Chat button not found after DOM load, initializing again',
        );
        initializeChatButton();
      }
    }, 2000);
  }

  // Register commands if CXBus is available
  registerChatCommands();
}

// Clean up any existing listeners to prevent duplicates
if (window._genesysDOMLoadedHandler) {
  document.removeEventListener(
    'DOMContentLoaded',
    window._genesysDOMLoadedHandler,
  );
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
