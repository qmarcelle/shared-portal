// Essential Genesys widget configuration
window._genesys = window._genesys || {};
window._genesys.widgets = {
  main: {
    // Required configuration for the chat window to open
    theme: "blue",
    lang: "en",
    i18n: "https://api3.bcbst.com/stge/soa/api/cci/genesyschat/i18n",
    mobileMode: "auto"
  },
  webchat: {
    transport: {
      type: "cxbus"
    },
    emojis: true,
    cometD: {
      enabled: true
    },
    chatButton: {
      enabled: true
    },
    form: {
      autoSubmit: true,
      firstname: "",
      lastname: "",
      email: "",
      subject: ""
    }
  }
};