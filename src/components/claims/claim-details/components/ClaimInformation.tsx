import * as React from 'react'

import { parse, format } from 'date-fns'
import { Select } from '@material-ui/core';
import { CustomPaper } from './Styles'

enum ClaimState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED'
}

interface Props {
  recordingUrl: string
  registrationDate: string
  state: ClaimState
  updateState(state: ClaimState): void
}

const validateSelectOption = (event: React.ChangeEvent<HTMLSelectElement>): ClaimState => {
  const { value } = event.target
  if (!Object.keys(ClaimState).includes(value)) {
    throw new Error(`invalid ClaimState: ${value}`)
  }
  return value as ClaimState
}

const ClaimInformation: React.SFC<Props> = ({ recordingUrl, registrationDate, state, updateState }) => (
  <CustomPaper>
    <h3>Claim Information</h3>
    <p>Registered at: {format(parse(registrationDate), 'YYYY-MM-DD hh:mm:ss')}</p>
    <audio controls>
      <source src={recordingUrl} type="audio/aac" />
    </audio>
    <div>
      <a href={recordingUrl} target="_blank" rel="noopener noreferrer">Download claim file</a>
    </div>
    <p>Status</p>
    <Select
      native
      value={state}
      onChange={event => updateState(validateSelectOption(event))}
    >
      {Object.keys(ClaimState).map(s => <option key={s} value={s}>{s}</option>)}
    </Select>
  </CustomPaper>
)

export { ClaimInformation }
