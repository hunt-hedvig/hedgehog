import { Checkbox, JsonSchemaForm } from '@hedvig-ui'
import { InsuranceType } from 'portals/hope/features/config/constants'
import { useSchemaForInsuranceType } from 'portals/hope/features/member/tabs/quote-tab/hooks/use-get-schema-for-insurance-type'
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
  onCancel: () => void
}> = ({ memberId, insuranceType, onSubmitted, onCancel }) => {
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
    <JsonSchemaForm
      schema={schema}
      onSubmit={createQuote}
      onCancel={onCancel}
      submitText="Create"
    >
      <Checkbox
        checked={bypassUwgl}
        onChange={({ currentTarget: { checked } }) =>
          setBypassUwgl(Boolean(checked))
        }
        label="Bypass underwriting guidelines"
      />
    </JsonSchemaForm>
  )
}
