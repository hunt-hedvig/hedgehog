import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { Button, ButtonsGroup } from '../../../../../shared/hedvig-ui/button'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { DateTimePicker } from '../../../../../shared/hedvig-ui/date-time-picker'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import { Agreement, Contract } from '../../../../api/generated/graphql'
import { ButtonSpacing, FlexWrapper } from './contract-item'
import { InsuranceMandate } from './InsuranceMandate'
import { FromDate, ToDate } from './ToDateComponent'

export const AgreementItemComponent: React.FunctionComponent<{
  agreement: Agreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const getAddress = () => {
    if (agreement.__typename.toString() === 'SwedishApartment') {
      return agreement.address
    }
    if (agreement.__typename.toString() === 'SwedishHouse') {
      return agreement.address
    }
    if (agreement.__typename.toString() === 'NorwegianHomeContent') {
      return agreement.address
    }
    if (agreement.__typename.toString() === 'NorwegianTravel') {
      return agreement.address
    }
  }

  return (
    <>
      <Spacing all>
        <div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>m2</Table.HeaderCell>
                <Table.HeaderCell>Household size</Table.HeaderCell>
                <Table.HeaderCell>Active from</Table.HeaderCell>
                <Table.HeaderCell>Active to</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{agreement.__typename}</Table.Cell>
                <Table.Cell>
                  {getAddress().street}, {getAddress().city}
                </Table.Cell>
                <Table.Cell>{}</Table.Cell>
                <Table.Cell>{agreement.numberCoInsured + 1}</Table.Cell>
                <Table.Cell>{agreement.fromDate}</Table.Cell>
                <Table.Cell>{agreement.toDate}</Table.Cell>
                <Table.Cell>{agreement.basePremium}</Table.Cell>
                <Table.Cell>{agreement.status}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <FlexWrapper>
            <Card span={2}>
              <span>name: </span>
              <span>address line: {}</span>
              <span>postcode: {}</span>
              <span>Type: {agreement.__typename}</span>
              <span>Persons in household: {agreement.numberCoInsured + 1}</span>
              <span>Living space: </span>
            </Card>
            <Card span={2}>
              <span>Current Total Price: {agreement.basePremium}</span>
              <span>Status: {agreement.status}</span>
              <span>State:{}</span>
              <span>Signed: </span>
              <span>Current Insurer:</span>
            </Card>
          </FlexWrapper>
          <FlexWrapper>
            <InsuranceMandate contract={contract} />
            <Card span={2}>
              Insurance certificate
              <ButtonsGroup>
                <Button>View existing</Button>
                <Button>Upload new</Button>
              </ButtonsGroup>
            </Card>
          </FlexWrapper>
          <FlexWrapper>
            <Card span={2}>
              Create quote
              <ButtonSpacing>
                <Button>Create quote</Button>
              </ButtonSpacing>
            </Card>
            {/*<Card span={2}>*/}
            {/*  From date*/}
            {/*  <ButtonSpacing>*/}
            {/*    <Button>Edit</Button>*/}
            {/*  </ButtonSpacing>*/}
            {/*</Card>*/}
            <ToDate agreement={agreement} contract={contract} />
          </FlexWrapper>
          <Card span={2}>
            To date
            <ButtonSpacing>
              <Button>Edit</Button>
            </ButtonSpacing>
          </Card>
        </div>
      </Spacing>
    </>
  )
}

export const AgreementItem = AgreementItemComponent
