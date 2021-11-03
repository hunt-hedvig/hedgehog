import { Button, FadeIn, Flex } from '@hedvig-ui'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import {
  FilterSelect,
  FilterState,
  FilterStateType,
} from 'features/questions/FilterSelect'
import React from 'react'
import { useHistory } from 'react-router'

const ConversationsSettingsPage: React.FC<{}> = () => {
  const history = useHistory()
  const [filters, setFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterStateType>
  >('questions:filters', [FilterState.HasOpenClaim, FilterState.NoOpenClaim])

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
      <FadeIn style={{ width: '100%' }}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={{ marginTop: '4.0em' }}
        >
          <Button
            onClick={() => history.push('/conversations')}
            style={{ marginBottom: '0.5em', width: '300px' }}
          >
            Done
          </Button>
        </Flex>
      </FadeIn>
    </>
  )
}

export default ConversationsSettingsPage
