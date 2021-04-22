import styled from '@emotion/styled'
import Grid from '@material-ui/core/Grid'
import { ClaimState, useClaimReservesQuery } from 'api/generated/graphql'
import { ClaimItems } from 'components/claims/claim-details/components/claim-items'
import { ChatPane } from 'components/member/tabs/ChatPane'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import React, { useContext, useEffect } from 'react'
import { Prompt } from 'react-router'
import { MemberHistoryContext } from 'utils/member-history'
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

interface Props {
  match: {
    params: {
      claimId: string
      memberId: string
    }
  }
}

const ClaimPage: React.FC<Props> = ({ match }) => {
  const { memberId, claimId } = match.params

  const { pushToMemberHistory } = useContext(MemberHistoryContext)

  const { data: claimReservesData } = useClaimReservesQuery({
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
              claimReservesData?.claim?.state !== ClaimState.Closed &&
              (claimReservesData?.claim?.reserves === null ||
                claimReservesData?.claim?.reserves === undefined)
            }
            message="This claim has no reserves, do you want leave it it without?"
          />

          <Grid item xs={12} sm={12} md={5}>
            <MemberInformation claimId={claimId} memberId={memberId} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ClaimInformation claimId={claimId} memberId={memberId} />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
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
          <Grid item xs={12}>
            <ClaimPayments claimId={claimId} />
          </Grid>
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

export default ClaimPage
