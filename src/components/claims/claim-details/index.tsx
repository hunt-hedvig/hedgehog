import styled from '@emotion/styled'
import Grid from '@material-ui/core/Grid'
import { useClaimReservesQuery } from 'api/generated/graphql'
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
  @media (min-width: 1400px) {
    max-width: calc(100% - 400px);
  }
`

interface Props {
  match: {
    params: {
      claimId: string
      memberId: string
    }
  }
}

const ClaimPage: React.FC<Props> = ({ ...props }) => {
  const { memberId, claimId } = props.match.params

  const { pushToMemberHistory } = useContext(MemberHistoryContext)

  const { data: claimReservesData } = useClaimReservesQuery({
    variables: { claimId },
  })
  useEffect(() => {
    pushToMemberHistory(memberId)
  }, [memberId])

  return (
    <>
      <ChatPane memberId={props.match.params.memberId} />
      <FadeIn>
        <GridWithChatPaneAdjustment container spacing={8}>
          <Prompt
            when={
              Boolean(claimReservesData?.claim) &&
              !claimReservesData?.claim?.reserves
            }
            message="This claim has no reserves, do you want leave it it without?"
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
            <ClaimItems
              claimId={props.match.params.claimId}
              memberId={memberId}
            />
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
