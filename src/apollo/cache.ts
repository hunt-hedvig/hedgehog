import { InMemoryCache } from '@apollo/client'

export const cache = new InMemoryCache({
  typePolicies: {
    Member: {
      keyFields: ['memberId'],
    },
    ResourceAccessInformation: {
      keyFields: ['resourceId'],
    },
    Renewal: {
      keyFields: ['draftOfAgreementId'],
    },
    ChatMessage: {
      keyFields: ['globalId'],
    },
    MemberReferral: {
      keyFields: ['memberId'],
    },
    ClaimEvent: {
      keyFields: ['text', 'date'],
    },
    ClaimFileUpload: {
      keyFields: ['claimFileId'],
    },
    ClaimNote: {
      keyFields: ['date', 'handlerReference'],
    },
    Query: {
      fields: {
        employees: {
          merge: false,
        },
      },
    },
  },
})
