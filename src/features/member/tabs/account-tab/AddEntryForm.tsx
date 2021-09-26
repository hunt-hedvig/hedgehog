import {
  Button,
  Form,
  FormDropdown,
  FormInput,
  Spacing,
  StandaloneMessage,
  SubmitButton,
} from '@hedvig-ui'
import { format } from 'date-fns'
import { AddEntryInformation } from 'features/member/tabs/account-tab/AddEntryInformation'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import React from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  AccountEntryInput,
  useAddAccountEntryToMemberMutation,
} from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

const entryTypeOptions = [
  {
    key: 1,
    value: 'CAMPAIGN',
    text:
      'Campaign: The member owes or will owe us money, but we want to pay for it with marketing budget',
  },
  {
    key: 2,
    value: 'SUBSCRIPTION',
    text:
      'Subscription: The member owes us more money (e.g. object, travel, error)',
  },
  {
    key: 3,
    value: 'LOSS_MANUAL',
    text:
      'Loss: The member owes us money we will never get (e.g. the member terminated its insurance or we had a too early start date)',
  },
  {
    key: 4,
    value: 'CORRECTION',
    text:
      'Correction: A calculation is incorrect (should hopefully never have to be used)',
  },
]

const sourceOptions = [
  {
    key: 1,
    value: 'manual_object',
    text: 'Object Insurance',
  },
  {
    key: 2,
    value: 'manual_travel',
    text: 'Travel Insurance',
  },
  {
    key: 3,
    value: 'manual_growth_discount_correction',
    text: 'Discount code issues (e.g. missing free month, wrong code etc.)',
  },
  {
    key: 4,
    value: 'manual_growth_discount',
    text: 'Growth discount (e.g. Benify, Studentkortet, Mecenat)',
  },
  {
    key: 5,
    value: 'manual_iex_discount',
    text:
      'IEX discount (e.g. Start date issues, Technical issues, "Plåster på såren")',
  },
  {
    key: 6,
    value: 'manual_calculation_correction',
    text: 'Correction of calculation error',
  },
  {
    key: 7,
    value: 'manual_automation_correction',
    text: 'Manual correction of automatic payments calculation error',
  },
  {
    key: 8,
    value: 'manual_decease',
    text: 'The member has passed away',
  },
  {
    key: 9,
    value: 'other',
    text: 'Other',
  },
]

export const AddEntryForm: React.FC<{
  memberId: string
  onCancel: () => void
  onSuccess: () => void
}> = ({ memberId, onCancel, onSuccess }) => {
  const [contractMarketInfo] = useContractMarketInfo(memberId)
  const [addAccountEntry] = useAddAccountEntryToMemberMutation()
  const form = useForm()
  const { confirm } = useConfirmDialog()

  if (!Boolean(contractMarketInfo?.preferredCurrency)) {
    return (
      <StandaloneMessage>
        The member has no preferred currency
      </StandaloneMessage>
    )
  }

  const preferredCurrency = contractMarketInfo!.preferredCurrency

  const onSubmit = (data: FieldValues) => {
    confirm('Are you sure you want to add this entry?').then(() => {
      const dataCopy = {
        ...data,
        fromDate: format(new Date(), 'yyyy-MM-dd'),
        amount: {
          amount: data.amount.amount,
          currency: preferredCurrency,
        },
      }

      toast.promise(
        addAccountEntry({
          variables: {
            memberId,
            accountEntry: dataCopy as AccountEntryInput,
          },
        }),
        {
          loading: 'Adding entry',
          success: () => {
            form.reset()
            onSuccess()
            return 'Entry added'
          },
          error: 'Could not add entry',
        },
      )
    })
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={onSubmit}>
        <FormDropdown
          label="Entry Type"
          options={entryTypeOptions}
          name="type"
          defaultValue=""
          rules={{
            required: 'Type is required',
          }}
        />
        <FormInput
          label="Amount"
          placeholder="A positive amount will charge more, a negative will charge less"
          name="amount.amount"
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
        <FormDropdown
          label="Source"
          options={sourceOptions}
          name="source"
          defaultValue=""
          rules={{
            required: 'Source is required',
            pattern: {
              value: /[^other$]/,
              message:
                "Other should not be used. Please contact Elvin to add the option you are looking for (he promises he'll be fast)",
            },
          }}
        />
        <FormInput
          label="Reference"
          placeholder="Reference of source, e.g. object insurance id, campaign code (BENIFY, SPRING etc.), travel insurance destination)"
          name="reference"
          defaultValue=""
          rules={{
            required: 'Reference is required',
            maxLength: {
              value: 50,
              message: 'The reference is too long (max 50 characters)',
            },
          }}
        />
        <FormInput
          label="Title"
          placeholder="If this is to be shown in the app at a later point, this is the title of the entry"
          name="title"
          defaultValue=""
          rules={{
            maxLength: {
              value: 100,
              message: 'The title is too long (max 100 characters)',
            },
          }}
        />
        <FormInput
          label="Comment"
          placeholder="Notes on what happened"
          name="comment"
          defaultValue=""
        />
        <Spacing bottom="small">
          <AddEntryInformation
            amount={{
              amount: form.watch('amount.amount'),
              currency: preferredCurrency,
            }}
          />
        </Spacing>
        <SubmitButton>Add entry</SubmitButton>
        <Button
          variant="tertiary"
          onClick={onCancel}
          style={{ marginLeft: '1.0em' }}
        >
          Cancel
        </Button>
      </Form>
    </FormProvider>
  )
}
