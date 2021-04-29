import { useAddNorwegainPostalCodesMutation } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import { TextArea } from 'hedvig-ui/text-area'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Notification } from 'store/actions/notificationsActions'

interface PostalCodesEditorProps {
  showNotification: (data: Notification) => void
}

export const PostalCodesEditor: React.FC<PostalCodesEditorProps> = ({
  showNotification,
}) => {
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
        setValue={setPostalCodesString}
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
            addNorwegianPostalCodes({
              variables: {
                postalCodesString,
              },
            })
              .then(() => {
                showNotification({
                  type: 'olive',
                  header: 'Success',
                  message: 'Successfully added Norwegian Postal Codes',
                })
              })
              .catch((error) => {
                showNotification({
                  type: 'red',
                  header: 'Error',
                  message: error.message,
                })
                throw error
              })
          }}
        >
          Add Norwegian Postal Codes
        </Button>
      </Spacing>
    </Spacing>
  )
}
