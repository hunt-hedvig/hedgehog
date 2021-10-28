import styled from '@emotion/styled'
import { RadioGroup } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { totalNumberMemberGroups } from 'features/questions/filter'
import React from 'react'
import { useNumberMemberGroups } from 'utils/use-number-member-groups'

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
        onChange={setNumberMemberGroups}
        options={numberMemberGroupsOptions}
      />
    </Group>
  )
}
