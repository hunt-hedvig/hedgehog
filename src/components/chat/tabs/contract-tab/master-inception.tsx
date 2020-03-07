import * as React from 'react'
import { Button } from '../../../../../shared/hedvig-ui/button'
import { Contract } from '../../../../api/generated/graphql'

export const MasterInception: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => (
  <>
    {!contract.hasPendingAgreement && <>{contract.masterInception}</>}
    {contract.hasPendingAgreement && <Button>Activate contract</Button>}
  </>
)
