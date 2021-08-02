import { AssignVoucherFreeMonths, Scalars } from 'api/generated/graphql'
import { mapCampaignOwners } from 'features/tools/campaign-codes/utils'
import {
  addPartnerFreeMonthsCodeOptions,
  useAddPartnerFreeMonthsCode,
} from 'graphql/use-add-partner-free-months-code'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { Label } from 'hedvig-ui/typography'
import React from 'react'
import { Input } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { numberOfMonthsOptions } from 'utils/campaignCodes'
import { withShowNotification } from 'utils/notifications'

interface FreeMonthsFormData {
  partnerId: string | null
  numberOfFreeMonths: number | null
  code: string
  validFrom?: Scalars['Instant']
  validUntil?: Scalars['Instant']
}

const initialFormData: FreeMonthsFormData = {
  code: '',
  partnerId: '',
  numberOfFreeMonths: null,
  validFrom: null,
  validUntil: null,
}

const formLooksGood = (formData: FreeMonthsFormData) => {
  const { partnerId, code, numberOfFreeMonths } = formData

  return !(!partnerId || !code || !numberOfFreeMonths)
}

const FreeMonths: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
  const [formData, setFormData] = React.useState<FreeMonthsFormData>(
    initialFormData,
  )

  const [partnerCampaignOwners] = usePartnerCampaignOwners()
  const [setPartnerFreeMonths, { loading }] = useAddPartnerFreeMonthsCode()

  const reset = () => setFormData(initialFormData)

  return (
    <>
      <Label>Partner</Label>
      <SearchableDropdown
        value={
          formData.partnerId
            ? {
                value: formData.partnerId,
                label: formData.partnerId,
              }
            : null
        }
        placeholder={'Which partner?'}
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            partnerId: data ? (data.value as string) : null,
          })
        }
        noOptionsMessage={() => 'No partners found'}
        options={mapCampaignOwners(partnerCampaignOwners)}
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '100%', paddingRight: '1.0em' }}>
          <Label>Valid from</Label>
          <DateTimePicker
            fullWidth={true}
            date={formData.validFrom}
            setDate={(validFrom) => setFormData({ ...formData, validFrom })}
          />
        </div>
        <div style={{ width: '100%', paddingLeft: '1.0em' }}>
          <Label>Valid to</Label>
          <DateTimePicker
            fullWidth={true}
            date={formData.validUntil}
            setDate={(validUntil) => setFormData({ ...formData, validUntil })}
          />
        </div>
      </div>
      <Spacing top={'small'} />
      <Label>Months</Label>
      <SearchableDropdown
        value={
          formData.numberOfFreeMonths
            ? {
                value: formData.numberOfFreeMonths,
                label: formData.numberOfFreeMonths,
              }
            : null
        }
        placeholder={'How many free months?'}
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            numberOfFreeMonths: data ? (data.value as number) : null,
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
            if (
              !window.confirm(`Create new campaign code "${formData.code}"?`)
            ) {
              return
            }
            setPartnerFreeMonths(
              addPartnerFreeMonthsCodeOptions(
                formData as AssignVoucherFreeMonths,
              ),
            )
              .then(() => {
                reset()
                showNotification({
                  type: 'olive',
                  header: 'Success',
                  message: `Successfully created a new free month campaign for partner ${formData.partnerId}`,
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

export const FreeMonthsForm = withShowNotification(FreeMonths)
