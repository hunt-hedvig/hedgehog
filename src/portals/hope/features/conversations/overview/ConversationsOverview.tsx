import styled from '@emotion/styled'
import { FadeDirection, FadeType, Flex } from '@hedvig-ui'
import { Button } from '@hedvig-ui/Button/button'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { ConversationsRemaining } from 'portals/hope/features/conversations/overview/ConversationsRemaining'
import {
  FilterSelect,
  FilterStateType,
} from 'portals/hope/features/questions/FilterSelect'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { QuestionGroup, UserSettingKey } from 'types/generated/graphql'
import { ConversationItem } from './ConversationItem'

const ConversationWrapper = styled.div`
  margin-top: 2em;
  overflow-y: scroll;
  width: 100%;
  height: 324px;
  padding-right: 1em;
  ::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const ConversationsOverview: React.FC<{
  filteredGroups: QuestionGroup[]
  currentMemberId?: string
  currentQuestionOrder: number
  filters: ReadonlyArray<FilterStateType>
  setFilters: (filter: FilterStateType, settingField?: UserSettingKey) => void
  fade: (direction: FadeDirection, type: FadeType) => Promise<void>
}> = ({ filteredGroups, currentMemberId, filters, setFilters, fade }) => {
  const { settings, updateSetting } = useMe()
  const history = useHistory()
  const { confirm } = useConfirmDialog()

  useTitle(
    `Conversations${
      filteredGroups && filteredGroups.length
        ? ` (${filteredGroups.length})`
        : ''
    }`,
    [filteredGroups],
  )

  useEffect(() => {
    if (
      !settings[UserSettingKey.FeatureFlags] ||
      !settings[UserSettingKey.FeatureFlags]?.conversations
    ) {
      updateSetting(UserSettingKey.FeatureFlags, {
        ...settings[UserSettingKey.FeatureFlags],
        conversations: true,
      })
      history.go(0)
    }
  }, [])

  const { register } = useNavigation()

  return (
    <Flex direction="column">
      <Flex direction="column" flex="0" style={{ marginBottom: '1em' }}>
        <FilterSelect
          small
          push="right"
          filters={filters}
          animationDelay={200}
          animationItemDelay={20}
          onToggle={setFilters}
        />
      </Flex>
      <ConversationsRemaining count={filteredGroups.length} />
      <Flex
        direction="column"
        flex="0"
        justify="center"
        style={{ marginTop: '0.5em' }}
      >
        <Flex direction="row" justify="center">
          <Button
            style={{ marginLeft: '-0.5em' }}
            variant="secondary"
            size="small"
            onClick={() =>
              confirm('Do you want to go back to the questions tab?').then(
                () => {
                  updateSetting(UserSettingKey.FeatureFlags, {
                    ...settings[UserSettingKey.FeatureFlags],
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
        </Flex>

        <ConversationWrapper>
          {filteredGroups.map((group, index) => {
            const navigation = register(
              group.memberId,
              {
                autoFocus: group.memberId === currentMemberId,
                resolve: 'Conversation Chat',
                neighbors: {
                  up: index ? filteredGroups[index - 1].memberId : undefined,
                  down:
                    index < filteredGroups.length - 1
                      ? filteredGroups[index + 1].memberId
                      : undefined,
                },
                onNavigation: (nextMemberId, direction) => {
                  if (direction === 'up' || direction === 'down') {
                    fade(direction, 'out').then(() => {
                      history.push(`/conversations/${nextMemberId}`)
                    })
                  }
                },
              },
              {
                border: 'none',
              },
              {
                border: 'none',
              },
            )

            return (
              <ConversationItem
                key={group.id}
                group={group}
                currentMemberId={currentMemberId}
                {...navigation}
              />
            )
          })}
        </ConversationWrapper>
      </Flex>
    </Flex>
  )
}
