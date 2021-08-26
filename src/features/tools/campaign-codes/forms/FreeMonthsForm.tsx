import styled from '@emotion/styled'
import { AssignVoucherFreeMonths, Scalars } from 'api/generated/graphql'
import { PartnerDropdown } from 'features/tools/campaign-codes/forms/PartnerDropdown'
import { getMarketingChannelOptions } from 'features/tools/campaign-codes/utils'
import {
  addPartnerFreeMonthsCodeOptions,
  useAddPartnerFreeMonthsCode,
} from 'graphql/use-add-partner-free-months-code'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Input } from 'hedvig-ui/input'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { Label } from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'
import { numberOfMonthsOptions } from 'utils/campaignCodes'

interface FreeMonthsFormData {
  partnerId: string | null
  numberOfFreeMonths: number | null
  code: string
  validFrom?: Scalars['Instant']
  validUntil?: Scalars['Instant']
  marketingChannel?: string | null
}

const initialFormData: FreeMonthsFormData = {
  code: '',
  partnerId: '',
  numberOfFreeMonths: null,
  validFrom: null,
  validUntil: null,
  marketingChannel: null,
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
  const [formData, setFormData] = React.useState<FreeMonthsFormData>(
    initialFormData,
  )

  const [setPartnerFreeMonths, { loading }] = useAddPartnerFreeMonthsCode()

  const marketingChannelOptions = getMarketingChannelOptions()

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
      <Label>Marketing Channel</Label>
      <SearchableDropdown
        value={
          formData.marketingChannel
            ? {
                value: formData.marketingChannel,
                label: formData.marketingChannel,
              }
            : null
        }
        placeholder={'Marketing Channel'}
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            marketingChannel: data ? data.value : null,
          })
        }
        noOptionsMessage={() => 'Option not found'}
        options={marketingChannelOptions}
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
            toast.promise(
              setPartnerFreeMonths(
                addPartnerFreeMonthsCodeOptions(
                  formData as AssignVoucherFreeMonths,
                ),
              ),
              {
                loading: 'Creating campaign',
                success: () => {
                  reset()
                  return 'Campaign created'
                },
                error: 'Could not create campaign',
              },
            )
          }}
        >
          Create Campaign
        </Button>
      </div>
    </>
  )
}
