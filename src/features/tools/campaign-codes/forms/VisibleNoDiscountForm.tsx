import {
  Button,
  DateTimePicker,
  Input,
  Label,
  SearchableDropdown,
  Spacing,
} from '@hedvig-ui'
import { AssignVoucherVisibleNoDiscount, Scalars } from 'api/generated/graphql'
import { DateRangeWrapper } from 'features/tools/campaign-codes/forms/FreeMonthsForm'
import { PartnerDropdown } from 'features/tools/campaign-codes/forms/PartnerDropdown'
import { getCodeTypeOptions } from 'features/tools/campaign-codes/utils'
import {
  addPartnerVisibleNoDiscountCodeOptions,
  useAddPartnerVisibleNoDiscountCode,
} from 'graphql/use-add-partner-visible-no-discount-code'
import React from 'react'
import { toast } from 'react-hot-toast'

interface VisibleNoDiscountFormData {
  code: string
  partnerId: string | null
  validFrom?: Scalars['Instant']
  validUntil?: Scalars['Instant']
  codeType?: string | null
}

const initialFormData: VisibleNoDiscountFormData = {
  code: '',
  partnerId: '',
  validFrom: null,
  validUntil: null,
  codeType: null,
}

const formIsValid = (formData: VisibleNoDiscountFormData) => {
  const { partnerId, code } = formData

  return !(!partnerId || !code)
}

export const VisibleNoDiscountForm: React.FC = () => {
  const [formData, setFormData] = React.useState<VisibleNoDiscountFormData>(
    initialFormData,
  )

  const [
    setPartnerVisibleNoDiscount,
    { loading },
  ] = useAddPartnerVisibleNoDiscountCode()

  const codeTypeOptions = getCodeTypeOptions()

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
      <Label>Marketing Channel</Label>
      <SearchableDropdown
        value={
          formData.codeType
            ? codeTypeOptions.find((c) => c.value === formData.codeType)
            : null
        }
        placeholder={'Marketing Channel'}
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            codeType: data ? data.value : null,
          })
        }
        noOptionsMessage={() => 'Option not found'}
        options={codeTypeOptions}
      />
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

            toast.promise(
              setPartnerVisibleNoDiscount(
                addPartnerVisibleNoDiscountCodeOptions(
                  formData as AssignVoucherVisibleNoDiscount,
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
