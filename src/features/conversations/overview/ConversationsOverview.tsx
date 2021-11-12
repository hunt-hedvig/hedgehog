import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { Button } from '@hedvig-ui/Button/button'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { ConversationsRemaining } from 'features/conversations/overview/ConversationsRemaining'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { QuestionGroup, UserSettingKey } from 'types/generated/graphql'
import { ConversationItem } from './ConversationItem'

const ConversationWrapper = styled.div`
  margin-top: 1em;
  overflow-y: scroll;
  width: 100%;
  height: 324px;
  padding: 0 1em;
  ::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const ConversationsOverview: React.FC<{
  filteredGroups: QuestionGroup[]
  currentMemberId?: string
  currentQuestionOrder: number
}> = ({ filteredGroups, currentMemberId, currentQuestionOrder }) => {
  const { settings, updateSetting } = useMe()

  const history = useHistory()
  const { confirm } = useConfirmDialog()

  useEffect(() => {
    if (!settings[UserSettingKey.FeatureFlags]?.conversations) {
      updateSetting(UserSettingKey.FeatureFlags, {
        conversations: true,
      })
      history.go(0)
    }
  }, [])

  return (
    <div>
      <Flex direction="column" align="center" style={{ marginTop: '1em' }}>
        <ConversationsRemaining count={filteredGroups.length} />
      </Flex>
      <Flex direction="column" justify="center" style={{ marginTop: '0.5em' }}>
        <Flex direction="row" justify="center">
          <Button
            style={{ marginLeft: '-0.5em' }}
            variant="secondary"
            size="small"
            onClick={() =>
              confirm('Do you want to go back to the questions tab?').then(
                () => {
                  updateSetting(UserSettingKey.FeatureFlags, {
                    conversations: false,
                  })
                  history.replace('/questions')
                  history.go(0)
                },
              )
            }
          >
            Back to questions
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => history.push('/conversations/settings')}
            style={{ marginLeft: '1em' }}
          >
            Change filters
          </Button>
        </Flex>

        <ConversationWrapper>
          {filteredGroups.map((group, index) => (
            <ConversationItem
              group={group}
              currentMemberId={currentMemberId}
              focus={currentQuestionOrder === index}
            />
          ))}
        </ConversationWrapper>
      </Flex>
    </div>
  )
}
