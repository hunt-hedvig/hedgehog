import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useUnsignMemberMutation } from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

export const UnsignMemberPage: React.FC = () => {
  const [ssn, setSsn] = React.useState('')
  const [useUnsignMember, { loading }] = useUnsignMemberMutation()
  const { confirm } = useConfirmDialog()

  return (
    <>
      <MainHeadline>Unsign member</MainHeadline>
      <Input
        value={ssn}
        onChange={(_e, { value }) => {
          setSsn(value)
        }}
        placeholder="Social Security Number"
      />
      <Spacing top="small" />
      <Button
        variation="primary"
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
