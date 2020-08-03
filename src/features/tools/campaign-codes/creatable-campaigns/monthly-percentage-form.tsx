import { AssignVoucherPercentageDiscount } from 'api/generated/graphql'
import { InfoRow } from 'components/member/tabs/shared/card-components'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import { Dropdown, Input } from 'semantic-ui-react'
import {
  numberOfMonthsOptions,
  percentageDiscountOptions,
} from 'utils/campaignCodes'

export const MonthlyPercentageForm: React.FC<{}> = () => {
  const [formData, setFormData] = React.useState<
    AssignVoucherPercentageDiscount
  >({
    code: '',
    partnerId: '',
    numberOfMonths: 0,
    percentageDiscount: 0.0,
    validFrom: null,
    validUntil: null,
  })

  return (
    <>
      <label>Partner</label>
      <InfoRow>
        <Dropdown
          label={'Partner'}
          placeholder="Partner"
          fluid
          search
          selection
          options={[]}
          onChange={(_, { value: partnerId }) =>
            setFormData({ ...formData, partnerId: partnerId as string })
          }
        />
      </InfoRow>
      <Spacing top={'small'} />
      <label>Code</label>
      <InfoRow>
        <Input
          style={{ width: '100%' }}
          onChange={({ currentTarget: { value: code } }) =>
            setFormData({ ...formData, code })
          }
          placeholder="Code"
        />
      </InfoRow>
      <Spacing top={'small'} />
      <label>Valid period</label>
      <InfoRow>
        <div style={{ float: 'left' }}>
          <DateTimePicker
            fullWidth
            date={formData.validFrom!}
            placeholder={'Valid from'}
            setDate={(validFrom) => setFormData({ ...formData, validFrom })}
          />
        </div>
        <div style={{ float: 'left' }}>
          <DateTimePicker
            fullWidth
            date={formData.validUntil!}
            placeholder={'Valid until'}
            setDate={(validUntil) => setFormData({ ...formData, validUntil })}
          />
        </div>
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        <Dropdown
          placeholder="Discount %"
          search
          selection
          options={percentageDiscountOptions}
          onChange={(_, { value: percentageDiscount }) =>
            setFormData({
              ...formData,
              percentageDiscount: percentageDiscount as number,
            })
          }
        />
        <Button variation="primary" onClick={() => void 0}>
          Create
        </Button>
      </InfoRow>
      <InfoRow>
        <Dropdown
          placeholder="Months"
          search
          selection
          options={numberOfMonthsOptions}
          onChange={(_, { value: numberOfMonths }) => {
            setFormData({
              ...formData,
              numberOfMonths: numberOfMonths as number,
            })
          }}
        />
        <Spacing left={'small'} />
      </InfoRow>
    </>
  )
}
