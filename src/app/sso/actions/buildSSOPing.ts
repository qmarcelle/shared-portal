export default function buildSSOLink(searchParams: string): string {
  return `${process.env.NEXT_PUBLIC_PING_REST_URL}/idp/startSSO.ping?${searchParams}`;
}
