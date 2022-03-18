import React from 'react'
import { Flex, Label, Modal } from '@hedvig-ui'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import {
  FilterSelect,
  FilterStateType,
} from 'portals/hope/features/questions/FilterSelect'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { UserSettingKey } from 'types/generated/graphql'

const Container = styled(Modal)`
  width: 60rem;

  padding: 1.5rem 1.5rem 5rem;

  h4 {
    font-size: 1.4rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .tip {
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;
    font-size: 0.8rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    text-align: center;
  }
`

export const FilterModal: React.FC<{
  onClose: () => void
  onToggle: (filter: FilterStateType, settingField?: UserSettingKey) => void
  filters: number[]
}> = ({ onClose, onToggle, filters }) => {
  return (
    <Container onClose={onClose}>
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
              filters={filters}
              onToggle={onToggle}
              animationDelay={0}
              animationItemDelay={20}
            />
          </Flex>
        </div>
      </Flex>
    </Container>
  )
}
