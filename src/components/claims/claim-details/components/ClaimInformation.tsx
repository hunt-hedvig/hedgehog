import * as React from 'react'

import {
  InputLabel as MuiInputLabel,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
} from '@material-ui/core'

import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'

import { Paper } from '../../../shared/Paper'
import { boolean } from 'yup'

const UPDATE_STATE_QUERY = gql`
  query UpdateClaimState($id: ID!) {
    claim(id: $id) {
      state
      events {
        text
        date
      }
    }
  }
`

const UPDATE_COVERING_EMPLOYEE_QUERY = gql`
  query SetCoveringEmployee($id: ID!) {
    claim(id: $id) {
      coveringEmployee
      events {
        text
        date
      }
    }
  }
`

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

enum ClaimState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

interface Props {
  recordingUrl: string | null
  registrationDate: string
  state: ClaimState
  claimId: string
  coveringEmployee: boolean
}

const validateSelectOption = (
  event: React.ChangeEvent<HTMLSelectElement>,
): ClaimState => {
  const { value } = event.target
  if (!Object.values(ClaimState).includes(value)) {
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
}) => (
  <Mutation
    mutation={UPDATE_CLAIM_STATE_MUTATION}
    update={(cache, { data: updateData }) => {
      cache.writeQuery({
        query: UPDATE_STATE_QUERY,
        variables: { id: claimId },
        data: {
          claim: {
            state: updateData.updateClaimState.state,
            events: updateData.updateClaimState.events,
            __typename: updateData.updateClaimState.__typename,
          },
        },
      })
    }}
  >
    {(updateClaimState) => (
      <Mutation
        mutation={SET_COVERING_EMPLOYEE}
        update={(cache, { data: updateData }) => {
          cache.writeQuery({
            query: UPDATE_COVERING_EMPLOYEE_QUERY,
            variables: { id: claimId },
            data: {
              claim: {
                coveringEmployee:
                  updateData.setCoveringEmployee.coveringEmployee,
                events: updateData.setCoveringEmployee.events,
                __typename: updateData.setCoveringEmployee.__typename,
              },
            },
          })
        }}
      >
        {(setCoveringEmployee) => (
          <Paper>
            <h3>Claim Information</h3>
            {recordingUrl && (
              <AudioWrapper>
                <p>
                  Registered at:{' '}
                  {format(toDate(registrationDate), 'yyyy-MM-dd hh:mm:ss')}
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
                onChange={(event) =>
                  updateClaimState({
                    variables: {
                      id: claimId,
                      state: validateSelectOption(event),
                    },
                  })
                }
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
                onChange={(event) =>
                  setCoveringEmployee({
                    variables: {
                      id: claimId,
                      coveringEmployee: validateSelectEmployeeClaimOption(
                        event,
                      ),
                    },
                  })
                }
              >
                <MuiMenuItem key={'True'} value={'True'}>
                  True
                </MuiMenuItem>
                <MuiMenuItem key={'False'} value={'False'}>
                  False
                </MuiMenuItem>
              </MuiSelect>
            </EmployeeClaimWrapper>
          </Paper>
        )}
      </Mutation>
    )}
  </Mutation>
)

export { ClaimInformation }
