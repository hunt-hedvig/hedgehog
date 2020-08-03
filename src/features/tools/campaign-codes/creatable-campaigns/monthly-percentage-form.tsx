import { InfoRow } from 'components/member/tabs/shared/card-components'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import { Dropdown, Input } from 'semantic-ui-react'

export const MonthlyPercentageForm: React.FC<{}> = () => {
  return (
    <>
      <InfoRow>
        <Input onChange={(e) => void 0} placeholder="Code" />
        <div style={{ float: 'left' }}>
          <DateTimePicker
            date={null!}
            placeholder={'Valid from'}
            setDate={(data) => void 0}
          />
        </div>
        <div style={{ float: 'left' }}>
          <DateTimePicker
            date={null!}
            placeholder={'Valid to'}
            setDate={(data) => void 0}
          />
        </div>
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        <Input onChange={(e) => void 0} placeholder="Discount %" />
        <Input
          style={{ width: '27%' }}
          onChange={(e) => void 0}
          placeholder="Months"
        />
        <Button
          variation="primary"
          style={{ width: '27%' }}
          onClick={() => void 0}
        >
          Create
        </Button>
      </InfoRow>
    </>
  )
}
