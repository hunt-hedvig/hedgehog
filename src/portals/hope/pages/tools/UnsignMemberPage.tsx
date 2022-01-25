import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Page } from 'portals/hope/pages/routes'
import gql from 'graphql-tag'
import {
  useTerminateStagingContractsMutation,
  useUnsignMemberMutation,
} from 'types/generated/graphql'

gql`
  mutation UnsignMember($ssn: String, $email: String) {
    unsignMember(ssn: $ssn, email: $email)
  }

  mutation TerminateStagingContracts($ssn: String, $email: String) {
    terminateContracts(ssn: $ssn, email: $email)
  }
`

const UnsignMemberPage: Page = () => {
  const [ssn, setSsn] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [useUnsignMember, unsignResult] = useUnsignMemberMutation()
  const loadingUnsign = unsignResult.loading
  const [useTerminateContracts, terminateContractsResult] =
    useTerminateStagingContractsMutation()
  const loadingTerminateContracts = terminateContractsResult.loading

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
      <div>
        <Button
          variant="primary"
          disabled={
            loadingUnsign ||
            loadingTerminateContracts ||
            (ssn === '' && email === '')
          }
          onClick={() => {
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
          }}
        >
          Unsign
        </Button>
        <Spacing top="small" />
        <Button
          variant="primary"
          disabled={
            loadingUnsign ||
            loadingTerminateContracts ||
            (ssn === '' && email === '')
          }
          onClick={() => {
            toast.promise(
              useTerminateContracts({
                variables: {
                  ssn,
                  email,
                },
              }),
              {
                loading: 'Terminating contracts',
                success: 'Contracts terminated',
                error: 'Could not terminate contracts',
              },
            )
          }}
        >
          Terminate contracts
        </Button>
      </div>
    </>
  )
}

export default UnsignMemberPage
