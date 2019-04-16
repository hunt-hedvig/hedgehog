export enum PayoutCategory {
  MARKETING = 'MARKETING',
  REFERRAL = 'REFERRAL',
  REFUND = 'REFUND',
}

export interface Payout {
  userId: string
  memberId: string
  amount: string
  category: PayoutCategory
  referenceId: string
  note: string
}
