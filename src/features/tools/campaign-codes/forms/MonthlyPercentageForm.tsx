import {
  Button,
  DateTimePicker,
  Input,
  Label,
  SearchableDropdown,
  Spacing,
} from '@hedvig-ui'
import { PartnerDropdown } from 'features/tools/campaign-codes/forms/PartnerDropdown'
import { getCodeTypeOptions } from 'features/tools/campaign-codes/utils'
import {
  addPartnerPercentageDiscountCodeOptions,
  useAddPartnerPercentageDiscountCode,
} from 'graphql/use-add-partner-percentage-discount-code'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  AssignVoucherPercentageDiscount,
  Scalars,
} from 'types/generated/graphql'
import {
  numberOfMonthsOptions,
  percentageDiscountOptions,
} from 'utils/campaignCodes'
import { DateRangeWrapper } from './FreeMonthsForm'

const initialFormData: MonthlyPercentageFormData = {
  code: '',
  partnerId: null,
  numberOfMonths: null,
  percentageDiscount: null,
  validFrom: null,
  validUntil: null,
  codeType: null,
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
  codeType?: string | null
}

export const MonthlyPercentageForm: React.FC = () => {
  const [formData, setFormData] = React.useState<MonthlyPercentageFormData>(
    initialFormData,
  )

  const [
    setPartnerPercentageDiscount,
    { loading },
  ] = useAddPartnerPercentageDiscountCode()

  const codeTypeOptions = getCodeTypeOptions()

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
          disabled={loading || !formLooksGood(formData)}
          onClick={() => {
            if (
              !window.confirm(`Create new campaign code "${formData.code}"?`)
            ) {
              return
            }
            toast.promise(
              setPartnerPercentageDiscount(
                addPartnerPercentageDiscountCodeOptions(
                  formData as AssignVoucherPercentageDiscount,
                ),
              ),
              {
                loading: 'Creating campaign',
                success: 'Campaign created',
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
