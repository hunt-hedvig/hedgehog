import {
  Paragraph,
  RadioGroup,
  RadioNew,
  SecondLevelHeadline,
} from '@hedvig-ui'
import React, { useState } from 'react'

export default {
  title: 'Radio Group',
  component: RadioGroup,
}

const OPTIONS_LIST = [
  {
    value: 'apple',
    label: 'Apple',
  },
  {
    value: 'orange',
    label: 'Orange',
  },
  {
    value: 'banana',
    label: 'Banana',
  },
  {
    value: 'pear',
    label: 'Pear',
  },
  {
    value: 'pineapple',
    label: 'Pineapple',
  },
  {
    value: 'lemon',
    label: 'Lemon',
  },
]

export const StandardRadioGroup: React.FC = () => {
  const [value, setValue] = useState('banana')
  return (
    <>
      <SecondLevelHeadline>Select your favorite fruit</SecondLevelHeadline>
      <RadioGroup value={value} setValue={setValue} options={OPTIONS_LIST} />
      <Paragraph>
        <strong>Selected fruit value: </strong> {value}
      </Paragraph>
    </>
  )
}

export const NoSemanticRadio = () => {
  const [value, setValue] = useState('orange')

  return (
    <>
      <SecondLevelHeadline>Select your favorite fruit</SecondLevelHeadline>
      <div style={{ display: 'flex', gap: 15, marginBottom: 15 }}>
        <RadioNew value={value} setValue={setValue} options={OPTIONS_LIST} />
      </div>
      <Paragraph>
        <strong>Selected fruit value: </strong> {value}
      </Paragraph>
    </>
  )
}
