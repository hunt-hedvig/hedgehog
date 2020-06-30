import {
  InputLabel as MuiInputLabel,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
} from '@material-ui/core'
import { ClaimState } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'

import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { sleep } from 'utils/sleep'

import { Paper } from 'components/shared/Paper'
import {
  addContractIdToClaimOptions,
  useAddContractIdToClaim,
} from 'graphql/use-add-contract-id-to-claim'
import { useClaims } from 'graphql/use-claims'
import { useContracts } from 'graphql/use-contracts'

const UPDATE_CLAIM_STATE_MUTATION = gql`
  mutation UpdateClaimState($id: ID!, $state: ClaimState!) {
    updateClaimState(id: $id, state: $state) {
      state
      events {
        text
        date
      }
    }
  }
`
const SET_COVERING_EMPLOYEE = gql`
  mutation SetCoveringEmployee($id: ID!, $coveringEmployee: Boolean!) {
    setCoveringEmployee(id: $id, coveringEmployee: $coveringEmployee) {
      coveringEmployee
      events {
        text
        date
      }
    }
  }
`

interface Props {
  recordingUrl: string | null
  registrationDate: string
  state: ClaimState
  claimId: string
  coveringEmployee: boolean
  memberId: string
  refetchPage: () => Promise<any>
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

const StatusWrapper = styled('div')({
  marginTop: '1rem',
})

const EmployeeClaimWrapper = styled('div')({
  marginTop: '1rem',
})

const ClaimInformation: React.SFC<Props> = ({
  recordingUrl,
  registrationDate,
  state,
  claimId,
  coveringEmployee,
  memberId,
  refetchPage,
}) => {
  const [claim] = useClaims(claimId)
  const [contracts] = useContracts(memberId)
  const [setAddContractIdToClaim] = useAddContractIdToClaim()

  return (
    <>
      <Mutation mutation={UPDATE_CLAIM_STATE_MUTATION}>
        {(updateClaimState) => (
          <Mutation mutation={SET_COVERING_EMPLOYEE}>
            {(setCoveringEmployee) => (
              <Paper>
                <h3>Claim Information</h3>
                {recordingUrl && (
                  <AudioWrapper>
                    <p>
                      Registered at:{' '}
                      {format(
                        parseISO(registrationDate),
                        'yyyy-MM-dd hh:mm:ss',
                      )}
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
                <StatusWrapper>
                  <MuiInputLabel shrink>Status</MuiInputLabel>
                  <MuiSelect
                    value={state}
                    onChange={async (event) => {
                      await updateClaimState({
                        variables: {
                          id: claimId,
                          state: validateSelectOption(event),
                        },
                      })
                      await refetchPage()
                    }}
                  >
                    {Object.values(ClaimState).map((s) => (
                      <MuiMenuItem key={s} value={s}>
                        {s}
                      </MuiMenuItem>
                    ))}
                  </MuiSelect>
                </StatusWrapper>
                <EmployeeClaimWrapper>
                  <MuiInputLabel shrink>Employee Claim</MuiInputLabel>
                  <MuiSelect
                    value={coveringEmployee ? 'True' : 'False'}
                    onChange={async (event) => {
                      await setCoveringEmployee({
                        variables: {
                          id: claimId,
                          coveringEmployee: validateSelectEmployeeClaimOption(
                            event,
                          ),
                        },
                      })
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
                </EmployeeClaimWrapper>
                <EmployeeClaimWrapper>
                  <MuiInputLabel shrink>Add Contract Id to Claim</MuiInputLabel>
                  <MuiSelect
                    value={
                      claim && claim.contract
                        ? claim.contract.contractTypeName
                        : 'Select contract Id'
                    }
                    onChange={async (event) => {
                      await setAddContractIdToClaim(
                        addContractIdToClaimOptions({
                          memberId,
                          claimId,
                          contractId: event.target.value,
                        }),
                      )
                      await sleep(1000)
                      await refetchPage()
                    }}
                  >
                    {contracts
                      .filter((contract) => !contract.isTerminated)
                      .map((contract) => (
                        <MuiMenuItem
                          key={`${contract.contractTypeName} (${contract.currentAgreementId}`}
                          value={contract.id}
                        >
                          {contract.contractTypeName} (
                          {contract.currentAgreementId})
                        </MuiMenuItem>
                      ))}
                  </MuiSelect>
                </EmployeeClaimWrapper>
              </Paper>
            )}
          </Mutation>
        )}
      </Mutation>
    </>
  )
}

export { ClaimInformation }
