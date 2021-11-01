import {
  Button,
  Form,
  FormDropdown,
  FormInput,
  Spacing,
  StandaloneMessage,
  SubmitButton,
} from '@hedvig-ui'
import { useContractMarketInfo } from 'graphql/member/use-get-member-contract-market-info'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import { toast } from 'react-hot-toast'
import {
  GetAccountDocument,
  MonthlyEntryInput,
  useAddMonthlyEntryMutation,
} from 'types/generated/graphql'

export const AddMonthlyEntryForm: React.FC<{
  memberId: string
  onCancel: () => void
  onSuccess: () => void
}> = ({ memberId, onCancel, onSuccess }) => {
  const [contractMarketInfo] = useContractMarketInfo(memberId)
  const [addMonthlyEntry] = useAddMonthlyEntryMutation()
  const form = useForm()

  if (!Boolean(contractMarketInfo?.preferredCurrency)) {
    return (
      <StandaloneMessage>
        The member has no preferred currency
      </StandaloneMessage>
    )
  }
  const preferredCurrency = contractMarketInfo!.preferredCurrency

  const onSubmit = (data: FieldValues) => {
    const dataCopy = {
      ...data,
      amount: {
        amount: data.amount.amount,
        currency: preferredCurrency,
      },
      externalId: data.externalId.trim() === '' ? undefined : data.externalId,
    }

    toast.promise(
      addMonthlyEntry({
        variables: {
          memberId,
          input: dataCopy as MonthlyEntryInput,
        },
        refetchQueries: [
          {
            query: GetAccountDocument,
            variables: { memberId },
          },
        ],
      }),
      {
        loading: 'Adding monthly entry',
        success: () => {
          onSuccess()
          return 'Monthly entry added'
        },
        error: 'Could not add monthly entry',
      },
    )
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
          affix={{
            content: preferredCurrency,
          }}
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
        <FormDropdown
          options={[
            {
              key: 1,
              value: 'object',
              text: 'Object Insurance',
            },
          ]}
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
          options={[
            {
              key: 1,
              value: 'SUBSCRIPTION',
              text: 'Subscription',
            },
          ]}
          defaultValue="SUBSCRIPTION"
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
        <SubmitButton>Add Monthly Entry</SubmitButton>
        <Spacing left="small">
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
        </Spacing>
      </Form>
    </FormProvider>
  )
}
