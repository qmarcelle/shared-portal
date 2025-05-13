/* There are a lot more properties in this response but username is all we really care about */
export interface PingPickUpResponse {
  additionalProperties?: {
    username?: string;
    targetURL?: string;
  };
}
