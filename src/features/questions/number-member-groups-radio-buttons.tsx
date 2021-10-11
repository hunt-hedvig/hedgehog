import styled from '@emotion/styled'
import { RadioNew as RadioGroup } from '@hedvig-ui'
import { totalNumberMemberGroups } from 'features/questions/filter'
import React from 'react'
import { range } from 'utils/array'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

const Group = styled.div`
  display: flex;
  align-items: center;

  & > div:not(:last-child) {
    margin-right: 28px;
  }
`

const numberMemberGroupsOptions = range(totalNumberMemberGroups - 1).map(
  (numberMemberGroups) => {
    return {
      value: numberMemberGroups + 2,
      label: (numberMemberGroups + 2).toString(),
    }
  },
)

export const NumberMemberGroupsRadioButtons: React.FC = () => {
  const { numberMemberGroups, setNumberMemberGroups } = useNumberMemberGroups()

  return (
    <Group>
      <RadioGroup
        value={numberMemberGroups}
        setValue={setNumberMemberGroups}
        options={numberMemberGroupsOptions}
      />
    </Group>
  )
}
