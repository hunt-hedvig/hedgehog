import * as React from 'react'
import { Button, Dropdown, Icon, Input, Table } from 'semantic-ui-react'

const fraudulentStatuses = {
  UNDEFINED: 'grey',
  NOT_FRAUD: 'green',
  SUSPECTED_FRAUD: 'orange',
  CONFIRMED_FRAUD: 'red',
}

const FraudulentStatus = (props) => (
  <span
    title={
      props.stateInfo && props.stateInfo.description
        ? props.stateInfo.description
        : 'Fraudulent Status is not defined'
    }
  >
    <Icon
      name="circle"
      color={
        props.stateInfo && fraudulentStatuses[props.stateInfo.state]
          ? fraudulentStatuses[props.stateInfo.state]
          : 'grey'
      }
      size={'tiny'}
      style={{ verticalAlign: 'middle' }}
    />
  </span>
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
              onChange={(e, d) => (fraudulentStatusValue = d.value)}
              placeholder={fraudulentStatusValue}
            />
            <br />
            <Input
              fluid
              onChange={(e, d) => (descriptionValue = d.value)}
              defaultValue={descriptionValue}
            />
          </>
        )}
        <div style={{ float: 'right', marginTop: '10px' }}>
          {!props.getState() ? (
            <Button
              onClick={(e) =>
                props.setState(true, fraudulentStatusValue, descriptionValue)
              }
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                onClick={(e) => {
                  props.action(fraudulentStatusValue, descriptionValue)
                  props.setState(false, fraudulentStatusValue, descriptionValue)
                }}
                primary
              >
                Save
              </Button>
              <Button onClick={(e) => props.setState(false)}>Cancel</Button>
            </>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export { FraudulentStatus, FraudulentStatusEdit }
