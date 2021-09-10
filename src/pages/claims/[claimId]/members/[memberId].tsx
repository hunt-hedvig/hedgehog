import styled from '@emotion/styled'
import { Card, CardsWrapper, FadeIn, MainHeadline } from '@hedvig-ui'
import { ClaimItems } from 'features/claims/claim-details/components/claim-items'
import { ClaimEvents } from 'features/claims/claim-details/components/ClaimEvents'
import { ClaimFileTable } from 'features/claims/claim-details/components/ClaimFileTable'
import { ClaimInformation } from 'features/claims/claim-details/components/ClaimInformation'
import { ClaimNotes } from 'features/claims/claim-details/components/ClaimNotes'
import { ClaimPayments } from 'features/claims/claim-details/components/ClaimPayments'
import { ClaimTranscriptions } from 'features/claims/claim-details/components/ClaimTranscriptions'
import { ClaimTypeForm } from 'features/claims/claim-details/components/ClaimType'
import { MemberInformation } from 'features/claims/claim-details/components/MemberInformation'
import { ChatPane } from 'features/member/tabs/ChatPane'
import React, { useContext, useEffect } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { ClaimState, useClaimPageQuery } from 'types/generated/graphql'
import { MemberHistoryContext } from 'utils/member-history'
import { getCarrierText } from 'utils/text'

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
              <ClaimTypeForm claimId={claimId} />
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
          {claimPageData?.claim?.agreement?.carrier && (
            <>
              <MainHeadline>
                {getCarrierText(claimPageData.claim.agreement.carrier)}
              </MainHeadline>
            </>
          )}

          <CardsWrapper contentWrap={'noWrap'}>
            <Card>
              <ClaimPayments
                claimId={claimId}
                carrier={claimPageData?.claim?.agreement?.carrier}
              />
            </Card>
          </CardsWrapper>

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
