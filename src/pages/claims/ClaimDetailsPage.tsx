import styled from '@emotion/styled'
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
import { ClaimEvents } from 'features/claims/claim-details/ClaimEvents'
import { ClaimFileTable } from 'features/claims/claim-details/ClaimFiles'
import { ClaimInformation } from 'features/claims/claim-details/ClaimInformation/ClaimInformation'
import { ClaimNotes } from 'features/claims/claim-details/ClaimNotes'
import { ClaimPayments } from 'features/claims/claim-details/ClaimPayments/ClaimPayments'
import { ClaimReserve } from 'features/claims/claim-details/ClaimReserve'
import { ClaimRestrictionInformation } from 'features/claims/claim-details/ClaimRestrictionInformation'
import { ClaimTranscriptions } from 'features/claims/claim-details/ClaimTranscriptions'
import { ClaimType } from 'features/claims/claim-details/ClaimType/ClaimType'
import { MemberInformation } from 'features/claims/claim-details/MemberInformation/MemberInformation'
import { ChatPane } from 'features/member/tabs/ChatPane'
import { getCarrierText } from 'features/member/tabs/contracts-tab/utils'
import { useMemberHistory } from 'features/user/hooks/use-member-history'
import React, { useEffect, useState } from 'react'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { Prompt, RouteComponentProps } from 'react-router'
import {
  ClaimState,
  ResourceAccessInformation,
  useClaimPageQuery,
  useResourceAccessInformationQuery,
} from 'types/generated/graphql'

const ChatPaneAdjustedContainer = styled.div`
  width: clamp(1000px, calc(100% - 400px), calc(100% - 400px));
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

const ClaimDetailsPage: React.FC<RouteComponentProps<{
  claimId: string
}>> = ({ match }) => {
  const { claimId } = match.params
  const { pushToMemberHistory } = useMemberHistory()
  const [showEvents, setShowEvents] = useState(false)

  const { data: claimPageData, error } = useClaimPageQuery({
    variables: { claimId },
  })

  const memberId = claimPageData?.claim?.member.memberId

  useEffect(() => {
    if (!memberId) {
      return
    }

    pushToMemberHistory(memberId)
  }, [memberId])

  if (error) {
    if (error.message.includes('Claim is restricted')) {
      return <RestrictedClaimMessage claimId={claimId} />
    }

    return <StandaloneMessage>Claim not found</StandaloneMessage>
  }

  if (!memberId) {
    return <LoadingMessage paddingTop="25vh" />
  }

  return (
    <>
      <Prompt
        when={
          claimPageData?.claim?.state !== ClaimState.Closed &&
          (claimPageData?.claim?.reserves === null ||
            claimPageData?.claim?.reserves === undefined)
        }
        message="This claim has no reserves, do you want leave without it?"
      />
      <ChatPane memberId={memberId} />
      <FadeIn>
        <ChatPaneAdjustedContainer>
          {claimPageData?.claim?.restriction && (
            <CardsWrapper>
              <Card>
                <ClaimRestrictionInformation
                  restriction={
                    claimPageData.claim.restriction as ResourceAccessInformation
                  }
                  claimId={claimId}
                />
              </Card>
            </CardsWrapper>
          )}
          <CardsWrapper contentWrap="noWrap">
            <Card span={3}>
              <MemberInformation claimId={claimId} memberId={memberId} />
            </Card>
            <Card span={3}>
              <ClaimInformation
                claimId={claimId}
                memberId={memberId}
                restricted={!!claimPageData?.claim?.restriction}
              />
            </Card>
            <Card span={3}>
              <ClaimType claimId={claimId} />
            </Card>
          </CardsWrapper>
          <CardsWrapper contentWrap="noWrap">
            <ClaimTranscriptions claimId={claimId} />
          </CardsWrapper>
          <CardsWrapper contentWrap="noWrap">
            <Card>
              <ClaimNotes claimId={claimId} />
            </Card>
          </CardsWrapper>
          {claimPageData?.claim?.agreement?.carrier && (
            <>
              <MainHeadline>
                {getCarrierText(claimPageData.claim.agreement.carrier)}
              </MainHeadline>
            </>
          )}

          {!claimPageData?.claim?.agreement?.carrier ? (
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
                  <ClaimPayments claimId={claimId} memberId={memberId} />
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
        </ChatPaneAdjustedContainer>
      </FadeIn>
    </>
  )
}

export default ClaimDetailsPage
