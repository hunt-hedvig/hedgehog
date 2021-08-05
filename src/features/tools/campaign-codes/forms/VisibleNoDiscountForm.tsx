import { AssignVoucherVisibleNoDiscount, Scalars } from 'api/generated/graphql'
import { DateRangeWrapper } from 'features/tools/campaign-codes/forms/FreeMonthsForm'
import { PartnerDropdown } from 'features/tools/campaign-codes/forms/PartnerDropdown'
import {
  addPartnerVisibleNoDiscountCodeOptions,
  useAddPartnerVisibleNoDiscountCode,
} from 'graphql/use-add-partner-visible-no-discount-code'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import { Label } from 'hedvig-ui/typography'
import React from 'react'
import { Input } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

interface VisibleNoDiscountFormData {
  code: string
  partnerId: string | null
  validFrom?: Scalars['Instant']
  validUntil?: Scalars['Instant']
}

const initialFormData: VisibleNoDiscountFormData = {
  code: '',
  partnerId: '',
  validFrom: null,
  validUntil: null,
}

const formIsValid = (formData: VisibleNoDiscountFormData) => {
  const { partnerId, code } = formData

  return !(!partnerId || !code)
}

const VisibleNoDiscount: React.FC<WithShowNotification> = ({
  showNotification,
}) => {
  const [formData, setFormData] = React.useState<VisibleNoDiscountFormData>(
    initialFormData,
  )

  const [
    setPartnerVisibleNoDiscount,
    { loading },
  ] = useAddPartnerVisibleNoDiscountCode()

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
      <div>
        <Button
          variation="primary"
          loading={loading}
          disabled={loading || !formIsValid(formData)}
          onClick={() => {
            if (
              !window.confirm(`Create new campaign code "${formData.code}"?`)
            ) {
              return
            }
            setPartnerVisibleNoDiscount(
              addPartnerVisibleNoDiscountCodeOptions(
                formData as AssignVoucherVisibleNoDiscount,
              ),
            )
              .then(() => {
                reset()
                showNotification({
                  type: 'olive',
                  header: 'Success',
                  message: `Successfully created a new visible no discount campaign for partner ${formData.partnerId}`,
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

export const VisibleNoDiscountForm = withShowNotification(VisibleNoDiscount)
