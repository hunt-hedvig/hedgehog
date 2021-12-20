import { useMutation } from '@apollo/client'
import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Page } from 'pages/routes'
import gql from 'graphql-tag'

const UNSIGN_MEMBER = gql`
  mutation UnsignMember($ssn: String, $email: String) {
    unsignMember(ssn: $ssn, email: $email)
  }
`

const UnsignMemberPage: Page = () => {
  const [ssn, setSsn] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [useUnsignMember, { loading }] = useMutation(UNSIGN_MEMBER)
  const { confirm } = useConfirmDialog()

  useTitle('Tools | Unsign Member')

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
      <Input
        value={email}
        onChange={({ target: { value } }) => {
          setEmail(value)
        }}
        placeholder="Email"
        style={{ width: '300px' }}
      />

      <Spacing top="small" />
      <Button
        variant="primary"
        disabled={loading || (ssn === '' && email === '')}
        onClick={() => {
          let confirmMessage = ''
          if (ssn !== '' && email !== '') {
            confirmMessage = `Are you sure you want to unsign members with SSN ${ssn} and/or email ${email}?`
          } else if (ssn !== '') {
            confirmMessage = `Are you sure you want to unsign members with SSN ${ssn}`
          } else if (email !== '') {
            confirmMessage = `Are you sure you want to unsign members with email ${email}?`
          }
          confirm(confirmMessage).then(() => {
            toast.promise(
              useUnsignMember({
                variables: {
                  ssn,
                  email,
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
