import { Paragraph, RadioGroup, SecondLevelHeadline } from '@hedvig-ui'
import { boolean } from '@storybook/addon-knobs'
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

export const StandardRadio = () => {
  const [value, setValue] = useState<string>('banana')

  return (
    <div style={{ padding: 20 }}>
      <SecondLevelHeadline>Select your favorite fruit</SecondLevelHeadline>
      <div style={{ display: 'flex', gap: 15, marginBottom: 15 }}>
        <RadioGroup
          value={value}
          onChange={(v) => setValue(v as string)}
          options={OPTIONS_LIST.map((opt) => ({
            ...opt,
            disabled: boolean('Disabled', false),
          }))}
        />
      </div>
      <Paragraph>
        <strong>Selected fruit value: </strong> {value}
      </Paragraph>
    </div>
  )
}
