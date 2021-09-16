import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  FadeIn,
  LoadingMessage,
  MainHeadline,
} from '@hedvig-ui'
import { ClaimEvents } from 'features/claims/claim-details/components/ClaimEvents'
import { ClaimFileTable } from 'features/claims/claim-details/components/ClaimFileTable'
import { ClaimInformation } from 'features/claims/claim-details/components/ClaimInformation'
import { ClaimNotes } from 'features/claims/claim-details/components/ClaimNotes'
import { ClaimPayments } from 'features/claims/claim-details/components/ClaimPayments'
import { ClaimTranscriptions } from 'features/claims/claim-details/components/ClaimTranscriptions'
import { ClaimTypeForm } from 'features/claims/claim-details/components/ClaimType'
import { MemberInformation } from 'features/claims/claim-details/components/MemberInformation'
import { ChatPane } from 'features/member/tabs/ChatPane'
import React, { useContext, useEffect, useState } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { ClaimState, useClaimPageQuery } from 'types/generated/graphql'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys } from 'utils/hooks/key-press-hook'
import { MemberHistoryContext } from 'utils/member-history'
import { getCarrierText } from 'utils/text'

const ChatPaneAdjustedContainer = styled.div`
  width: clamp(1000px, calc(100% - 400px), calc(100% - 400px));
`

const ShowEventButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1em;
`

const ClaimTip = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
`

const DEFAULT_FOCUSES = {
  memberInfo: false,
  claimInfo: false,
  type: false,
  notes: false,
  files: false,
}

const DEFAULT_KEYS = ['One', 'Two', 'Three', 'Four', 'Five']

export const ClaimDetailsPage: React.FC<RouteComponentProps<{
  claimId: string
}>> = ({ match }) => {
  const { claimId } = match.params
  const { pushToMemberHistory } = useContext(MemberHistoryContext)
  const [showEvents, setShowEvents] = useState(false)
  const { registerActions, isHintingOption } = useCommandLine()
  const [focus, setFocus] = useState(DEFAULT_FOCUSES)

  registerActions(
    Object.keys(DEFAULT_FOCUSES).map((section, index) => ({
      label: `Focus on ${section}`,
      keys: [Keys.Option, Keys[DEFAULT_KEYS[index]]],
      onResolve: () => {
        setFocus({ ...DEFAULT_FOCUSES, [section]: true })
      },
    })),
  )

  const { data: claimPageData } = useClaimPageQuery({
    variables: { claimId },
  })

  const memberId = claimPageData?.claim?.member.memberId

  useEffect(() => {
    if (!memberId) {
      return
    }

    pushToMemberHistory(memberId)
  }, [claimPageData])

  if (!memberId) {
    return <LoadingMessage paddingTop={'25vh'} />
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
          <CardsWrapper contentWrap={'noWrap'}>
            <Card span={3}>
              {isHintingOption && <ClaimTip>(1)</ClaimTip>}
              <MemberInformation
                focus={focus.memberInfo}
                claimId={claimId}
                memberId={memberId}
              />
            </Card>
            <Card span={3}>
              {isHintingOption && <ClaimTip>(2)</ClaimTip>}
              <ClaimInformation
                focus={focus.claimInfo}
                claimId={claimId}
                memberId={memberId}
              />
            </Card>
            <Card span={3}>
              {isHintingOption && <ClaimTip>(3)</ClaimTip>}
              <ClaimTypeForm focus={focus.type} claimId={claimId} />
            </Card>
          </CardsWrapper>
          <CardsWrapper contentWrap={'noWrap'}>
            <ClaimTranscriptions claimId={claimId} />
          </CardsWrapper>
          <CardsWrapper contentWrap={'noWrap'}>
            <Card>
              {isHintingOption && <ClaimTip>(4)</ClaimTip>}
              <ClaimNotes focus={focus.notes} claimId={claimId} />
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
              {isHintingOption && <ClaimTip>(5)</ClaimTip>}
              <ClaimFileTable
                focus={focus.files}
                claimId={claimId}
                memberId={memberId}
              />
            </Card>
          </CardsWrapper>

          {showEvents ? (
            <CardsWrapper contentWrap={'noWrap'}>
              <Card>
                <ClaimEvents claimId={claimId} />
              </Card>
            </CardsWrapper>
          ) : (
            <ShowEventButtonWrapper>
              <Button variation={'ghost'} onClick={() => setShowEvents(true)}>
                Show events
              </Button>
            </ShowEventButtonWrapper>
          )}
        </ChatPaneAdjustedContainer>
      </FadeIn>
    </>
  )
}
