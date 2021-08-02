import { AssignVoucherVisibleNoDiscount } from 'api/generated/graphql'
import { ClearableDropdown as Dropdown } from 'features/tools/campaign-codes/components/ClearableDropdown'
import {
  addPartnerVisibleNoDiscountCodeOptions,
  useAddPartnerVisibleNoDiscountCode,
} from 'graphql/use-add-partner-visible-no-discount-code'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import { Input } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import { DateTimePickerWrapper, Row } from '../styles'
import { mapCampaignOwners } from '../utils'

const initialFormData: AssignVoucherVisibleNoDiscount = {
  code: '',
  partnerId: '',
  validFrom: null,
  validUntil: null,
}

const formIsValid = (formData: AssignVoucherVisibleNoDiscount) => {
  return formData.partnerId !== '' && formData.code !== ''
}

const VisibleNoDiscount: React.FC<WithShowNotification> = ({
  showNotification,
}) => {
  const [formData, setFormData] = React.useState<
    AssignVoucherVisibleNoDiscount
  >(initialFormData)

  const [partnerCampaignOwners] = usePartnerCampaignOwners()
  const [
    setPartnerVisibleNoDiscount,
    { loading },
  ] = useAddPartnerVisibleNoDiscountCode()

  const reset = () => setFormData(initialFormData)

  return (
    <>
      <label>Partner</label>
      <Dropdown
        value={formData.partnerId}
        disabled={loading}
        placeholder={'Partner'}
        onChange={(_, { value: partnerId }) =>
          setFormData({ ...formData, partnerId: partnerId as string })
        }
        onClear={() => setFormData({ ...formData, partnerId: '' })}
        options={mapCampaignOwners(partnerCampaignOwners)}
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
        <DateTimePickerWrapper>
          <DateTimePicker
            fullWidth
            disabled={loading}
            date={formData.validFrom!}
            placeholder={'Valid from'}
            setDate={(validFrom) => setFormData({ ...formData, validFrom })}
          />
          <DateTimePicker
            fullWidth
            disabled={loading}
            date={formData.validUntil!}
            placeholder={'Valid until'}
            setDate={(validUntil) => setFormData({ ...formData, validUntil })}
          />
        </DateTimePickerWrapper>
      </Row>
      <Spacing top={'small'} />
      <Button
        variation="primary"
        loading={loading}
        disabled={loading || !formIsValid(formData)}
        onClick={() => {
          if (!window.confirm(`Create new campaign code "${formData.code}"?`)) {
            return
          }
          setPartnerVisibleNoDiscount(
            addPartnerVisibleNoDiscountCodeOptions(formData),
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
    </>
  )
}

export const VisibleNoDiscountForm = withShowNotification(VisibleNoDiscount)
