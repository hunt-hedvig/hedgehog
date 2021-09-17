import { JsonSchemaForm } from '@hedvig-ui'
import {
  getCreateQuoteForMemberBySchemaOptions,
  useCreateQuoteForMemberBySchema,
} from 'graphql/use-create-quote-for-member-by-schema'
import { useSchemaForContractType } from 'graphql/use-get-schema-for-contract-type'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Checkbox } from 'semantic-ui-react'
import { ContractType } from 'types/enums'

export const CreateQuoteForm: React.FC<{
  memberId: string
  contractType: ContractType
  onSubmitted: () => void
}> = ({ memberId, contractType, onSubmitted }) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)

  const [schema, { loading }] = useSchemaForContractType(contractType)

  const [createQuoteForMember] = useCreateQuoteForMemberBySchema()

  const createQuote = (formData: Record<string, unknown>) => {
    toast.promise(
      createQuoteForMember(
        getCreateQuoteForMemberBySchemaOptions({
          memberId,
          schema,
          formData,
          bypassUnderwritingGuidelines: bypassUwgl,
        }),
      ),
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
        onChange={(_, { checked }) => setBypassUwgl(Boolean(checked))}
        label="Bypass underwriting guidelines"
      />
    </JsonSchemaForm>
  )
}
