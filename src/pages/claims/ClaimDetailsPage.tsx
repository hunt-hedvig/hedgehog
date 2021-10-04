import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  FadeIn,
  HotkeyStyled,
  LoadingMessage,
  MainHeadline,
} from '@hedvig-ui'
import { useCommandLine } from '@hedvig-ui/utils/command-line-hook'
import { Keys } from '@hedvig-ui/utils/key-press-hook'
import { ClaimEvents } from 'features/claims/claim-details/components/ClaimEvents'
import { ClaimFileTable } from 'features/claims/claim-details/components/ClaimFileTable'
import { ClaimInformation } from 'features/claims/claim-details/components/ClaimInformation/ClaimInformation'
import { ClaimNotes } from 'features/claims/claim-details/components/ClaimNotes'
import { ClaimPayments } from 'features/claims/claim-details/components/ClaimPayments/ClaimPayments'
import { ClaimTranscriptions } from 'features/claims/claim-details/components/ClaimTranscriptions'
import { ClaimType } from 'features/claims/claim-details/components/ClaimType/ClaimType'
import { MemberInformation } from 'features/claims/claim-details/components/MemberInformation'
import { ChatPane } from 'features/member/tabs/ChatPane'
import React, { useContext, useEffect, useState } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { ClaimState, useClaimPageQuery } from 'types/generated/graphql'
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

const hotkeyStyles = {
  top: '0.3rem',
  right: '0.3rem',
  padding: '2px 8px',
}

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
          <CardsWrapper contentWrap="noWrap">
            <Card span={3}>
              {isHintingOption && (
                <HotkeyStyled dark style={hotkeyStyles}>
                  1
                </HotkeyStyled>
              )}
              <MemberInformation
                focus={focus.memberInfo}
                claimId={claimId}
                memberId={memberId}
              />
            </Card>
            <Card span={3}>
              {isHintingOption && (
                <HotkeyStyled dark style={hotkeyStyles}>
                  2
                </HotkeyStyled>
              )}
              <ClaimInformation
                focus={focus.claimInfo}
                claimId={claimId}
                memberId={memberId}
              />
            </Card>
            <Card span={3}>
              {isHintingOption && (
                <HotkeyStyled dark style={hotkeyStyles}>
                  3
                </HotkeyStyled>
              )}
              <ClaimType claimId={claimId} />
              {/*<ClaimTypeForm focus={focus.type} claimId={claimId}/>*/}
            </Card>
          </CardsWrapper>
          <CardsWrapper contentWrap="noWrap">
            <ClaimTranscriptions claimId={claimId} />
          </CardsWrapper>
          <CardsWrapper contentWrap="noWrap">
            <Card>
              {isHintingOption && (
                <HotkeyStyled dark style={hotkeyStyles}>
                  4
                </HotkeyStyled>
              )}
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

          <CardsWrapper contentWrap="noWrap">
            <Card>
              <ClaimPayments
                claimId={claimId}
                carrier={claimPageData?.claim?.agreement?.carrier}
              />
            </Card>
          </CardsWrapper>

          <CardsWrapper contentWrap="noWrap">
            <Card>
              {isHintingOption && (
                <HotkeyStyled dark style={hotkeyStyles}>
                  5
                </HotkeyStyled>
              )}
              <ClaimFileTable
                focus={focus.files}
                claimId={claimId}
                memberId={memberId}
              />
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
