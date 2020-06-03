import { format } from 'date-fns'
import React from 'react'
import { Dropdown, Form, Input } from 'semantic-ui-react'
import { Button } from '../../../../shared/hedvig-ui/button'
import { DateTimePicker } from '../../../../shared/hedvig-ui/date-time-picker'
import { AssignVoucherPercentageDiscount } from '../../../api/generated/graphql'
import {
  addPartnerPercentageDiscountCodeOptions,
  useAddPartnerPercentageDiscountCode,
} from '../../../graphql/use-add-partner-percentage-discount-code'
import { Notification } from '../../../store/actions/notificationsActions'

interface PartnerIdOptions {
  key: string
  value: string
  text: string
}

interface NewCampaignCodeFormState {
  code: string | null
  partnerId: string | null
  numberOfMonths: number | null
  percentageDiscount: number | null
  validFrom: Date | null
  validUntil: Date | null
}

export const CreateNewCampaignCode: React.FC<{
  showNotification: (data: Notification) => void
  partnerIdOptions: PartnerIdOptions[]
}> = ({ partnerIdOptions, showNotification }) => {
  const [
    setPartnerPercentageDiscount,
    { loading: addPartnerPercentageDiscountLoading },
  ] = useAddPartnerPercentageDiscountCode()

  const [isWip, setIsWip] = React.useState(false)

  const [
    activeFromDatePickerEnabled,
    setActiveFromDatePickerEnabled,
  ] = React.useState(false)
  const [
    activeToDatePickerEnabled,
    setActiveToDatePickerEnabled,
  ] = React.useState(false)

  const [newCampaignCodeFormState, setCampaignCodeFormState] = React.useState<
    NewCampaignCodeFormState
  >({
    code: null,
    partnerId: null,
    numberOfMonths: null,
    percentageDiscount: null,
    validFrom: null,
    validUntil: null,
  })

  const getTextInput = (
    variable: keyof NewCampaignCodeFormState,
    inputType = 'text',
  ) => (
    <>
      <Input
        onChange={(e) => {
          if (isWip) {
            setIsWip(true)
          }
          setCampaignCodeFormState({
            ...newCampaignCodeFormState,
            [variable]: e.currentTarget.value,
          })
        }}
        type={inputType}
      />
    </>
  )

  if (addPartnerPercentageDiscountLoading) {
    return 'loading...'
  }

  const generateRange = (min: number, max: number, step: number): number[] => {
    const numberArray: number[] = []
    for (let num = min; num <= max; num += step) {
      numberArray.push(num)
    }
    return numberArray
  }

  const numberOfMonthsOptions = generateRange(1, 12, 1).map((noOfMonths) => ({
    key: noOfMonths,
    value: noOfMonths,
    text: noOfMonths,
  }))

  const percentageDiscountOptions = generateRange(5, 100, 5).map(
    (percentage) => ({
      key: percentage + '%',
      value: percentage,
      text: percentage + '%',
    }),
  )

  const getVoucherPercentageDiscountData = (
    formState: NewCampaignCodeFormState,
  ): AssignVoucherPercentageDiscount => {
    return {
      code: formState.code!!,
      partnerId: formState.partnerId!!,
      numberOfMonths: formState.numberOfMonths!!,
      percentageDiscount: formState.percentageDiscount!!,
      validFrom: formState.validFrom!!,
      validUntil: formState.validUntil!!,
    }
  }

  const reset = () => {
    setCampaignCodeFormState({
      ...newCampaignCodeFormState,
      code: null,
      partnerId: null,
      numberOfMonths: null,
      percentageDiscount: null,
      validFrom: null,
      validUntil: null,
    })
  }

  return (
    <>
      <Form>
        <Form.Field>
          <label>Code</label>
          {getTextInput('code', 'Code')}
        </Form.Field>
        <Form.Field>
          <label>Partner id</label>
          <Dropdown
            placeholder="partnerId"
            fluid
            search
            selection
            options={partnerIdOptions}
            onChange={(_, data) => {
              if (isWip) {
                setIsWip(true)
              }
              setCampaignCodeFormState({
                ...newCampaignCodeFormState,
                partnerId: data.value as string,
              })
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Number of months</label>
          <Dropdown
            placeholder="number of months"
            fluid
            search
            selection
            options={numberOfMonthsOptions}
            onChange={(_, data) => {
              if (isWip) {
                setIsWip(true)
              }
              setCampaignCodeFormState({
                ...newCampaignCodeFormState,
                numberOfMonths: data.value as number,
              })
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Percentage discount</label>
          <Dropdown
            placeholder="Percentage discount %"
            fluid
            search
            selection
            options={percentageDiscountOptions}
            onChange={(_, data) => {
              if (isWip) {
                setIsWip(true)
              }
              setCampaignCodeFormState({
                ...newCampaignCodeFormState,
                percentageDiscount: (data.value as number) * 0.01,
              })
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Valid from</label>
          <input
            onClick={() =>
              setActiveFromDatePickerEnabled(!activeFromDatePickerEnabled)
            }
            placeholder={
              newCampaignCodeFormState.validFrom
                ? format(newCampaignCodeFormState.validFrom, 'yyyy-MM-dd')
                : ''
            }
          />
          {activeFromDatePickerEnabled && (
            <>
              <DateTimePicker
                date={newCampaignCodeFormState.validFrom!!}
                setDate={(data) => {
                  setCampaignCodeFormState({
                    ...newCampaignCodeFormState,
                    validFrom: data,
                  })
                }}
              />
            </>
          )}
        </Form.Field>
        <Form.Field>
          <label>Valid to</label>
          <input
            onClick={() =>
              setActiveToDatePickerEnabled(!activeToDatePickerEnabled)
            }
            placeholder={
              newCampaignCodeFormState.validUntil
                ? format(newCampaignCodeFormState.validUntil, 'yyyy-MM-dd')
                : ''
            }
          />
          {activeToDatePickerEnabled && (
            <>
              <DateTimePicker
                date={newCampaignCodeFormState.validUntil!!}
                setDate={(data) => {
                  setCampaignCodeFormState({
                    ...newCampaignCodeFormState,
                    validUntil: data,
                  })
                }}
              />
            </>
          )}
        </Form.Field>
        <Button
          type="submit"
          onClick={() => {
            if (!window.confirm('Create new campaign code?')) {
              return
            }
            setPartnerPercentageDiscount(
              addPartnerPercentageDiscountCodeOptions(
                getVoucherPercentageDiscountData(newCampaignCodeFormState),
              ),
            )
              .then(() => {
                showNotification({
                  type: 'olive',
                  header: 'Success',
                  message: `Successfully created a new percentage campaign for partner`,
                })
                reset()
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
          Create
        </Button>
      </Form>
    </>
  )
}
