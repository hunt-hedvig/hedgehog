import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useUnsignMemberMutation } from 'types/generated/graphql'

const UnsignMemberPage: React.FC = () => {
  const [ssn, setSsn] = React.useState('')
  const [useUnsignMember, { loading }] = useUnsignMemberMutation()
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
