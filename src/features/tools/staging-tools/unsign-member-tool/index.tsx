import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useUnsignMemberMutation } from 'types/generated/graphql'

export const UnsignMemberTool: React.FC = () => {
  const [ssn, setSsn] = React.useState('')
  const [useUnsignMember, { loading }] = useUnsignMemberMutation()

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
      <Spacing top={'small'} />
      <Button
        variation="primary"
        disabled={loading || ssn === ''}
        onClick={() => {
          if (
            !window.confirm(
              `Are you sure you want to unsign member with SSN ${ssn}?`,
            )
          ) {
            return
          }

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
        }}
      >
        Unsign
      </Button>
    </>
  )
}
