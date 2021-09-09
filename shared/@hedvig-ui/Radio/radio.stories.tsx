import { Paragraph, RadioGroup, SecondLevelHeadline } from '@hedvig-ui'
import React, { useState } from 'react'

export default {
  title: 'Radio Group',
  component: RadioGroup,
}

export const StandardRadioGroup: React.FC = () => {
  const [value, setValue] = useState('apple')
  return (
    <>
      <SecondLevelHeadline>Select your favorite fruit</SecondLevelHeadline>
      <RadioGroup
        value={value}
        setValue={setValue}
        options={[
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
        ]}
      />
      <Paragraph>
        <strong>Selected fruit value: </strong> {value}
      </Paragraph>
    </>
  )
}
