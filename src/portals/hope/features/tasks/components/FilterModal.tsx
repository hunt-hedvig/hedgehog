import React from 'react'
import { Flex, Label } from '@hedvig-ui'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { FilterSelect } from 'portals/hope/features/questions/FilterSelect'
import { useSelectedFilters } from 'portals/hope/features/questions/hooks/use-selected-filters'

export const FilterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { selectedFilters, toggleFilter } = useSelectedFilters()

  return (
    <FilterModal onClose={onClose}>
      <Flex
        style={{ height: '100%', width: '100%' }}
        direction="column"
        justify="space-between"
      >
        <div>
          <h4>Select Filters</h4>

          <Flex
            style={{
              flexWrap: 'wrap',
              marginTop: '3rem',
            }}
            justify="space-between"
          >
            <Flex
              direction="column"
              align="center"
              fullWidth
              style={{ marginBottom: '2rem' }}
            >
              <Label>Number of member groups</Label>
              <NumberMemberGroupsRadioButtons />
            </Flex>
            <FilterSelect
              filters={selectedFilters}
              onToggle={toggleFilter}
              animationDelay={0}
              animationItemDelay={20}
            />
          </Flex>
        </div>
      </Flex>
    </FilterModal>
  )
}
