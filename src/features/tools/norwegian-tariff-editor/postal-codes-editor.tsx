import { Button, Spacing, TextArea, ThirdLevelHeadline } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useAddNorwegainPostalCodesMutation } from 'types/generated/graphql'

export const PostalCodesEditor: React.FC = () => {
  const [postalCodesString, setPostalCodesString] = React.useState<string>('')
  const [
    addNorwegianPostalCodes,
    { loading },
  ] = useAddNorwegainPostalCodesMutation()
  const { confirm } = useConfirmDialog()

  return (
    <Spacing top>
      <ThirdLevelHeadline>Postal codes</ThirdLevelHeadline>
      <TextArea
        placeholder={
          'Add postal codes columns from excel (Columns: "Postnummer", "Poststed", "Municipality name", "Disposable income" and "Centrality group")'
        }
        value={postalCodesString}
        onChange={(e) => setPostalCodesString(e.currentTarget.value)}
      />
      <Spacing top>
        <Button
          variant="secondary"
          disabled={loading}
          onClick={() => {
            confirm('Are you sure you want to add the postal codes?').then(
              () => {
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
