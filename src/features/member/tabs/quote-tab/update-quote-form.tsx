import { JsonSchemaForm } from '@hedvig-ui'
import { Quote } from 'api/generated/graphql'
import {
  getUpdateQuoteSchemaOptions,
  useUpdateQuoteBySchema,
} from 'graphql/use-update-quote-by-schema'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Checkbox } from 'semantic-ui-react'

export const UpdateQuoteForm: React.FC<{
  quote: Quote
  onSubmitted: () => void
}> = ({ quote, onSubmitted }) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)
  const [updateQuote] = useUpdateQuoteBySchema()

  const performQuoteUpdate = (formData: Record<string, unknown>) => {
    const options = getUpdateQuoteSchemaOptions({
      memberId: quote.memberId!,
      quoteId: quote.id,
      schema: quote.schema,
      formData,
      bypassUnderwritingGuidelines: bypassUwgl,
    })
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
      submitText={'Save'}
    >
      <Checkbox
        style={{ marginTop: '0.75rem' }}
        checked={bypassUwgl}
        onChange={(_, { checked }) => setBypassUwgl(Boolean(checked))}
        label={'Bypass underwriting guidelines'}
      />
    </JsonSchemaForm>
  )
}
