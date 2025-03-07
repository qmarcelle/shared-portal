export default function buildSSOLink(searchParams: string): string {
  return `${process.env.NEXT_PUBLIC_PING_REST_URL}/idp/startSSO.ping?${searchParams}`;
}

export function buildDropOffSSOLink(partnerId: string, ref: string): string {
  return `${process.env.NEXT_PUBLIC_PING_DROP_OFF_URL}spEntityId=${partnerId}&challenge=${ref}`;
}
