import { Button, FadeIn, Flex } from '@hedvig-ui'
import { FilterSelect } from 'features/conversations/FilterSelect'
import { FilterState } from 'features/questions/filter'
import React from 'react'
import { useHistory } from 'react-router'
import { useInsecurePersistentState } from 'utils/state'

export const ConversationsSettingsPage: React.FC<{}> = () => {
  const history = useHistory()
  const [filters, setFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.First,
    FilterState.Second,
    FilterState.Third,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  return (
    <>
      <div style={{ marginTop: '25vh' }} />
      <FilterSelect
        filters={filters}
        animationDelay={200}
        animationItemDelay={20}
        onToggle={(filter) => {
          if (filters.includes(filter)) {
            setFilters(filters.filter((prevFilter) => filter !== prevFilter))
          } else {
            setFilters([...filters, filter])
          }
        }}
      />
      {!!filters.length && (
        <FadeIn style={{ width: '100%' }}>
          <Flex
            direction="column"
            justify="center"
            align="center"
            style={{ marginTop: '4.0em' }}
          >
            <Button
              onClick={() => history.push('/conversations')}
              variation="primary"
              style={{ marginBottom: '0.5em', width: '300px' }}
            >
              Done
            </Button>
          </Flex>
        </FadeIn>
      )}
    </>
  )
}
