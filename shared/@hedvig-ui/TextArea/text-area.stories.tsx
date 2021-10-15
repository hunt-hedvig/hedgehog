import { TextArea } from '@hedvig-ui'
import { boolean, text } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'TextArea',
  component: TextArea,
  decorators: [],
}

export const TextAreaStandard: React.FC = () => {
  const [value, setValue] = React.useState('')

  return (
    <div style={{ padding: '20px 40px' }}>
      <TextArea
        placeholder="Write your life story here..."
        resize={boolean('Resize', false)}
        autoResize={boolean('Auto resize', false)}
        maxHeight={text('Max Height', '300px')}
        value={value}
        onChange={setValue}
      />
      <p>
        <strong>Written text:</strong> {value}
      </p>
    </div>
  )
}
