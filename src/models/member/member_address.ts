export interface MemberAddress {
    type: string,
    line1: string,
    line2?: string,
    line3?: string,
    city: string,
    state: string,
    zip: string,
    county: string,
    phone?: string,
    email?: string
}