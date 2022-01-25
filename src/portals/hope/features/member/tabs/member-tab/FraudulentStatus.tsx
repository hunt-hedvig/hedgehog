import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  Input,
  OrbIndicator,
  TableColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { Member } from 'types/generated/graphql'

const ButtonsBlock = styled('div')(() => ({
  float: 'right',
  marginTop: '10px',
}))

const fraudulentStatuses: Record<string, string> = {
  NOT_FRAUD: '#21ba45',
  SUSPECTED_FRAUD: '#f2711c',
  CONFIRMED_FRAUD: '#db2828',
}

const FraudulentStatus: React.FC<{
  stateInfo: {
    state: Member['fraudulentStatus']
    description?: Member['fraudulentStatusDescription']
  }
}> = (props) => (
  <OrbIndicator
    style={{ marginRight: 15 }}
    size="14px"
    color={
      props.stateInfo.state && fraudulentStatuses[props.stateInfo.state]
        ? fraudulentStatuses[props.stateInfo.state || 0]
        : 'green'
    }
  />
)

const FraudulentStatusEdit: React.FC<{
  onEdit: (status: string, description: string) => void
  getFraudStatusInfo: () => { status: string; description: string }
  getState: () => boolean
  setState: (editing: boolean, status?: string, description?: string) => void
}> = ({ onEdit, getFraudStatusInfo, getState, setState }) => {
  const [descriptionValue, setDescriptionValue] = React.useState<string>(
    getFraudStatusInfo().description,
  )
  const [fraudulentStatusValue, setFraudulentStatusValue] =
    React.useState<string>(getFraudStatusInfo().status)

  return (
    <TableRow>
      <TableColumn>Fraudulent Status</TableColumn>
      <TableColumn>
        {!getState() ? (
          <>
            Status: {getFraudStatusInfo().status} <br />
            {getFraudStatusInfo().description}
          </>
        ) : (
          <>
            <Dropdown placeholder={fraudulentStatusValue}>
              {Object.keys(fraudulentStatuses)
                .map((item) => ({
                  key: item,
                  text: item,
                  value: item,
                  selected: item === fraudulentStatusValue,
                  active: item === fraudulentStatusValue,
                }))
                .map((opt) => (
                  <DropdownOption
                    key={opt.key}
                    onClick={() => setFraudulentStatusValue(opt.value)}
                    selected={opt.value === fraudulentStatusValue}
                  >
                    {opt.text}
                  </DropdownOption>
                ))}
            </Dropdown>
            <Input
              style={{ marginTop: 15 }}
              onChange={({ currentTarget: { value } }) =>
                setDescriptionValue(value)
              }
              defaultValue={descriptionValue}
            />
          </>
        )}
        <ButtonsBlock>
          {!getState() ? (
            <Button
              onClick={() =>
                setState(true, fraudulentStatusValue, descriptionValue)
              }
            >
              Edit
            </Button>
          ) : (
            <ButtonsGroup>
              <Button
                onClick={() => {
                  onEdit(fraudulentStatusValue, descriptionValue)
                  setState(false, fraudulentStatusValue, descriptionValue)
                }}
                variant="primary"
              >
                Save
              </Button>
              <Button variant="secondary" onClick={() => setState(false)}>
                Cancel
              </Button>
            </ButtonsGroup>
          )}
        </ButtonsBlock>
      </TableColumn>
    </TableRow>
  )
}

export { FraudulentStatus, FraudulentStatusEdit }
