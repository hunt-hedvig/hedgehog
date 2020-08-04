import { AssignVoucherPercentageDiscount } from 'api/generated/graphql'
import { Centered, Row } from 'features/tools/campaign-codes/styles'
import {
  formLooksGood,
  mapCampaignOwners,
} from 'features/tools/campaign-codes/utils'
import {
  addPartnerPercentageDiscountCodeOptions,
  useAddPartnerPercentageDiscountCode,
} from 'graphql/use-add-partner-percentage-discount-code'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import { Dropdown, Input } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import {
  numberOfMonthsOptions,
  percentageDiscountOptions,
} from 'utils/campaignCodes'
import { withShowNotification } from 'utils/notifications'

// TODO: Dropdowns should be clearable

const initialFormData: AssignVoucherPercentageDiscount = {
  code: '',
  partnerId: '',
  numberOfMonths: 0,
  percentageDiscount: 0.0,
  validFrom: null,
  validUntil: null,
}

const MonthlyPercentage: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
  const [formData, setFormData] = React.useState<
    AssignVoucherPercentageDiscount
  >(initialFormData)

  const [partnerCampaignOwners] = usePartnerCampaignOwners()

  const [
    setPartnerPercentageDiscount,
    { loading },
  ] = useAddPartnerPercentageDiscountCode()

  const reset = () => setFormData(initialFormData)

  return (
    <>
      <label>Partner</label>
      <Dropdown
        label={'Partner'}
        placeholder="Partner"
        disabled={loading}
        fluid
        search
        selection
        selectOnBlur={false}
        value={formData.partnerId}
        options={mapCampaignOwners(partnerCampaignOwners)}
        onChange={(_, { value: partnerId }) =>
          setFormData({ ...formData, partnerId: partnerId as string })
        }
      />
      <Spacing top={'small'} />
      <label>Code</label>
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
      <label>Valid period</label>
      <Row>
        <div style={{ float: 'left' }}>
          <DateTimePicker
            fullWidth
            disabled={loading}
            date={formData.validFrom!}
            placeholder={'Valid from'}
            setDate={(validFrom) => setFormData({ ...formData, validFrom })}
          />
        </div>
        <div style={{ float: 'right' }}>
          <DateTimePicker
            fullWidth
            disabled={loading}
            date={formData.validUntil!}
            placeholder={'Valid until'}
            setDate={(validUntil) => setFormData({ ...formData, validUntil })}
          />
        </div>
      </Row>
      <Spacing top={'small'} />
      <label>Percentage discount</label>
      <Dropdown
        placeholder="Discount %"
        search
        fluid
        selection
        selectOnBlur={false}
        disabled={loading}
        options={percentageDiscountOptions}
        value={formData.percentageDiscount}
        onChange={(_, { value: percentageDiscount }) =>
          setFormData({
            ...formData,
            percentageDiscount: percentageDiscount as number,
          })
        }
      />
      <Spacing top={'small'} />
      <label>Months</label>
      <Dropdown
        placeholder="Months"
        search
        fluid
        disabled={loading}
        selectOnBlur={false}
        selection
        options={numberOfMonthsOptions}
        value={formData.numberOfMonths}
        onChange={(_, { value: numberOfMonths }) => {
          setFormData({
            ...formData,
            numberOfMonths: numberOfMonths as number,
          })
        }}
      />
      <Spacing top={'small'} />
      <Centered>
        <Button
          variation="primary"
          loading={loading}
          disabled={loading || !formLooksGood(formData)}
          onClick={() => {
            if (
              !window.confirm(`Create new campaign code "${formData.code}"?`)
            ) {
              return
            }
            setPartnerPercentageDiscount(
              addPartnerPercentageDiscountCodeOptions(formData),
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
      </Centered>
    </>
  )
}

export const MonthlyPercentageForm = withShowNotification(MonthlyPercentage)
