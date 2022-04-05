import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { Flex, useQueryParams } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import { QuestionGroup } from 'types/generated/graphql'
import { parseISO } from 'date-fns'
import {
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/questions/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { MemberContainer } from '../../features/tasks/components/MemberContainer'
import { TaskChat } from '../../features/tasks/TaskChat'
import { FilterModal } from 'portals/hope/features/tasks/components/FilterModal'
import { useSelectedFilters } from 'portals/hope/features/questions/hooks/use-selected-filters'
import { useResolveQuestion } from 'portals/hope/features/questions/hooks/use-resolve-question'
import { useHistory } from 'react-router'
import { motion } from 'framer-motion'
import {
  formatLocale,
  useTemplateMessages,
} from '../../features/template-messages/use-template-messages'
import formatDate from 'date-fns/format'
import { ClaimContainer } from 'portals/hope/features/tasks/components/ClaimContainer'
import { useClaimRegistrationDate } from 'portals/hope/common/hooks/use-claim-registration-date'
import { TaskListItem } from 'portals/hope/features/tasks/components/TaskListItem'
import { useMemberName } from 'portals/hope/common/hooks/use-member-name'

const TaskNavigationWrapper = styled.div`
  height: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  clip-path: inset(0px -10rem 0px 0px);
  background-color: white;

  min-width: 70%;

  margin-left: -4rem;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`

const TaskChatWrapper = styled.div`
  position: relative;
  height: 100%;
  min-width: 30%;
  width: 100%;

  &::-webkit-scrollbar {
    appearance: none;
    width: 0;
    display: none;
  }
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
  width: 100%;
`

const TopBarItem = styled.button<{ selected?: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected
      ? 'transparent'
      : chroma(theme.semiStrongForeground).alpha(0.05).hex()};
  border: none;
  cursor: pointer;
  padding: 2rem 2rem;

  display: flex;
  align-items: center;

  color: ${({ theme, selected }) =>
    selected
      ? undefined
      : chroma(theme.semiStrongForeground).brighten(2).hex()};

  transition: color 200ms;
  :hover {
    color: ${({ theme }) => chroma(theme.semiStrongForeground).alpha(4).hex()};
  }

  .count {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(2).hex()};
    display: inline-block;
    font-size: 1.1rem;
    margin-left: 1rem;
    margin-top: 0.1rem;
  }
`

const FilterBarItem = styled(motion.button)`
  background-color: transparent;
  transition: background-color 200ms;
  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(3.25).hex()};
  }
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  margin: 1.8rem 2rem;

  padding: 0.4rem 0.6rem;

  font-size: 0.8rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(1).hex()};

  .icon {
    width: 0.6rem;
    height: 0.6rem;
    margin-left: 0.15rem;
  }
`

const ListContainer = styled(motion.ul)`
  flex: 1;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  & {
    margin: 0;
    padding: 0;
  }
`

const Container = styled(Flex)`
  margin-top: -4rem;
  padding-left: 4rem;
  overflow-y: hidden;
  width: calc(100% + 4rem);
  margin-left: -4rem;
`

const TasksPage: Page = () => {
  const history = useHistory()
  const queryParams = useQueryParams()

  const memberId = queryParams.get('memberId')
  const tab = queryParams.get('tab')
  const claimId = queryParams.get('claimId')

  const { fullName: fullNameByQuery } = useMemberName(memberId ?? '')

  const { resolve } = useResolveQuestion()
  const { numberMemberGroups } = useNumberMemberGroups()
  const [questionGroups, { loading }] = useQuestionGroups()
  const { selectedFilters: filters, toggleFilter } = useSelectedFilters()

  const claimRegistrationDate = useClaimRegistrationDate(claimId ?? '')

  const [showFilters, setShowFilters] = useState(false)

  const [selectedQuestionGroup, setSelectedQuestionGroup] =
    useState<QuestionGroup | null>(null)

  const { setLocale, setMemberId, changeLocaleDisplayed } =
    useTemplateMessages()

  const groups =
    filters.length > 0
      ? questionGroups
          .filter(doMemberGroupFilter(numberMemberGroups)(filters))
          .filter(doMarketFilter(filters))
      : questionGroups

  const groupByRoute = groups.find((group) => group.memberId === memberId)

  useEffect(() => {
    if (loading) return

    if (groupByRoute) {
      setSelectedQuestionGroup(groupByRoute)

      return
    }

    history.replace('/questions')
    setSelectedQuestionGroup(null)
  }, [groupByRoute])

  const selectQuestionGroupHandler = (group: QuestionGroup | null) => {
    setSelectedQuestionGroup(group)

    if (!group) {
      return
    }

    setMemberId(group.memberId)

    if (
      group.pickedLocale &&
      formatLocale(group.pickedLocale as PickedLocale, true) ===
        formatLocale(PickedLocale.EnSe, true)
    ) {
      changeLocaleDisplayed(group.memberId, true)
    }

    setLocale((group.pickedLocale || PickedLocale.SvSe) as PickedLocale)
  }

  const fullName =
    selectedQuestionGroup?.firstName && selectedQuestionGroup?.lastName
      ? `${selectedQuestionGroup.firstName} ${selectedQuestionGroup.lastName}`
      : fullNameByQuery

  const title = memberId
    ? `Questions | ${fullName}`
    : `Questions ${groups.length ? '(' + groups.length + ')' : ''}`

  useTitle(title, [fullName])

  return (
    <>
      <Container>
        <TaskNavigationWrapper>
          <>
            <TopBar>
              <Flex>
                <TopBarItem
                  selected={!memberId}
                  onClick={() => history.replace(`/questions`)}
                >
                  Incoming questions
                  <div className="count">{groups.length}</div>
                </TopBarItem>
                {memberId && (
                  <TopBarItem
                    selected={!claimId}
                    onClick={() =>
                      history.replace(
                        `/questions?memberId=${memberId}&tab=${tab}`,
                      )
                    }
                  >
                    {fullName ?? 'Member'}
                  </TopBarItem>
                )}
                {memberId && claimId && (
                  <TopBarItem selected={true}>
                    Claim{' '}
                    {claimRegistrationDate &&
                      formatDate(
                        parseISO(claimRegistrationDate),
                        'dd MMMM, yyyy',
                      )}
                  </TopBarItem>
                )}
              </Flex>
              <FilterBarItem
                onClick={() => setShowFilters(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Filters
              </FilterBarItem>
            </TopBar>
            {memberId && !claimId && (
              <ListContainer>
                <MemberContainer
                  memberId={memberId}
                  tab={tab ?? 'contracts'}
                  title={title}
                  onChangeTab={(newTab) =>
                    history.replace(
                      `/questions?memberId=${memberId}&tab=${newTab}`,
                    )
                  }
                  onClickClaim={(claimId: string) =>
                    history.replace(
                      `/questions?memberId=${memberId}&tab=${tab}&claimId=${claimId}`,
                    )
                  }
                />
              </ListContainer>
            )}
            {claimId && (
              <ListContainer>
                <ClaimContainer claimId={claimId} />
              </ListContainer>
            )}
            {!memberId && (
              <ListContainer>
                {groups.map((group) => (
                  <TaskListItem
                    key={group.id}
                    group={group}
                    onClick={() => selectQuestionGroupHandler(group)}
                    selected={
                      group.memberId === selectedQuestionGroup?.memberId
                    }
                  />
                ))}
              </ListContainer>
            )}
          </>
        </TaskNavigationWrapper>
        <TaskChatWrapper>
          {(selectedQuestionGroup || memberId) && (
            <TaskChat
              resolvable={!!(selectedQuestionGroup || groupByRoute)}
              memberId={selectedQuestionGroup?.memberId ?? memberId ?? ''}
              fullName={fullName}
              onResolve={() => {
                if (!selectedQuestionGroup) return

                resolve(selectedQuestionGroup.memberId)
                history.replace(`/questions`)
              }}
              onSelectMember={(openClaimId) => {
                if (!selectedQuestionGroup) return

                if (!openClaimId) {
                  history.replace(
                    `/questions?memberId=${selectedQuestionGroup.memberId}`,
                  )
                } else {
                  history.replace(
                    `/questions?memberId=${selectedQuestionGroup.memberId}&tab=claims&claimId=${openClaimId}`,
                  )
                }
              }}
            />
          )}
        </TaskChatWrapper>
      </Container>

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onToggle={toggleFilter}
      />
    </>
  )
}

export default TasksPage
