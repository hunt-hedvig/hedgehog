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
        person {
          debtFlag
        }
        personalNumber
        directDebitStatus {
          activated
        }
        fraudulentStatus
        sanctionStatus
        numberFailedCharges {
          numberFailedCharges
          lastFailedChargeAt
        }
        totalNumberOfClaims
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
      contract {
        id
        currentAgreementId
        agreements {
          ... on AgreementCore {
            id
          }
          ... on SwedishApartment {
            address {
              street
              postalCode
              city
            }
          }
          ... on SwedishHouse {
            address {
              street
              postalCode
              city
            }
          }
          ... on NorwegianHomeContent {
            address {
              street
              postalCode
              city
            }
          }
        }
        contractTypeName
        typeOfContract
      }
      coveringEmployee
      __typename
    }
  }
`
