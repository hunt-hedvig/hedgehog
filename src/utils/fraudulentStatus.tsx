// @ts-nocheck
import styled from '@emotion/styled'
import { Member } from 'api/generated/graphql'
import React from 'react'
import { Button, Dropdown, Icon, Input, Table } from 'semantic-ui-react'

const ButtonsBlock = styled('div')((_) => ({
  floar: 'right',
  marginTop: '10px',
}))

const StatusBallBlock = ({ stateInfo, children }) => (
  <span
    style={{ verticalAlign: 'middle' }}
    title={
      stateInfo && stateInfo.description
        ? stateInfo.description
        : 'Fraudulent Status is not defined'
    }
  >
    {children}
  </span>
)

const IconStyled = styled(Icon)(() => ({
  verticalAlign: 'middle',
}))

const InputStyled = styled(Input)(() => ({
  marginTop: '5px',
}))

const fraudulentStatuses = {
  NOT_FRAUD: 'green',
  SUSPECTED_FRAUD: 'orange',
  CONFIRMED_FRAUD: 'red',
}

const FraudulentStatus: React.FC<{
  stateInfo: {
    state: Member['fraudulentStatus']
    description?: Member['fraudulentStatusDescription']
  }
}> = (props) => (
  <StatusBallBlock stateInfo={props.stateInfo}>
    <IconStyled
      name="circle"
      color={
        props.stateInfo && fraudulentStatuses[props.stateInfo.state]
          ? fraudulentStatuses[props.stateInfo.state]
          : 'green'
      }
      size={'tiny'}
    />
  </StatusBallBlock>
)

const FraudulentStatusEdit = (props) => {
  let descriptionValue: string = props.getFraudStatusInfo().description
  let fraudulentStatusValue: string = props.getFraudStatusInfo().status
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
            <Dropdown
              fluid
              selection
              options={Object.keys(fraudulentStatuses).map((item) => {
                return {
                  key: item,
                  text: item,
                  value: item,
                  selected: item === fraudulentStatusValue,
                  active: item === fraudulentStatusValue,
                }
              })}
              // @ts-ignore
              onChange={(e, d) => (fraudulentStatusValue = d.value)}
              placeholder={fraudulentStatusValue}
            />
            <InputStyled
              fluid
              onChange={(e, d) => (descriptionValue = d.value)}
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
            <>
              <Button
                onClick={() => {
                  props.action(fraudulentStatusValue, descriptionValue)
                  props.setState(false, fraudulentStatusValue, descriptionValue)
                }}
                primary
              >
                Save
              </Button>
              <Button onClick={() => props.setState(false)}>Cancel</Button>
            </>
          )}
        </ButtonsBlock>
      </Table.Cell>
    </Table.Row>
  )
}

export { FraudulentStatus, FraudulentStatusEdit }
