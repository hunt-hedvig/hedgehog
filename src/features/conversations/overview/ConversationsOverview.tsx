import styled from '@emotion/styled'
import { Button, Flex } from '@hedvig-ui'
import { ConversationsRemaining } from 'features/conversations/overview/ConversationsRemaining'
import React from 'react'
import { useHistory } from 'react-router'
import { QuestionGroup } from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'
import { useInsecurePersistentState } from 'utils/state'

const ConversationItem = styled(Flex)<{ selected: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};
  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.semiStrongForeground};
  padding: 0.5em 0.8em;
  margin-top: 0.5em;
  border-radius: 8px;
  font-size: 0.8em;
  width: 100%;
  cursor: pointer;
  transition: all 300ms;

  :first-of-type {
    margin-top: 0.2em;
  }

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
    color: ${({ theme }) => theme.accent};
  }
`

const ConversationWrapper = styled.div`
  margin-top: 1em;
  overflow-y: scroll;
  width: 100%;
  height: 324px;
  padding: 1em;
  ::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const ConversationsOverview: React.FC<{
  filteredGroups: QuestionGroup[]
  currentMemberId?: string
}> = ({ filteredGroups, currentMemberId }) => {
  const history = useHistory()
  const { confirm } = useConfirmDialog()
  const [, setEnabled] = useInsecurePersistentState<boolean>(
    'conversations:enabled',
    false,
  )
  const [, setOnboarded] = useInsecurePersistentState<boolean>(
    'conversations:onboarded',
    false,
  )

  return (
    <>
      <Flex direction="column" align="center" style={{ marginTop: '1em' }}>
        <ConversationsRemaining count={filteredGroups.length} />
      </Flex>
      <Flex direction="column" justify="center" style={{ marginTop: '0.5em' }}>
        <Flex direction="row" justify="center">
          <Button
            style={{ marginLeft: '-0.5em' }}
            size="small"
            onClick={() =>
              confirm('Do you want to go back to the questions tab?').then(
                () => {
                  setEnabled(false)
                  setOnboarded(false)
                  history.replace('/questions')
                  history.go(0)
                },
              )
            }
          >
            Back to questions
          </Button>
          <Button
            size="small"
            onClick={() => history.push('/conversations/settings')}
            style={{ marginLeft: '1em' }}
          >
            Change filters
          </Button>
        </Flex>

        <ConversationWrapper>
          {filteredGroups.map((group) => (
            <ConversationItem
              key={group.memberId}
              onClick={() => history.push(`/conversations/${group.memberId}`)}
              selected={group.memberId === currentMemberId}
            >
              {group.member?.firstName ?? ''} {group.member?.lastName ?? ''}
            </ConversationItem>
          ))}
        </ConversationWrapper>
      </Flex>
    </>
  )
}
