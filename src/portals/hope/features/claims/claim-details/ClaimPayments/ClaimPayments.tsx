import styled from '@emotion/styled'
import { useClaimPaymentsQuery } from 'types/generated/graphql'

import {
  CardContent,
  CardTitle,
  InfoRow,
  InfoTag,
  InfoText,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { Market } from 'portals/hope/features/config/constants'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { ClaimPaymentForm } from './ClaimPaymentForm'
import gql from 'graphql-tag'
import { ClaimPaymentsTable } from 'portals/hope/features/claims/claim-details/ClaimPayments/ClaimPaymentsTable'

const MemberIdentityCard = styled.div`
  width: 100%;
  padding: 2rem;
  border-radius: 7px;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  margin-right: 2em;
`

gql`
  query ClaimPayments($claimId: ID!) {
    claim(id: $claimId) {
      id
      contract {
        id
        market
      }
      agreement {
        id
        carrier
      }

      trial {
        id
      }

      member {
        memberId
        sanctionStatus
        identity {
          firstName
          lastName
          nationalIdentification {
            identification
            nationality
          }
        }
      }
    }
  }
`

export const ClaimPayments: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const {
    data: paymentsData,
    error: queryError,
    loading: loadingPayments,
  } = useClaimPaymentsQuery({
    variables: { claimId },
  })

  const identity = paymentsData?.claim?.member?.identity

  return (
    <CardContent>
      <CardTitle
        title="Payments"
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {paymentsData?.claim?.contract?.market === Market.Norway && (
          <MemberIdentityCard>
            <ThirdLevelHeadline>Member Identity</ThirdLevelHeadline>
            <InfoRow>
              Identified
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={identity ? 'success' : 'warning'}
                >
                  {identity ? 'Yes' : 'No'}
                </InfoTag>
              </InfoText>
            </InfoRow>
            {identity && (
              <>
                <InfoRow>
                  Personal Number
                  <InfoText>
                    {identity.nationalIdentification.identification}
                  </InfoText>
                </InfoRow>
                {identity.firstName && identity.lastName && (
                  <InfoRow>
                    Name
                    <InfoText>
                      {identity.firstName} {identity.lastName}
                    </InfoText>
                  </InfoRow>
                )}
              </>
            )}
          </MemberIdentityCard>
        )}
      </div>

      <ClaimPaymentsTable claimId={claimId} />

      <Spacing top="medium" />
      {((!loadingPayments &&
        paymentsData?.claim?.contract &&
        paymentsData?.claim?.agreement?.carrier) ||
        paymentsData?.claim?.trial) && (
        <ClaimPaymentForm
          sanctionStatus={paymentsData?.claim?.member.sanctionStatus}
          claimId={claimId}
          identified={Boolean(identity)}
          memberId={memberId}
          market={paymentsData?.claim?.contract?.market}
          carrier={paymentsData?.claim?.agreement?.carrier ?? 'HEDVIG'}
        />
      )}
    </CardContent>
  )
}
