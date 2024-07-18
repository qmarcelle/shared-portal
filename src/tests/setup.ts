window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      media: null,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
