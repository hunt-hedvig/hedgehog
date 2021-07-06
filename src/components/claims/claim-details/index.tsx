import styled from '@emotion/styled'
import { ClaimState, useClaimPageQuery } from 'api/generated/graphql'
import { ClaimItems } from 'components/claims/claim-details/components/claim-items'
import { ChatPane } from 'components/member/tabs/ChatPane'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { StandaloneMessage } from 'hedvig-ui/animations/standalone-message'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useContext, useEffect } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { MemberHistoryContext } from 'utils/member-history'
import { getCarrierText } from 'utils/text'
import { ClaimEvents } from './components/ClaimEvents'
import { ClaimFileTable } from './components/ClaimFileTable'
import { ClaimInformation } from './components/ClaimInformation'
import { ClaimNotes } from './components/ClaimNotes'
import { ClaimPayments } from './components/ClaimPayments'
import { ClaimTranscriptions } from './components/ClaimTranscriptions'
import { ClaimTypeForm } from './components/ClaimType'
import { MemberInformation } from './components/MemberInformation'

const ChatPaneAdjustedContainer = styled.div`
  width: clamp(1000px, calc(100% - 400px), calc(100% - 400px));
`

export const ClaimDetails: React.FC<RouteComponentProps<{
  claimId: string
  memberId: string
}>> = ({ match }) => {
  const { memberId, claimId } = match.params

  const { pushToMemberHistory } = useContext(MemberHistoryContext)

  const { data: claimPageData } = useClaimPageQuery({
    variables: { claimId },
  })
  useEffect(() => {
    pushToMemberHistory(memberId)
  }, [memberId])

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
          <CardsWrapper contentWrap={'noWrap'}>
            <Card span={3}>
              <MemberInformation claimId={claimId} memberId={memberId} />
            </Card>
            <Card span={3}>
              <ClaimInformation claimId={claimId} memberId={memberId} />
            </Card>
            <Card span={3}>
              <ClaimTypeForm claimId={claimId} memberId={memberId} />
            </Card>
          </CardsWrapper>
          <CardsWrapper contentWrap={'noWrap'}>
            <ClaimTranscriptions claimId={claimId} />
          </CardsWrapper>
          <CardsWrapper contentWrap={'noWrap'}>
            <Card>
              <ClaimNotes claimId={claimId} />
            </Card>
          </CardsWrapper>
          <CardsWrapper contentWrap={'noWrap'}>
            <Card>
              <ClaimItems claimId={claimId} memberId={memberId} />
            </Card>
          </CardsWrapper>
          {claimPageData?.claim?.agreement?.carrier ? (
            <>
              <MainHeadline>
                {getCarrierText(claimPageData.claim.agreement.carrier)}
              </MainHeadline>
              <CardsWrapper contentWrap={'noWrap'}>
                <Card>
                  <ClaimPayments claimId={claimId} />
                </Card>
              </CardsWrapper>
            </>
          ) : (
            <StandaloneMessage opacity={1.0}>
              ⚠️ Cannot make a payment or set a reserve without carrier, select
              a <strong>Contract</strong> and{' '}
              <strong>Date of Occurrence</strong>. Also, make sure the claim is{' '}
              <strong>covered on the date</strong> (i.e. an agreement is active
              on the date of occurrence)
            </StandaloneMessage>
          )}

          <CardsWrapper contentWrap={'noWrap'}>
            <Card>
              <ClaimFileTable claimId={claimId} memberId={memberId} />
            </Card>
          </CardsWrapper>

          <CardsWrapper contentWrap={'noWrap'}>
            <Card>
              <ClaimEvents claimId={claimId} />
            </Card>
          </CardsWrapper>
        </ChatPaneAdjustedContainer>
      </FadeIn>
    </>
  )
}
