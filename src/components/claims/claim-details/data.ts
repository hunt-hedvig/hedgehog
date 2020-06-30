import gql from 'graphql-tag'
import { TYPE_FRAGMENT } from './components/ClaimType'

export const CLAIM_PAGE_QUERY = gql`
  query ClaimPage($id: ID!) {
    claim(id: $id) {
      contract {
        id
        holderMemberId
        contractTypeName
        switchedFrom
        masterInception
        status
        isTerminated
        terminationDate
        currentAgreementId
        hasPendingAgreement
        agreements {
          __typename
        }
        hasQueuedRenewal
        renewal {
          renewalDate
          draftOfAgreementId
          draftCertificateUrl
        }
        preferredCurrency
        market
        signSource
        contractTypeName
        createdAt
      }
      member {
        memberId
        signedOn
        firstName
        lastName
        person {
          debtFlag
        }
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
