import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Contract, Member } from '../api/generated/graphql'

export const CONTRACTS_QUERY = gql`
  query Contracts($memberId: ID!) {
    member(id: $memberId) {
      contracts {
        id
        holderMemberId
        switchedFrom
        masterInception
        status
        isTerminated
        terminationDate
        currentAgreementId
        hasPendingAgreement
        agreements {
          ... on SwedishApartment {
            id
            fromDate
            toDate
            certificateUrl
            status
            address {
              street
              postalCode
              city
            }
            numberCoInsured
            squareMeters
          }
          ... on SwedishHouse {
            id
            fromDate
            toDate
            certificateUrl
            status
            address {
              street
              postalCode
              city
            }
            numberCoInsured
            squareMeters
            ancillaryArea
            yearOfConstruction
            numberOfBathrooms
            extraBuildings {
              id
              type
              area
              hasWaterConnected
              displayName
            }
            isSubleted
          }
          ... on NorwegianHomeContent {
            id
            fromDate
            toDate
            certificateUrl
            status
            address {
              street
              postalCode
              city
            }
            numberCoInsured
            squareMeters
          }
          ... on NorwegianTravel {
            id
            fromDate
            toDate
            certificateUrl
            status
            numberCoInsured
          }
        }
        hasQueuedRenewal
        renewal {
          renewalDate
          draftCertificateUrl
          draftOfAgreementId
        }
        preferredCurrency
        signSource
        contractTypeName
        createdAt
      }
    }
  }
`

export const useContracts = (
  memberId: string,
): [ReadonlyArray<Contract>, boolean, () => void] => {
  const { data, loading, refetch } = useQuery<{
    member: { contracts: Member['contracts'] }
  }>(CONTRACTS_QUERY, {
    variables: { memberId },
  })
  const contracts = [...(data?.member.contracts ?? [])]
  return [contracts, loading, refetch]
}
