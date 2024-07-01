export interface PriorAuthDetails {
    priorAuthType: 'Medical'| 'Pharmacy' | 'Dental'
    priorAuthName: string
    dateOfVisit: string
    priorAuthStatus: 'Processed' | 'Denied' | 'Pending'| 'Approved'
    member:string
}