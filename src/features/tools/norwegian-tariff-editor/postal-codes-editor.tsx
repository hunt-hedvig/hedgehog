import { Button, Spacing, TextArea, ThirdLevelHeadline } from '@hedvig-ui'
import { useAddNorwegainPostalCodesMutation } from 'api/generated/graphql'
import React from 'react'
import { toast } from 'react-hot-toast'

export const PostalCodesEditor: React.FC = () => {
  const [postalCodesString, setPostalCodesString] = React.useState<string>('')
  const [
    addNorwegianPostalCodes,
    { loading },
  ] = useAddNorwegainPostalCodesMutation()

  return (
    <Spacing top>
      <ThirdLevelHeadline>Postal codes</ThirdLevelHeadline>
      <TextArea
        placeholder={
          'Add postal codes columns from excel (Columns: "Postnummer", "Poststed", "Municipality name", "Disposable income" and "Centrality group")'
        }
        value={postalCodesString}
        onChange={setPostalCodesString}
      />
      <Spacing top>
        <Button
          fullWidth
          variation={'secondary'}
          disabled={loading}
          onClick={() => {
            if (
              !window.confirm('Are you sure you want to add the postal codes?')
            ) {
              return
            }

            toast.promise(
              addNorwegianPostalCodes({
                variables: {
                  postalCodesString,
                },
              }),
              {
                loading: 'Adding postal codes',
                success: 'Postal codes added',
                error: 'Could not add postal codes',
              },
            )
          }}
        >
          Add Norwegian Postal Codes
        </Button>
      </Spacing>
    </Spacing>
  )
}
