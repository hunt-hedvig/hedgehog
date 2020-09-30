import { useQuotes } from 'graphql/use-get-quotes'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { JsonSchemaForm } from 'hedvig-ui/json-schema-form'
import React from 'react'

export const Quotes: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [quotes, { loading }] = useQuotes(memberId)

  if (loading) {
    return <>Loading...</>
  }

  return (
    <CardsWrapper>
      {quotes.map((quote) => {
        return (
          <Card key={quote.id}>
            <JsonSchemaForm
              schema={quote.schema}
              onSubmit={(formData) => console.log(formData)}
            />
          </Card>
        )
      })}
    </CardsWrapper>
  )
}
