import {
  InputLabel as MuiInputLabel,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
} from '@material-ui/core'
import { ClaimState, Contract } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import * as React from 'react'
import styled from 'react-emotion'
import { sleep } from 'utils/sleep'

import { Paper } from 'components/shared/Paper'
import {
  setContractForClaimOptions,
  useSetContractForClaim,
} from 'graphql/use-add-contract-id-to-claim'
import { useContracts } from 'graphql/use-contracts'
import {
  setCoveringEmployeeOptions,
  useSetCoveringEmployee,
} from 'graphql/use-set-covering-employee'
import {
  updateClaimStateOptions,
  useUpdateClaimState,
} from 'graphql/use-update-claim-state'
import {
  isNorwegianHomeContent,
  isSwedishApartment,
  isSwedishHouse,
} from 'utils/agreement'
import { currentAgreementForContract } from 'utils/contract'

interface Props {
  recordingUrl: string | null
  registrationDate: string
  state: ClaimState
  claimId: string
  coveringEmployee: boolean
  memberId: string
  refetchPage: () => Promise<any>
  contract: Contract | null
}

const validateSelectOption = (
  event: React.ChangeEvent<HTMLSelectElement>,
): ClaimState => {
  const { value } = event.target
  if (!Object.values(ClaimState).includes(value as any)) {
    throw new Error(`invalid ClaimState: ${value}`)
  }
  return value as ClaimState
}

const validateSelectEmployeeClaimOption = (
  event: React.ChangeEvent<HTMLSelectElement>,
): boolean => {
  const { value } = event.target
  return value === 'True'
}

const getUrlWithoutParameters = (recordingUrl): string => {
  const regex = recordingUrl.split(/\?/)
  return regex[0]
}

const AudioWrapper = styled('div')({})

const Audio = styled('audio')({
  width: '100%',
})

const DonloadClaimFile = styled('a')({
  display: 'block',
  marginTop: '0.5rem',
})

const SelectWrapper = styled('div')({
  marginTop: '1rem',
})

const getAddressFromContract = (contract: Contract): string => {
  const currentAgreement = currentAgreementForContract(contract)
  if (
    currentAgreement != null &&
    (isSwedishApartment(currentAgreement) ||
      isSwedishHouse(currentAgreement) ||
      isNorwegianHomeContent(currentAgreement))
  ) {
    return currentAgreement.address.street
  } else {
    return ''
  }
}

const ClaimInformation: React.SFC<Props> = ({
  recordingUrl,
  registrationDate,
  state,
  claimId,
  coveringEmployee,
  memberId,
  refetchPage,
  contract,
}) => {
  const [contracts] = useContracts(memberId)
  const [setContractForClaim] = useSetContractForClaim()
  const [setCoveringEmployee] = useSetCoveringEmployee()
  const [updateClaimState] = useUpdateClaimState()

  return (
    <Paper>
      <h3>Claim Information</h3>
      {recordingUrl && (
        <AudioWrapper>
          <p>
            Registered at:{' '}
            {format(parseISO(registrationDate), 'yyyy-MM-dd hh:mm:ss')}
          </p>
          <Audio controls>
            <source src={recordingUrl} type="audio/aac" />
          </Audio>
          <Audio controls>
            <source
              src={getUrlWithoutParameters(recordingUrl)}
              type="audio/aac"
            />
          </Audio>
          <DonloadClaimFile
            href={recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download claim file
          </DonloadClaimFile>
          <DonloadClaimFile
            href={getUrlWithoutParameters(recordingUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download claim file
          </DonloadClaimFile>
        </AudioWrapper>
      )}
      <SelectWrapper>
        <MuiInputLabel shrink>Status</MuiInputLabel>
        <MuiSelect
          value={state}
          onChange={async (event) => {
            await updateClaimState(
              updateClaimStateOptions(claimId, validateSelectOption(event)),
            )
            await refetchPage()
          }}
        >
          {Object.values(ClaimState).map((s) => (
            <MuiMenuItem key={s} value={s}>
              {s}
            </MuiMenuItem>
          ))}
        </MuiSelect>
      </SelectWrapper>
      <SelectWrapper>
        <MuiInputLabel shrink>Employee Claim</MuiInputLabel>
        <MuiSelect
          value={coveringEmployee ? 'True' : 'False'}
          onChange={async (event) => {
            await setCoveringEmployee(
              setCoveringEmployeeOptions(
                claimId,
                validateSelectEmployeeClaimOption(event),
              ),
            )
            await sleep(1000)
            await refetchPage()
          }}
        >
          <MuiMenuItem key={'True'} value={'True'}>
            True
          </MuiMenuItem>
          <MuiMenuItem key={'False'} value={'False'}>
            False
          </MuiMenuItem>
        </MuiSelect>
      </SelectWrapper>
      {contracts && (
        <SelectWrapper>
          <MuiInputLabel shrink error={!contract}>
            Select Contract for Claim
          </MuiInputLabel>

          <MuiSelect
            value={contract?.id ? contract.id : 'none'}
            onChange={async (event) => {
              if (event.target.value === 'none') {
                return
              }
              await setContractForClaim(
                setContractForClaimOptions({
                  claimId,
                  memberId,
                  contractId: event.target.value,
                }),
              )
              await sleep(1000)
              await refetchPage()
            }}
          >
            <MuiMenuItem disabled value={'none'} divider>
              None selected
            </MuiMenuItem>
            {contracts.map((_contract) => (
              <MuiMenuItem key={_contract.id} value={_contract.id}>
                {_contract.contractTypeName} (
                {getAddressFromContract(_contract)})
              </MuiMenuItem>
            ))}
          </MuiSelect>
        </SelectWrapper>
      )}
    </Paper>
  )
}

export { ClaimInformation }
