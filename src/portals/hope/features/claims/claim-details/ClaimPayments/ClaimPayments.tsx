import styled from '@emotion/styled'
import { ClaimPayment, useClaimPaymentsQuery } from 'types/generated/graphql'

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
import React, { useState } from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { ClaimPaymentForm } from './components/ClaimPaymentForm'
import gql from 'graphql-tag'
import { ClaimPaymentsTable } from 'portals/hope/features/claims/claim-details/ClaimPayments/components/ClaimPaymentsTable'

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
        market
      }
      member {
        memberId
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
}> = ({ claimId }) => {
  const { data, error: queryError } = useClaimPaymentsQuery({
    variables: { claimId },
  })

  const [selectedPayment, setSelectedPayment] = useState<ClaimPayment | null>(
    null,
  )

  const identity = data?.claim?.member?.identity

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
        {data?.claim?.contract?.market === Market.Norway && (
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

      <ClaimPaymentsTable
        claimId={claimId}
        onPaymentSelect={(payment: ClaimPayment) => setSelectedPayment(payment)}
        selectedPaymentId={selectedPayment?.id}
      />

      <Spacing top="medium" />
      <ClaimPaymentForm
        claimId={claimId}
        selectedPayment={selectedPayment}
        clearSelection={() => setSelectedPayment(null)}
      />
    </CardContent>
  )
}
