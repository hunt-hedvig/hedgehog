import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  Input,
  OrbIndicator,
} from '@hedvig-ui'
import React from 'react'
import { Table } from 'semantic-ui-react'
import { Member } from 'types/generated/graphql'

const ButtonsBlock = styled('div')((_) => ({
  floar: 'right',
  marginTop: '10px',
}))

const fraudulentStatuses = {
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
      props.stateInfo && fraudulentStatuses[props.stateInfo.state || 0]
        ? fraudulentStatuses[props.stateInfo.state || 0]
        : 'green'
    }
  />
)

const FraudulentStatusEdit = (props) => {
  const [descriptionValue, setDescriptionValue] = React.useState<string>(
    props.getFraudStatusInfo().description,
  )
  const [fraudulentStatusValue, setFraudulentStatusValue] = React.useState<
    string
  >(props.getFraudStatusInfo().status)
  return (
    <Table.Row>
      <Table.Cell>Fraudulent Status</Table.Cell>
      <Table.Cell>
        {!props.getState() ? (
          <>
            Status: {props.getFraudStatusInfo().status} <br />
            {props.getFraudStatusInfo().description}
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
          {!props.getState() ? (
            <Button
              onClick={() =>
                props.setState(true, fraudulentStatusValue, descriptionValue)
              }
            >
              Edit
            </Button>
          ) : (
            <ButtonsGroup>
              <Button
                onClick={() => {
                  props.action(fraudulentStatusValue, descriptionValue)
                  props.setState(false, fraudulentStatusValue, descriptionValue)
                }}
                variant="primary"
              >
                Save
              </Button>
              <Button variant="secondary" onClick={() => props.setState(false)}>
                Cancel
              </Button>
            </ButtonsGroup>
          )}
        </ButtonsBlock>
      </Table.Cell>
    </Table.Row>
  )
}

export { FraudulentStatus, FraudulentStatusEdit }
