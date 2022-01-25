import styled from '@emotion/styled'
import {
  Button,
  Input,
  Label,
  SearchableDropdown,
  Spacing,
  TextDatePicker,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { PartnerDropdown } from 'portals/hope/features/tools/campaign-codes/forms/PartnerDropdown'
import {
  getCodeTypeOptions,
  numberOfMonthsOptions,
} from 'portals/hope/features/tools/campaign-codes/utils'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  AssignVoucherFreeMonths,
  Scalars,
  useAssignCampaignToPartnerFreeMonthsMutation,
} from 'types/generated/graphql'

interface FreeMonthsFormData {
  partnerId: string | null
  numberOfFreeMonths: number | null
  code: string
  validFrom?: Scalars['Instant']
  validUntil?: Scalars['Instant']
  codeType?: string | null
}

const initialFormData: FreeMonthsFormData = {
  code: '',
  partnerId: '',
  numberOfFreeMonths: null,
  validFrom: null,
  validUntil: null,
  codeType: null,
}

export const DateRangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const formLooksGood = (formData: FreeMonthsFormData) => {
  const { partnerId, code, numberOfFreeMonths } = formData

  return !(!partnerId || !code || !numberOfFreeMonths)
}

export const FreeMonthsForm: React.FC = () => {
  const [formData, setFormData] =
    React.useState<FreeMonthsFormData>(initialFormData)

  const [setPartnerFreeMonths, { loading }] =
    useAssignCampaignToPartnerFreeMonthsMutation()

  const codeTypeOptions = getCodeTypeOptions()

  const reset = () => setFormData(initialFormData)

  const { confirm } = useConfirmDialog()

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
      <Spacing top="small" />
      <Label>Code</Label>
      <Input
        value={formData.code}
        disabled={loading}
        onChange={({ currentTarget: { value: code } }) =>
          setFormData({ ...formData, code })
        }
        placeholder="Code"
      />
      <Spacing top="small" />
      <DateRangeWrapper>
        <div style={{ width: '100%', paddingRight: '1.0em' }}>
          <Label>Valid from</Label>
          <TextDatePicker
            withCurrentTime
            onChange={(validFrom) => setFormData({ ...formData, validFrom })}
            value={formData.validFrom}
            placeholder="Beginning of time"
          />
        </div>
        <div style={{ width: '100%', paddingLeft: '1.0em' }}>
          <Label>Valid to</Label>
          <TextDatePicker
            withCurrentTime
            onChange={(validUntil) => setFormData({ ...formData, validUntil })}
            value={formData.validUntil}
            placeholder="End of time"
          />
        </div>
      </DateRangeWrapper>
      <Spacing top="small" />
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
        placeholder="How many free months?"
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
      <Spacing top="small" />
      <Label>Code Type</Label>
      <SearchableDropdown
        value={
          formData.codeType
            ? codeTypeOptions.find((c) => c.value === formData.codeType) ?? null
            : null
        }
        placeholder="Code Type"
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            codeType: (data?.value as string) ?? null,
          })
        }
        noOptionsMessage={() => 'Option not found'}
        options={codeTypeOptions}
      />
      <Spacing top="small" />
      <div>
        <Button
          disabled={loading || !formLooksGood(formData)}
          onClick={() => {
            confirm(`Create new campaign code "${formData.code}"?`).then(() => {
              toast.promise(
                setPartnerFreeMonths({
                  variables: {
                    request: formData as AssignVoucherFreeMonths,
                  },
                  refetchQueries: () => ['FindPartnerCampaigns'],
                }),
                {
                  loading: 'Creating campaign',
                  success: () => {
                    reset()
                    return 'Campaign created'
                  },
                  error: 'Could not create campaign',
                },
              )
            })
          }}
        >
          Create Campaign
        </Button>
      </div>
    </>
  )
}
