// // File: src/lib/visibility/encoding.ts
// import { MEMBER_ATTRIBUTES_LIST, VisibilityRules } from './types';

// const ENCODING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// export function encodeVisibilityRules(rules: VisibilityRules): string {
//   const bits = [];
  
//   for (let i = 0; i < MEMBER_ATTRIBUTES_LIST.length; i++) {
//     const attr = MEMBER_ATTRIBUTES_LIST[i];
//     bits[i] = !!rules[attr];
//   }
  
//   // Pad the binary array with 0s so that its size is a multiple of 6
//   for (let j = bits.length; j % 6 != 0; j++) {
//     bits[j] = false;
//   }
  
//   // Convert the array to a string of binary bits
//   const binary = bits.map((val) => (val ? 1 : 0)).join('');
  
//   // Convert the binary data to a compressed string utilizing base64 characters
//   let output = '';
//   for (let k = 0; k < binary.length; k += 6) {
//     const val = binary.substring(k, k + 6);
//     const index = parseInt(val, 2);
//     output += ENCODING.charAt(index);
//   }
  
//   return output;
// }

// export function decodeVisibilityRules(encoded: string): VisibilityRules {
//   const charArray = encoded.split('');
//   const intArray = charArray.map((char) => ENCODING.indexOf(char));
//   const binaryArray = intArray.map((int) => int.toString(2).padStart(6, '0'));
//   const binary = binaryArray.join('');
  
//   const visibilityRules: VisibilityRules = {};
  
//   for (let i = 0; i < MEMBER_ATTRIBUTES_LIST.length; i++) {
//     const attr = MEMBER_ATTRIBUTES_LIST[i];
//     visibilityRules[attr] = binary.charAt(i) === '1';
//   }
  
//   return visibilityRules;
// }