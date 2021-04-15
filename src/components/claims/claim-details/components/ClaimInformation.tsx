import styled from '@emotion/styled'
import {
  InputLabel as MuiInputLabel,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
} from '@material-ui/core'
import { ClaimState, useClaimInformationQuery } from 'api/generated/graphql'

import { Paper } from 'components/shared/Paper'
import { format, parseISO } from 'date-fns'
import {
  setContractForClaimOptions,
  useSetContractForClaim,
} from 'graphql/use-add-contract-id-to-claim'
import {
  setCoveringEmployeeOptions,
  useSetCoveringEmployee,
} from 'graphql/use-set-covering-employee'
import {
  updateClaimStateOptions,
  useUpdateClaimState,
} from 'graphql/use-update-claim-state'
import { Loadable } from 'hedvig-ui/loadable'
import { Paragraph } from 'hedvig-ui/typography'
import React from 'react'
import { currentAgreementForContract } from 'utils/contract'
import { sleep } from 'utils/sleep'
import { convertEnumToTitle } from 'utils/text'

interface Props {
  claimId: string
  memberId: string
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

const Audio = styled('audio')({
  width: '100%',
})

const DownloadClaimFile = styled('a')({
  display: 'block',
  marginTop: '0.5rem',
})

const SelectWrapper = styled('div')({
  marginTop: '1rem',
})

const ClaimInformation: React.FC<Props> = ({ claimId, memberId }) => {
  const {
    data,
    refetch: refetchClaimInformation,
    loading: claimInformationLoading,
  } = useClaimInformationQuery({
    variables: { claimId, memberId },
  })

  const {
    registrationDate,
    recordingUrl,
    coveringEmployee,
    state,
    contract: selectedContract,
    agreement: selectedAgreement,
  } = data?.claim ?? {}
  const contracts = data?.member?.contracts

  const [setContractForClaim] = useSetContractForClaim()
  const [setCoveringEmployee] = useSetCoveringEmployee()
  const [updateClaimState] = useUpdateClaimState()

  return (
    <Paper>
      <h3>Claim Information</h3>
      <Loadable loading={claimInformationLoading}>
        <div>
          <p>
            Registered at:{' '}
            {registrationDate &&
              format(parseISO(registrationDate), 'yyyy-MM-dd HH:mm:ss')}
          </p>
          {recordingUrl && (
            <>
              <Audio controls>
                <source src={recordingUrl} type="audio/aac" />
              </Audio>
              <Audio controls>
                <source
                  src={getUrlWithoutParameters(recordingUrl)}
                  type="audio/aac"
                />
              </Audio>
              <DownloadClaimFile
                href={recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download claim file
              </DownloadClaimFile>
              <DownloadClaimFile
                href={getUrlWithoutParameters(recordingUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download claim file
              </DownloadClaimFile>
            </>
          )}
        </div>
        <SelectWrapper>
          <MuiInputLabel shrink>Status</MuiInputLabel>
          <MuiSelect
            value={state}
            onChange={async (event) => {
              await updateClaimState(
                updateClaimStateOptions(claimId, validateSelectOption(event)),
              )
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
            <MuiInputLabel shrink error={!selectedContract}>
              Select Contract for Claim
            </MuiInputLabel>

            <MuiSelect
              value={selectedContract?.id ? selectedContract.id : 'none'}
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
                await sleep(250)
                await refetchClaimInformation()
              }}
            >
              <MuiMenuItem disabled value={'none'} divider>
                None selected
              </MuiMenuItem>
              {contracts.map((contract) => {
                const address = currentAgreementForContract(contract)?.address
                return (
                  <MuiMenuItem key={contract.id} value={contract.id}>
                    {contract.contractTypeName}
                    {address && <> ({address.street})</>}
                  </MuiMenuItem>
                )
              })}
            </MuiSelect>
          </SelectWrapper>
        )}
        {selectedAgreement && (
          <>
            <Paragraph>
              <strong>Carrier:</strong> {selectedAgreement.carrier}
            </Paragraph>
            <Paragraph>
              <strong>Line Of Business:</strong>{' '}
              {convertEnumToTitle(selectedAgreement.lineOfBusinessName)}
            </Paragraph>
          </>
        )}
        {!selectedAgreement && (
          <Paragraph>
            ⚠️ No agreement covers the claim on the date of loss
          </Paragraph>
        )}
      </Loadable>
    </Paper>
  )
}

export { ClaimInformation }
