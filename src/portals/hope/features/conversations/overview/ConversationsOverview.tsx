import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
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
}> = ({ filteredGroups, currentMemberId, filters, setFilters }) => {
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
      !settings.featureFlags ||
      !settings.featureFlags.filter(entry => entry.key === "conversations")
    ) {
      updateSetting(UserSettingKey.FeatureFlags, {
        ...settings.featureFlags,
        conversations: true,
      })
      history.go(0)
    }
  }, [])

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
                    ...settings.featureFlags,
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
          {filteredGroups.map((group) => (
            <ConversationItem
              key={group.id}
              group={group}
              currentMemberId={currentMemberId}
            />
          ))}
        </ConversationWrapper>
      </Flex>
    </Flex>
  )
}
