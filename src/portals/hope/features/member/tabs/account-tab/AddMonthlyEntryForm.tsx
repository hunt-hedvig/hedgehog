import {
  Button,
  Select,
  Input,
  Spacing,
  StandaloneMessage,
  Flex,
} from '@hedvig-ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import { toast } from 'react-hot-toast'
import {
  GetAccountDocument,
  MonthlyEntryInput,
  useAddMonthlyEntryMutation,
} from 'types/generated/graphql'
import { useContractMarketInfo } from 'portals/hope/common/hooks/use-contract-market-info'
import styled from '@emotion/styled'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const AddMonthlyEntryForm: React.FC<{
  memberId: string
  onCancel: () => void
  onSuccess: () => void
}> = ({ memberId, onCancel, onSuccess }) => {
  const { preferredCurrency } = useContractMarketInfo(memberId)
  const [addMonthlyEntry] = useAddMonthlyEntryMutation()
  const { register, handleSubmit } = useForm()

  if (!preferredCurrency) {
    return (
      <StandaloneMessage>
        The member has no preferred currency
      </StandaloneMessage>
    )
  }

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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('externalId', {
          pattern: {
            value: /^\d+$/,
            message: 'Must be a number (or empty)',
          },
        })}
        label="External Id"
        defaultValue=""
      />
      <Input
        {...register('amount.amount', {
          pattern: {
            value: /^\d+$/,
            message: 'Must be a number',
          },
          min: {
            value: 1,
            message: 'Must be more than 0',
          },
          required: 'Amount is required',
        })}
        type="number"
        affix={{
          content: preferredCurrency,
        }}
        label="Amount"
        defaultValue=""
      />
      <Select
        {...register('source', {
          pattern: {
            value: /^object$/,
            message: 'Only "object" supported',
          },
          required: 'Source is required',
        })}
        options={[
          {
            key: 1,
            value: 'object',
            text: 'Object Insurance',
          },
        ]}
        label="Source"
        defaultValue="object"
      />
      <Input
        {...register('title', {
          required: 'Title is required',
        })}
        label="Title"
        defaultValue=""
      />
      <Input
        {...register('comment', {
          required: 'Comment is required',
        })}
        label="Comment"
        defaultValue=""
      />
      <Select
        {...register('type', {
          pattern: {
            value: /^SUBSCRIPTION$/,
            message: 'Only "Subscription" supported',
          },
          required: 'Type is required',
        })}
        options={[
          {
            key: 1,
            value: 'SUBSCRIPTION',
            text: 'Subscription',
          },
        ]}
        defaultValue="SUBSCRIPTION"
        label="Type"
      />
      <Flex>
        <Button type="submit">Add Monthly Entry</Button>
        <Spacing left="small">
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
        </Spacing>
      </Flex>
    </Form>
  )
}
