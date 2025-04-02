/**
 * Custom Jest environment that extends JSDOM with necessary globals for MSW
 *
 * NOTE: This file uses CommonJS module syntax (require/module.exports)
 * because Jest configuration expects this format. ESLint may show warnings
 * about this, but they can be safely ignored for this specific file.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const Environment = require('jest-environment-jsdom').default;
const { TextEncoder, TextDecoder } = require('util');
const { Response, Headers, Request } = require('node-fetch');
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require('web-streams-polyfill');
const { BroadcastChannel } = require('broadcast-channel');

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

    // matchMedia is now handled in setup.ts

    console.log('Custom test environment initialized with polyfills');
  }
};
