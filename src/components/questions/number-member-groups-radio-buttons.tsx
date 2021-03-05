import { totalNumberMemberGroups } from 'components/questions/filter'
import { RadioGroup } from 'hedvig-ui/radio'
import React from 'react'
import { range } from 'utils/array'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

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
    <RadioGroup
      value={numberMemberGroups}
      setValue={setNumberMemberGroups}
      options={numberMemberGroupsOptions}
    />
  )
}
