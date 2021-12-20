import { Checkbox, JsonSchemaForm } from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuotesDocument,
  Quote,
  useUpdateQuoteBySchemaMutation,
} from 'types/generated/graphql'

export const UpdateQuoteForm: React.FC<{
  quote: Quote
  onSubmitted: () => void
}> = ({ quote, onSubmitted }) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)
  const [updateQuote] = useUpdateQuoteBySchemaMutation()

  const performQuoteUpdate = (formData: Record<string, unknown>) => {
    const options = {
      variables: {
        quoteId: quote.id,
        schemaData: {
          ...formData,
          id: quote.schema.$id,
        },
        bypassUnderwritingGuidelines: bypassUwgl,
      },
      refetchQueries: () => [
        {
          query: GetQuotesDocument,
          variables: { memberId: quote.memberId },
        },
      ],
    }
    updateQuote(options)
      .then(() => {
        onSubmitted()
        toast.success('Quote saved')
      })
      .catch(() => {
        toast.error('Could not save quote')
      })
  }

  return (
    <JsonSchemaForm
      schema={quote.schema}
      initialFormData={quote.schemaData}
      onSubmit={performQuoteUpdate}
      submitText="Save"
    >
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
