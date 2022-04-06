import React, { useState } from 'react'
import { useRestrictClaim } from 'portals/hope/common/hooks/use-restrict-claim'
import {
  ClaimState,
  useClaimDetailsQuery,
  useResourceAccessInformationQuery,
} from 'types/generated/graphql'
import {
  Button,
  Card,
  CardsWrapper,
  FadeIn,
  Flex,
  LoadingMessage,
  MainHeadline,
  Paragraph,
  Shadowed,
  StandaloneMessage,
} from '@hedvig-ui'
import { Prompt } from 'react-router'
import { ChatPane } from 'portals/hope/features/member/tabs/ChatPane'
import { ClaimRestrictionInformation } from 'portals/hope/features/claims/claim-details/ClaimRestrictionInformation'
import { MemberInformation } from 'portals/hope/features/claims/claim-details/MemberInformation/MemberInformation'
import { ClaimInformation } from 'portals/hope/features/claims/claim-details/ClaimInformation/ClaimInformation'
import { ClaimType } from 'portals/hope/features/claims/claim-details/ClaimType/ClaimType'
import { ClaimTranscriptions } from 'portals/hope/features/claims/claim-details/ClaimTranscriptions'
import { ClaimNotes } from 'portals/hope/features/claims/claim-details/ClaimNotes'
import { getCarrierText } from 'portals/hope/features/member/tabs/contracts-tab/utils'
import { ClaimReserve } from 'portals/hope/features/claims/claim-details/ClaimReserve'
import { ClaimPayments } from 'portals/hope/features/claims/claim-details/ClaimPayments/ClaimPayments'
import { ClaimFileTable } from 'portals/hope/features/claims/claim-details/ClaimFiles'
import { ClaimEvents } from 'portals/hope/features/claims/claim-details/ClaimEvents'
import gql from 'graphql-tag'
import styled from '@emotion/styled'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { usePushMemberHistory } from 'portals/hope/common/hooks/use-push-member-history'

const Container = styled.div<{ chat?: boolean }>`
  width: ${({ chat }) =>
    chat ? 'clamp(1000px, calc(100% - 400px), calc(100% - 400px)' : '100%'};
`

const ShowEventButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1em;
`

const NoCarrierMessage = styled(StandaloneMessage)`
  padding: 3em 0;
  text-align: center;
`

const NoCarrierSubtitle = styled(Paragraph)`
  font-size: 0.8em;
  padding-top: 1em;
`

const RestrictedClaimMessage: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { data } = useResourceAccessInformationQuery({
    variables: { resourceId: claimId },
  })

  if (!data?.resourceAccess?.restrictedBy) {
    return null
  }

  const user = data.resourceAccess.restrictedBy

  return (
    <StandaloneMessage opacity={0.5}>
      <Flex align="center" justify="center" direction="column">
        <div style={{ fontSize: '2em' }}>
          <ShieldLockFill />
        </div>
        <div>This claim is restricted</div>
        <div style={{ fontSize: '0.7em' }}>
          Contact <Shadowed>{user.fullName}</Shadowed> if you want access
        </div>
      </Flex>
    </StandaloneMessage>
  )
}

gql`
  query ClaimDetails($claimId: ID!) {
    claim(id: $claimId) {
      id
      state
      reserves
      member {
        memberId
      }
      transcriptions {
        __typename
      }
      agreement {
        id
        carrier
      }
      trial {
        id
      }
    }
  }
`

export const ClaimOverview: React.FC<{
  claimId: string
  standalone?: boolean
}> = ({ claimId, standalone = false }) => {
  const { restriction } = useRestrictClaim(claimId)
  const [showEvents, setShowEvents] = useState(false)
  const { data, error } = useClaimDetailsQuery({
    variables: { claimId },
  })

  const memberId = data?.claim?.member.memberId
  const transcriptions = data?.claim?.transcriptions ?? []
  const carrier = data?.claim?.agreement?.carrier

  usePushMemberHistory(memberId)

  if (error) {
    if (error.message.includes('Claim is restricted')) {
      return <RestrictedClaimMessage claimId={claimId} />
    }

    console.error(error)

    return <StandaloneMessage>Claim not found</StandaloneMessage>
  }

  if (!memberId) {
    return <LoadingMessage paddingTop="25vh" />
  }

  if (!data?.claim) {
    return null
  }

  const { claim } = data

  return (
    <>
      {!standalone && (
        <Prompt
          when={claim.state !== ClaimState.Closed && !claim.reserves}
          message="This claim has no reserves, do you want leave without it?"
        />
      )}
      {!standalone && <ChatPane memberId={memberId} />}
      <FadeIn>
        <Container chat={!standalone}>
          {restriction && (
            <CardsWrapper>
              <Card>
                <ClaimRestrictionInformation claimId={claimId} />
              </Card>
            </CardsWrapper>
          )}
          <CardsWrapper contentWrap="noWrap">
            <Card span={3}>
              <MemberInformation
                claimId={claimId}
                memberId={memberId}
                slim={standalone}
              />
            </Card>
            <Card span={3}>
              <ClaimInformation claimId={claimId} />
            </Card>
            <Card span={3}>
              <ClaimType claimId={claimId} />
            </Card>
          </CardsWrapper>
          {!!transcriptions.length && (
            <CardsWrapper contentWrap="noWrap">
              <Card>
                <ClaimTranscriptions claimId={claimId} />
              </Card>
            </CardsWrapper>
          )}
          <CardsWrapper contentWrap="noWrap">
            <Card>
              <ClaimNotes claimId={claimId} />
            </Card>
          </CardsWrapper>
          {carrier && (
            <>
              <MainHeadline>{getCarrierText(carrier)}</MainHeadline>
            </>
          )}

          {!carrier && !claim.trial ? (
            <NoCarrierMessage opacity={0.6}>
              Cannot make a payment or set a reserve without a carrier.
              <NoCarrierSubtitle>
                Select a <Shadowed>Contract for Claim</Shadowed> and{' '}
                <Shadowed>Date of Occurrence</Shadowed> such that the claim is
                covered on the date.
              </NoCarrierSubtitle>
            </NoCarrierMessage>
          ) : (
            <>
              <CardsWrapper contentWrap="noWrap">
                <Card>
                  <ClaimReserve claimId={claimId} />
                </Card>
              </CardsWrapper>
              <CardsWrapper contentWrap="noWrap">
                <Card>
                  <ClaimPayments claimId={claimId} />
                </Card>
              </CardsWrapper>
            </>
          )}

          <CardsWrapper contentWrap="noWrap">
            <Card>
              <ClaimFileTable claimId={claimId} memberId={memberId} />
            </Card>
          </CardsWrapper>

          {showEvents ? (
            <CardsWrapper contentWrap="noWrap">
              <Card>
                <ClaimEvents claimId={claimId} />
              </Card>
            </CardsWrapper>
          ) : (
            <ShowEventButtonWrapper>
              <Button variant="tertiary" onClick={() => setShowEvents(true)}>
                Show events
              </Button>
            </ShowEventButtonWrapper>
          )}
        </Container>
      </FadeIn>
    </>
  )
}
