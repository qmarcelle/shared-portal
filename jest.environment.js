/**
 * Custom Jest environment that extends JSDOM with necessary globals for MSW
 */
const Environment = require("jest-environment-jsdom").default;
const { TextEncoder, TextDecoder } = require("util");
const { Response, Headers, Request } = require("node-fetch");
const { ReadableStream, WritableStream, TransformStream } = require("web-streams-polyfill");
const { BroadcastChannel } = require("broadcast-channel");

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    
    // Add TextEncoder/TextDecoder to the environment globals
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
    
    // Add necessary globals for fetch API usage in MSW
    this.global.Response = Response;
    this.global.Headers = Headers;
    this.global.Request = Request;

    // Add Web Streams API polyfills
    this.global.ReadableStream = ReadableStream;
    this.global.WritableStream = WritableStream;
    this.global.TransformStream = TransformStream;

    // Add BroadcastChannel polyfill
    this.global.BroadcastChannel = BroadcastChannel;

    // Mock window.matchMedia which is not available in JSDOM
    this.global.matchMedia = function(query) {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: function() {},
        removeListener: function() {},
        addEventListener: function() {},
        removeEventListener: function() {},
        dispatchEvent: function() {},
      };
    };

    // The expect/jest globals are provided by Jest itself
    // No need to define them here, they should already be available

    console.log("Custom test environment initialized with polyfills");
  }
}; 