import gql from 'graphql-tag'
import { TYPE_FRAGMENT } from './components/ClaimType'

export const CLAIM_PAGE_QUERY = gql`
  query ClaimPage($id: ID!) {
    claim(id: $id) {
      member {
        memberId
        signedOn
        firstName
        lastName
        personalNumber
        address
        postalNumber
        city
        directDebitStatus {
          activated
        }
        fraudulentStatus
        sanctionStatus
        numberFailedCharges {
          numberFailedCharges
          lastFailedChargeAt
        }
        account {
          totalBalance {
            amount
            currency
          }
        }
      }
      registrationDate
      recordingUrl
      state
      type {
        ${TYPE_FRAGMENT}
      }
      notes {
        text
        date
      }
      transcriptions {
        text
        confidenceScore
        languageCode
      }
      reserves
      payments {
        id
        amount
        deductible
        note
        timestamp
        exGratia
        type
        #transaction {
        #  status
        #}
        status
      }
      events {
        text
        date
      }
      claimFiles {
        claimFileId
        fileUploadUrl
        uploadedAt
        category
        contentType
      }
      coveringEmployee
      __typename
    }
  }
`
