import { useCreateCampaignPartnerMutation } from 'api/generated/graphql'
import { mapCampaignOwners } from 'features/tools/campaign-codes/utils'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

export const PartnerDropdownComponent: React.FC<{
  onChange: (data: any) => void
  value: string
  loading?: boolean
} & WithShowNotification> = ({
  onChange,
  value,
  loading = false,
  showNotification,
}) => {
  const [partnerCampaignOwners, { refetch }] = usePartnerCampaignOwners()
  const [createCampaignPartner] = useCreateCampaignPartnerMutation()

  return (
    <SearchableDropdown
      creatable={true}
      formatCreateLabel={(optionValue) => (
        <span>
          Create partner "<b>{optionValue}</b>"?
        </span>
      )}
      onCreateOption={(option) => {
        if (!option) {
          return
        }
        createCampaignPartner({
          variables: {
            partnerId: option
              .toLowerCase()
              .trim()
              .replace(' ', '_'),
            partnerName: option,
          },
        }).then((result) => {
          if (result?.data?.createCampaignPartner) {
            refetch().then(() =>
              showNotification({
                type: 'olive',
                header: 'Success',
                message: `Successfully created a new partner ${option}`,
              }),
            )
          } else {
            showNotification({
              type: 'red',
              header: 'Error',
              message: `Could not create a new partner ${option}`,
            })
          }
        })
      }}
      value={
        value
          ? {
              value,
              label: value,
            }
          : null
      }
      placeholder={'Which partner?'}
      isLoading={loading}
      isClearable={true}
      isCreatable={true}
      onChange={onChange}
      noOptionsMessage={() => 'No partners found'}
      options={mapCampaignOwners(partnerCampaignOwners)}
    />
  )
}

export const PartnerDropdown = withShowNotification(PartnerDropdownComponent)
