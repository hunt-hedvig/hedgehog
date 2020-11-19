import { AccountEntryType } from 'api/generated/graphql'
import {
  getAddMonthlyEntryOptions,
  useAddMonthlyEntry,
} from 'graphql/use-add-monthly-entry'
import { Form, FormDropdown, FormInput, SubmitButton } from 'hedvig-ui/form'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { enumToDropdownOptions } from 'utils/enum'
import { withShowNotification } from 'utils/notifications'

const AddMonthlyEntryFormComponent: React.FC<{
  memberId: string
  preferredCurrency?: string
} & WithShowNotification> = ({
  memberId,
  preferredCurrency,
  showNotification,
}) => {
  if (!Boolean(preferredCurrency)) {
    return null
  }

  const form = useForm()

  const [addMonthlyEntry] = useAddMonthlyEntry()
  const onSubmit = (data) => {
    const dataCopy = { ...data }
    dataCopy.amount.currency = preferredCurrency
    dataCopy.externalId =
      dataCopy.externalId === '' ? undefined : dataCopy.externalId
    addMonthlyEntry(getAddMonthlyEntryOptions(memberId, dataCopy))
      .then(() => {
        showNotification({
          message: 'Monthly entry added',
          header: 'Success',
          type: 'olive',
        })
        form.reset()
      })
      .catch((e) => {
        showNotification({
          message: e.message,
          header: 'Error',
          type: 'red',
        })
      })
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={onSubmit}>
        <FormInput
          label="External Id"
          name="externalId"
          defaultValue=""
          rules={{
            pattern: {
              value: /^\d+$/,
              message: 'Must be a number (or empty)',
            },
          }}
        />
        <FormInput
          type="number"
          label="Amount"
          name="amount.amount"
          defaultValue=""
          rules={{
            pattern: {
              value: /^\d+$/,
              message: 'Must be a number',
            },
            min: {
              value: 1,
              message: 'Must be more than 0',
            },
            required: 'Amount is required',
          }}
        />
        <FormInput
          label="Source"
          name="source"
          defaultValue="object"
          rules={{
            pattern: {
              value: /^object$/,
              message: 'Only "object" supported',
            },
            required: 'Source is required',
          }}
        />
        <FormInput
          label="Title"
          name="title"
          defaultValue=""
          rules={{ required: 'Title is required' }}
        />
        <FormInput
          label="Comment"
          name="comment"
          defaultValue=""
          rules={{ required: 'Comment is required' }}
        />
        <FormDropdown
          options={enumToDropdownOptions(AccountEntryType)}
          defaultValue={AccountEntryType.Subscription}
          label="Type"
          name="type"
          rules={{
            pattern: {
              value: /^SUBSCRIPTION$/,
              message: 'Only "Subscription" supported',
            },
            required: 'Type is required',
          }}
        />
        <SubmitButton submitText="Add Monthly Entry" variation="primary" />
      </Form>
    </FormProvider>
  )
}

export const AddMonthlyEntryForm = withShowNotification(
  AddMonthlyEntryFormComponent,
)
