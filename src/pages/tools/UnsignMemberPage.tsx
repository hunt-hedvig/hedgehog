import { gql, useMutation } from '@apollo/client'
import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import React from 'react'
import { toast } from 'react-hot-toast'

const UNSIGN_MEMBER = gql`
  mutation UnsignMember($ssn: String!) {
    unsignMember(ssn: $ssn)
  }
`

const UnsignMemberPage: React.FC = () => {
  const [ssn, setSsn] = React.useState('')
  const [useUnsignMember, { loading }] = useMutation(UNSIGN_MEMBER)
  const { confirm } = useConfirmDialog()

  return (
    <>
      <MainHeadline>Unsign member</MainHeadline>
      <Input
        value={ssn}
        onChange={({ target: { value } }) => {
          setSsn(value)
        }}
        placeholder="Social Security Number"
        style={{ width: '300px' }}
      />
      <Spacing top="small" />
      <Button
        variant="primary"
        disabled={loading || ssn === ''}
        onClick={() => {
          confirm(
            `Are you sure you want to unsign member with SSN ${ssn}?`,
          ).then(() => {
            toast.promise(
              useUnsignMember({
                variables: {
                  ssn,
                },
              }),
              {
                loading: 'Unsigning member',
                success: 'Member unsigned',
                error: 'Could not unsign member',
              },
            )
          })
        }}
      >
        Unsign
      </Button>
    </>
  )
}

export default UnsignMemberPage
