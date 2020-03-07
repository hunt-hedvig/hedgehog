import * as React from 'react'
import { Button } from '../../../../../shared/hedvig-ui/button'
import { Contract } from '../../../../api/generated/graphql'

export const TerminationDate: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => (
  <>
    {!contract.isTerminated && <Button>Terminate contract</Button>}
    {contract.isTerminated && <>{contract.terminationDate}</>}
  </>
)
