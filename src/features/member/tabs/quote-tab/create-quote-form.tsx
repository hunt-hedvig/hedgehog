import { Checkbox, JsonSchemaForm } from '@hedvig-ui'
import { InsuranceType } from 'features/config/constants'
import { useSchemaForInsuranceType } from 'features/member/tabs/quote-tab/hooks/use-get-schema-for-insurance-type'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuotesDocument,
  useCreateQuoteForMemberBySchemaMutation,
} from 'types/generated/graphql'

export const CreateQuoteForm: React.FC<{
  memberId: string
  insuranceType: InsuranceType
  onSubmitted: () => void
}> = ({ memberId, insuranceType, onSubmitted }) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)

  const [schema, { loading }] = useSchemaForInsuranceType(insuranceType)

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
