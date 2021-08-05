import { AssignVoucherPercentageDiscount, Scalars } from 'api/generated/graphql'
import { PartnerDropdown } from 'features/tools/campaign-codes/forms/PartnerDropdown'
import {
  addPartnerPercentageDiscountCodeOptions,
  useAddPartnerPercentageDiscountCode,
} from 'graphql/use-add-partner-percentage-discount-code'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { Label } from 'hedvig-ui/typography'
import React from 'react'
import { Input } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import {
  numberOfMonthsOptions,
  percentageDiscountOptions,
} from 'utils/campaignCodes'
import { withShowNotification } from 'utils/notifications'
import { DateRangeWrapper } from './FreeMonthsForm'

const initialFormData: MonthlyPercentageFormData = {
  code: '',
  partnerId: null,
  numberOfMonths: null,
  percentageDiscount: null,
  validFrom: null,
  validUntil: null,
}

const formLooksGood = (formData: MonthlyPercentageFormData) => {
  const { partnerId, code, percentageDiscount, numberOfMonths } = formData

  return !(!partnerId || !numberOfMonths || !code || !percentageDiscount)
}

interface MonthlyPercentageFormData {
  partnerId: string | null
  numberOfMonths: number | null
  percentageDiscount: number | null
  code: string
  validFrom?: Scalars['Instant']
  validUntil?: Scalars['Instant']
}

const MonthlyPercentage: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
  const [formData, setFormData] = React.useState<MonthlyPercentageFormData>(
    initialFormData,
  )

  const [
    setPartnerPercentageDiscount,
    { loading },
  ] = useAddPartnerPercentageDiscountCode()

  const reset = () => setFormData(initialFormData)

  return (
    <>
      <Label>Partner</Label>
      <PartnerDropdown
        loading={loading}
        onChange={(data) =>
          setFormData({
            ...formData,
            partnerId: data ? (data.value as string) : null,
          })
        }
        value={formData.partnerId ?? ''}
      />
      <Spacing top={'small'} />
      <Label>Code</Label>
      <Input
        value={formData.code}
        fluid
        disabled={loading}
        onChange={({ currentTarget: { value: code } }) =>
          setFormData({ ...formData, code })
        }
        placeholder="Code"
      />
      <Spacing top={'small'} />
      <DateRangeWrapper>
        <div style={{ width: '100%', paddingRight: '1.0em' }}>
          <Label>Valid from</Label>
          <DateTimePicker
            fullWidth={true}
            date={formData.validFrom}
            placeholder={'Beginning of time'}
            setDate={(validFrom) => setFormData({ ...formData, validFrom })}
          />
        </div>
        <div style={{ width: '100%', paddingLeft: '1.0em' }}>
          <Label>Valid to</Label>
          <DateTimePicker
            fullWidth={true}
            date={formData.validUntil}
            placeholder={'End of time'}
            setDate={(validUntil) => setFormData({ ...formData, validUntil })}
          />
        </div>
      </DateRangeWrapper>
      <Spacing top={'small'} />
      <Label>Percentage discount</Label>
      <SearchableDropdown
        value={
          formData.percentageDiscount
            ? {
                value: formData.percentageDiscount,
                label: formData.percentageDiscount + '%',
              }
            : null
        }
        placeholder={'How much percentage discount?'}
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            percentageDiscount: data ? (data.value as number) : null,
          })
        }
        noOptionsMessage={() => 'Option not found'}
        options={percentageDiscountOptions}
      />
      <Spacing top={'small'} />
      <Label>Months</Label>
      <SearchableDropdown
        value={
          formData.numberOfMonths
            ? { value: formData.numberOfMonths, label: formData.numberOfMonths }
            : null
        }
        placeholder={'How many months?'}
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            numberOfMonths: data ? (data.value as number) : null,
          })
        }
        noOptionsMessage={() => 'Option not found'}
        options={numberOfMonthsOptions}
      />
      <Spacing top={'small'} />
      <div>
        <Button
          variation="primary"
          loading={loading}
          disabled={loading || !formLooksGood(formData)}
          onClick={() => {
            console.log(formData)
            if (
              !window.confirm(`Create new campaign code "${formData.code}"?`)
            ) {
              return
            }
            setPartnerPercentageDiscount(
              addPartnerPercentageDiscountCodeOptions(
                formData as AssignVoucherPercentageDiscount,
              ),
            )
              .then(() => {
                reset()
                showNotification({
                  type: 'olive',
                  header: 'Success',
                  message: `Successfully created a new percentage campaign for partner ${formData.partnerId}`,
                })
              })
              .catch((error) => {
                showNotification({
                  type: 'red',
                  header: 'Error',
                  message: error.message,
                })
                throw error
              })
          }}
        >
          Create New Campaign
        </Button>
      </div>
    </>
  )
}

export const MonthlyPercentageForm = withShowNotification(MonthlyPercentage)
