import { Checkbox, JsonSchemaForm } from '@hedvig-ui'
import { ContractType } from 'features/config/constants'
import { useSchemaForContractType } from 'graphql/member/use-get-schema-for-contract-type'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuotesDocument,
  useCreateQuoteForMemberBySchemaMutation,
} from 'types/generated/graphql'

export const CreateQuoteForm: React.FC<{
  memberId: string
  contractType: ContractType
  onSubmitted: () => void
}> = ({ memberId, contractType, onSubmitted }) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)

  const [schema, { loading }] = useSchemaForContractType(contractType)

  const [createQuoteForMember] = useCreateQuoteForMemberBySchemaMutation()

  const createQuote = (formData: Record<string, unknown>) => {
    toast.promise(
      createQuoteForMember({
        variables: {
          memberId,
          schemaData: {
            ...formData,
            id: schema.$id,
          },
          bypassUnderwritingGuidelines: bypassUwgl,
        },
        refetchQueries: () => [
          {
            query: GetQuotesDocument,
            variables: { memberId },
          },
        ],
      }),
      {
        loading: 'Saving quote',
        success: () => {
          onSubmitted()
          return 'Quote saved'
        },
        error: 'Could not save quote',
      },
    )
  }

  if (loading) {
    return null
  }

  return (
    <JsonSchemaForm schema={schema} onSubmit={createQuote} submitText="Create">
      <Checkbox
        style={{ marginTop: '0.75rem' }}
        checked={bypassUwgl}
        onChange={({ currentTarget: { checked } }) =>
          setBypassUwgl(Boolean(checked))
        }
        label="Bypass underwriting guidelines"
      />
    </JsonSchemaForm>
  )
}
