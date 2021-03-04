import { totalNumberMemberGroups } from 'components/questions/filter'
import { RadioGroup } from 'hedvig-ui/radio'
import React, { useContext } from 'react'
import { range } from 'utils/array'
import { NumberMemberGroupsContext } from 'utils/number-member-groups-context'

const numberMemberGroupsOptions = range(totalNumberMemberGroups - 1).map(
  (numberMemberGroups) => {
    return {
      value: numberMemberGroups + 2,
      label: (numberMemberGroups + 2).toString(),
    }
  },
)

export const NumberMemberGroupsRadioButtons: React.FC = () => {
  const { numberMemberGroups, setNumberMemberGroups } = useContext(
    NumberMemberGroupsContext,
  )

  return (
    <RadioGroup
      value={numberMemberGroups}
      setValue={setNumberMemberGroups}
      options={numberMemberGroupsOptions}
    />
  )
}
