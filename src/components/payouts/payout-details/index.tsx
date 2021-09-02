import { ApolloCache } from '@apollo/client'
import {
  GetMemberTransactionsDocument,
  GetMemberTransactionsQuery,
  PayoutMemberMutation,
  useGetContractMarketInfoQuery,
  usePayoutMemberMutation,
} from 'api/generated/graphql'
import { Form, FormDropdown, FormInput, SubmitButton } from 'hedvig-ui/form'
import React, { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const entryTypeOptions = [
  {
    key: 1,
    value: 'MARKETING',
    text: 'Marketing',
  },
  {
    key: 2,
    value: 'REFERRAL',
    text: 'Referral',
  },
  {
    key: 3,
    value: 'REFUND',
    text: 'Refund',
  },
]

export const PayoutDetails: React.FC<{ memberId: string }> = ({ memberId }) => {
  const form = useForm()
  const [confirmed, setConfirmed] = useState(false)
  const [payoutMember] = usePayoutMemberMutation()
  const { data: contractMarketInfo } = useGetContractMarketInfoQuery({
    variables: { memberId },
  })

  const preferredCurrency =
    contractMarketInfo?.member?.contractMarketInfo?.preferredCurrency ?? 'SEK'

  const updateCache = (
    cache: ApolloCache<any>,
    response: PayoutMemberMutation,
  ) => {
    const transaction = response?.payoutMember
    const cachedData = cache.readQuery({
      query: GetMemberTransactionsDocument,
      variables: { id: memberId },
    })

    const member = (cachedData as GetMemberTransactionsQuery).member
    const transactions = member?.transactions ?? []

    const newMember = {
      ...member,
      transactions: [...transactions, transaction],
    }

    cache.writeQuery({
      query: GetMemberTransactionsDocument,
      data: { member: newMember },
    })
  }

  const onSubmitHandler = (data: FieldValues) => {
    if (!confirmed) {
      setConfirmed((currentConfirmed) => !currentConfirmed)
      return
    }

    toast.promise(
      payoutMember({
        variables: {
          memberId,
          request: {
            amount: {
              amount: data.amount,
              currency: preferredCurrency,
            },
            category: data.category,
            referenceId: data.referenceId,
            note: data.note,
          },
        },
        update: (cache, { data: response }) => {
          if (!response) {
            return
          }
          updateCache(cache, response)
        },
      }),
      {
        loading: 'Creating payout...',
        success: () => {
          form.reset()
          setConfirmed(false)
          return 'Payout created'
        },
        error: 'Could not create payout',
      },
    )
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={onSubmitHandler}>
        <FormDropdown
          label="Category"
          options={entryTypeOptions}
          name="category"
          defaultValue=""
          rules={{
            required: 'Category is required',
          }}
        />
        <FormInput
          label="Payout amount"
          name="amount"
          defaultValue=""
          type="number"
          affix={{
            content: preferredCurrency,
            basic: true,
          }}
          affixPosition="right"
          rules={{
            required: 'Amount is required',
            pattern: {
              value: /[^0]/,
              message: 'Amount cannot be zero',
            },
          }}
        />
        <FormInput
          label="Reference Id"
          name="referenceId"
          defaultValue=""
          rules={{
            required: 'Reference Id is required',
            maxLength: {
              value: 50,
              message: 'The reference is too long (max 50 characters)',
            },
          }}
        />
        <FormInput label="Note" name="note" defaultValue="" />

        {!confirmed ? (
          <SubmitButton variation="secondary">Confirm payout</SubmitButton>
        ) : (
          <SubmitButton variation="primary">Create payout</SubmitButton>
        )}
      </Form>
    </FormProvider>
  )
}
