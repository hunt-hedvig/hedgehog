import { totalNumberOfColors } from 'components/questions/filter'
import { RadioGroup } from 'hedvig-ui/radio'
import React, { useContext } from 'react'
import { range } from 'utils/array'
import { NumberColorsContext } from 'utils/number-colors-context'

const numberColorOptions = range(totalNumberOfColors - 1).map((colorNumber) => {
  return {
    value: colorNumber + 2,
    label: (colorNumber + 2).toString(),
  }
})

export const NumberColorsRadioButtons: React.FC = () => {
  const { numberColors, setNumberColors } = useContext(NumberColorsContext)

  return (
    <RadioGroup
      value={numberColors}
      setValue={setNumberColors}
      options={numberColorOptions}
    />
  )
}
