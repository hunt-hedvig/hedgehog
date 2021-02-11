import { totalNumberOfTeams } from 'components/questions/filter'
import { RadioGroup } from 'hedvig-ui/radio'
import React, { useContext } from 'react'
import { NumberColorsContext } from 'utils/number-colors-context'

const teamOptions = [...Array(totalNumberOfTeams - 1)].map((_, i) => {
  return {
    value: i + 2,
    label: (i + 2).toString(),
  }
})

export const NumberColorsRadioButtons: React.FC = () => {
  const { numberColors, setNumberColors } = useContext(NumberColorsContext)

  return (
    <RadioGroup
      value={numberColors}
      setValue={setNumberColors}
      options={teamOptions}
    />
  )
}
