import { totalNumberOfColors } from 'components/questions/filter'
import { RadioGroup } from 'hedvig-ui/radio'
import React, { useContext } from 'react'
import { NumberTeamsContext } from 'utils/number-teams-context'

const teamOptions = [...Array(totalNumberOfColors - 1)].map((_, i) => {
  return {
    value: i + 2,
    label: (i + 2).toString(),
  }
})

export const NumberTeamsRadioButtons: React.FC = () => {
  const { numberTeams, setNumberTeams } = useContext(NumberTeamsContext)

  return (
    <RadioGroup
      value={numberTeams}
      setValue={setNumberTeams}
      options={teamOptions}
    />
  )
}
