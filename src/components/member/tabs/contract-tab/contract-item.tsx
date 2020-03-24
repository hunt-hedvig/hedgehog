import { colors } from '@hedviginsurance/brand/dist'
import { Contract } from 'api/generated/graphql'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { SecondLevelHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { Button, ButtonsGroup } from '../../../../../shared/hedvig-ui/button'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import { dateTimeFormatter } from '../../../../lib/helpers'
import { formatMoneySE } from '../../../../lib/intl'
import TableFields from '../../../shared/table-fields/TableFields'
import { MasterInception } from './master-inception'
import { TerminationDate } from './termination-date'

export const ButtonSpacing = styled('div')({
  paddingTop: '1rem',
})

const FlexWrapper = styled('div')({
  display: 'flex',
})

export const ContractItem: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
  return (
    <>
      <CardsWrapper>
        <Card>
          <SecondLevelHeadline>{contract.contractTypeName}</SecondLevelHeadline>
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Termination Date</ThirdLevelHeadline>
          <TerminationDate contract={contract} />
        </Card>
        <Card span={1}>
          <span>
            <strong>Market:</strong> {contract.market}
          </span>
        </Card>
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
                  <Table.Cell>text</Table.Cell>
                  <Table.Cell>text</Table.Cell>
                  <Table.Cell>text</Table.Cell>
                  <Table.Cell>text</Table.Cell>
                  <Table.Cell>;text</Table.Cell>
                  <Table.Cell>;text</Table.Cell>
                  <Table.Cell>;text</Table.Cell>
                  <Table.Cell>;text</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <FlexWrapper>
              <Card span={2}>
                Insurance Mandate
                <ButtonSpacing>
                  <Button>Download</Button>
                </ButtonSpacing>
              </Card>
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
              <Card span={2}>
                From date
                <ButtonSpacing>
                  <Button>Edit</Button>
                </ButtonSpacing>
              </Card>
            </FlexWrapper>
            <Card span={2}>
              To date
              <ButtonSpacing>
                <Button>Edit</Button>
              </ButtonSpacing>
            </Card>
          </div>
        </Spacing>
        <Card span={1}>
          <h4>Debug</h4>
          <span>
            <strong>Contract id:</strong> {contract.id}
          </span>
          <span>
            <strong>Member id:</strong> {contract.holderMemberId}
          </span>
        </Card>
      </CardsWrapper>
    </>
  )
}
