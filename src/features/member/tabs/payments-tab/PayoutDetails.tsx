import { ApolloCache } from '@apollo/client'
import { Form, FormDropdown, FormInput, SubmitButton } from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  GetMemberTransactionsDocument,
  GetMemberTransactionsQuery,
  PayoutMemberMutation,
  useGetContractMarketInfoQuery,
  usePayoutMemberMutation,
} from 'types/generated/graphql'

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

export const PayoutDetails: React.FC<{
  memberId: string
  navigationAvailable: boolean
}> = ({ memberId, navigationAvailable }) => {
  const form = useForm()
  const [payoutMember] = usePayoutMemberMutation()
  const { data: contractMarketInfo } = useGetContractMarketInfoQuery({
    variables: { memberId },
  })
  const { confirm } = useConfirmDialog()

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
    const confirmMessage = `Are you sure you want to payout ${data.amount} ${preferredCurrency}?`

    confirm(confirmMessage).then(() => {
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
            return 'Payout created'
          },
          error: (e) => {
            if (e.message.split(': ').includes('Payouts are restricted')) {
              return 'Payouts are restricted'
            }

            return 'Could not create payout'
          },
        },
      )
    })
  }

  const { focus, setFocus } = useNavigation()

  const [navigationStep] = useArrowKeyboardNavigation({
    maxStep: 3,
    onPerformNavigation: () => {
      setFocus(FocusItems.Member.items.PaymentsFormField)
    },
    direction: 'vertical',
    withNegative: true,
    isActive:
      focus === FocusItems.Member.items.PaymentsForm && navigationAvailable,
  })

  const getStyles = (step: number) => ({
    border:
      (focus === FocusItems.Member.items.PaymentsForm ||
        focus === FocusItems.Member.items.PaymentsFormField) &&
      navigationStep + 1 === step
        ? '1px solid blue'
        : 'none',
  })

  return (
    <FormProvider {...form}>
      <Form onSubmit={onSubmitHandler}>
        <FormDropdown
          focus={
            focus === FocusItems.Member.items.PaymentsFormField &&
            navigationStep + 1 === 0
          }
          style={getStyles(0)}
          label="Category"
          options={entryTypeOptions}
          name="category"
          defaultValue=""
          rules={{
            required: 'Category is required',
          }}
        />
        <FormInput
          focus={
            focus === FocusItems.Member.items.PaymentsFormField &&
            navigationStep + 1 === 1
          }
          style={getStyles(1)}
          label="Payout amount"
          name="amount"
          defaultValue=""
          type="number"
          affix={{
            content: preferredCurrency,
          }}
          rules={{
            required: 'Amount is required',
            pattern: {
              value: /[^0]/,
              message: 'Amount cannot be zero',
            },
          }}
        />
        <FormInput
          focus={
            focus === FocusItems.Member.items.PaymentsFormField &&
            navigationStep + 1 === 2
          }
          style={getStyles(2)}
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
        <FormInput
          focus={
            focus === FocusItems.Member.items.PaymentsFormField &&
            navigationStep + 1 === 3
          }
          label="Note"
          name="note"
          defaultValue=""
          style={getStyles(3)}
        />

        <SubmitButton
          focus={
            focus === FocusItems.Member.items.PaymentsFormField &&
            navigationStep + 1 === 4
          }
          style={getStyles(4)}
        >
          Create payout
        </SubmitButton>
      </Form>
    </FormProvider>
  )
}
