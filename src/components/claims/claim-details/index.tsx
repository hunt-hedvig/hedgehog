import styled from '@emotion/styled'
import Grid from '@material-ui/core/Grid'
import { ClaimState, useClaimPageQuery } from 'api/generated/graphql'
import { ClaimItems } from 'components/claims/claim-details/components/claim-items'
import { ChatPane } from 'components/member/tabs/ChatPane'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { StandaloneMessage } from 'hedvig-ui/animations/standalone-message'
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

const GridWithChatPaneAdjustment = styled(Grid)`
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
      <ChatPane memberId={memberId} />
      <FadeIn>
        <GridWithChatPaneAdjustment container spacing={8}>
          <Prompt
            when={
              claimPageData?.claim?.state !== ClaimState.Closed &&
              (claimPageData?.claim?.reserves === null ||
                claimPageData?.claim?.reserves === undefined)
            }
            message="This claim has no reserves, do you want leave without it?"
          />

          <Grid item xs={12} sm={12} md={4}>
            <MemberInformation claimId={claimId} memberId={memberId} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimInformation claimId={claimId} memberId={memberId} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimTypeForm claimId={claimId} memberId={memberId} />
          </Grid>
          <Grid item xs={12}>
            <ClaimTranscriptions claimId={claimId} />
          </Grid>
          <Grid item xs={12}>
            <ClaimNotes claimId={claimId} />
          </Grid>
          <Grid item xs={12}>
            <ClaimItems claimId={claimId} memberId={memberId} />
          </Grid>
          {claimPageData?.claim?.agreement?.carrier ? (
            <>
              <MainHeadline>
                {getCarrierText(claimPageData.claim.agreement.carrier)}
              </MainHeadline>
              <Grid item xs={12}>
                <ClaimPayments claimId={claimId} />
              </Grid>
            </>
          ) : (
            <StandaloneMessage opacity={1.0}>
              ⚠️ Cannot make a payment without a carrier, please select a{' '}
              <strong>Contract</strong> and <strong>Date of Occurrence</strong>{' '}
              above. Also, make sure the claim is{' '}
              <strong>covered on that date</strong> (i.e. an agreement is active
              on the date of occurrence)
            </StandaloneMessage>
          )}

          <Grid item xs={12}>
            <ClaimFileTable claimId={claimId} memberId={memberId} />
          </Grid>
          <Grid item xs={12}>
            <ClaimEvents claimId={claimId} />
          </Grid>
        </GridWithChatPaneAdjustment>
      </FadeIn>
    </>
  )
}
