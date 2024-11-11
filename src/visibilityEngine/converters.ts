import { MEMBER_ATTRIBUTES_LIST, VisibilityRules } from './rules';

const ENCODING =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeVisibilityRules(rules: VisibilityRules) {
  const bits = [];
  /* Convert the member's attribute values to an array of binary bits (1 or 0) representing each rule.
     The position of each bit is set by the rule's name in the ATTRIBUTE_LIST constant */
  for (let i = 0; i < MEMBER_ATTRIBUTES_LIST.length; i++) {
    const attr = MEMBER_ATTRIBUTES_LIST[i];
    bits[i] = !!rules[attr];
  }
  //Pad the binary array with 0s so that its size is a multiple of 6
  for (let j = bits.length; j % 6 != 0; j++) {
    bits[j] = 0;
  }
  //Convert the array to a string of binary bits
  const binary = bits.map((val) => (val ? 1 : 0)).join('');

  console.log('Encoded Binary value', binary);
  //Convert the binary data to a compressed string utilizing base64 characters
  let output = '';
  for (let k = 0; k < binary.length; k += 6) {
    const val = binary.substring(k, k + 6);
    const index = parseInt(val, 2);
    output += ENCODING.charAt(index);
  }

  //TODO: Remove this logging once we have tested the PZN implementation
  // with enough test data for a while.
  console.log('Encoded Output', output);
  return output;
}

export function decodeVisibilityRules(encoded: string): VisibilityRules {
  //Reverse the encoding of the JWT string to a string of binary bits representing the rules
  const charArray = encoded.split('');
  const intArray = charArray.map((char) => ENCODING.indexOf(char));
  const binaryArray = intArray.map((int) => int.toString(2).padStart(6, '0')); //This step creates an array of 6-bit binary strings
  const binary = binaryArray.join(''); //It is not necessary to strip out the added padding bits here; the attribute loop only checks for characters within the length of ATTRIBUTE_LIST
  console.log('Decoded Binary Array', binary);
  const visibilityRules: VisibilityRules = {};
  for (let i = 0; i < MEMBER_ATTRIBUTES_LIST.length; i++) {
    const attr = MEMBER_ATTRIBUTES_LIST[i];
    visibilityRules[attr] = binary.charAt(i) == '1';
  }

  //TODO: Remove this logging once we have tested the PZN implementation
  // with enough test data for a while.
  console.log('Decode VRules', visibilityRules);

  return visibilityRules;
}
