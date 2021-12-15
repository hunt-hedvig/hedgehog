import { SearchableDropdown } from '@hedvig-ui'
import { usePartnerCampaignOwners } from 'portals/hope/features/tools/campaign-codes/hooks/use-get-partner-campaign-owners'
import { mapCampaignOwners } from 'portals/hope/features/tools/campaign-codes/utils'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useCreateCampaignPartnerMutation } from 'types/generated/graphql'

export const PartnerDropdown: React.FC<{
  onChange: (data: any) => void
  value: string
  loading?: boolean
  creatable?: boolean
  placeholder?: string
}> = ({
  onChange,
  value,
  loading = false,
  creatable = true,
  placeholder = 'Which partner?',
}) => {
  const [partnerCampaignOwners, { refetch }] = usePartnerCampaignOwners()
  const [createCampaignPartner] = useCreateCampaignPartnerMutation()

  return (
    <SearchableDropdown
      creatable={creatable}
      formatCreateLabel={(optionValue) => (
        <span>
          Create partner "<b>{optionValue}</b>"?
        </span>
      )}
      onCreateOption={(option) => {
        if (!option) {
          return
        }

        toast
          .promise(
            createCampaignPartner({
              variables: {
                partnerId: option.toLowerCase().trim().replace(' ', '_'),
                partnerName: option,
              },
            }),
            {
              loading: 'Creating partner...',
              success: 'Partner created',
              error: 'Could not create partner',
            },
          )
          .then(() => refetch())
      }}
      value={
        value
          ? {
              value,
              label: value,
            }
          : null
      }
      placeholder={placeholder}
      isLoading={loading}
      isClearable={true}
      isCreatable={true}
      onChange={onChange}
      noOptionsMessage={() => 'No partners found'}
      options={mapCampaignOwners(partnerCampaignOwners)}
    />
  )
}
