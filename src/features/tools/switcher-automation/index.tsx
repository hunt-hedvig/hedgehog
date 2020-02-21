import { colorsV2 } from '@hedviginsurance/brand'
import { MainHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import styled, { css } from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Button } from 'hedvig-ui/button'

const StatusTableRow = styled(Table.Row)<{
  muted?: boolean
  screaming?: boolean
}>`
  ${({ muted }) =>
    muted
      ? css`
          opacity: 0.5;
        `
      : ''};
  ${({ screaming }) =>
    screaming
      ? css`
          background-color: ${colorsV2.sunflower300};
        `
      : ''};
`

export const SwitcherAutomation: React.FC = () => (
  <>
    <MainHeadline>🏡 Switcher automation</MainHeadline>
    <Table>
      <Table.Header>
        <StatusTableRow>
          <Table.HeaderCell>Member</Table.HeaderCell>
          <Table.HeaderCell>Current Insurer</Table.HeaderCell>
          <Table.HeaderCell>Sign date</Table.HeaderCell>
          <Table.HeaderCell>Sent date</Table.HeaderCell>
          <Table.HeaderCell>Sent reminder</Table.HeaderCell>
        </StatusTableRow>
      </Table.Header>
      <Table.Body>
        <StatusTableRow screaming>
          <Table.Cell>
            <Link to={`/members/${123456}`}>123456</Link>
          </Table.Cell>
          <Table.Cell>Folksam</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>
            <Button size="small" variation="secondary">
              Mark as reminded
            </Button>
          </Table.Cell>
        </StatusTableRow>
        <StatusTableRow>
          <Table.Cell>
            <Link to={`/members/${123456}`}>123456</Link>
          </Table.Cell>
          <Table.Cell>Folksam</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>Reminded</Table.Cell>
        </StatusTableRow>
        <StatusTableRow muted>
          <Table.Cell>
            <Link to={`/members/${123456}`}>123456</Link>
          </Table.Cell>
          <Table.Cell>Folksam</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>Reminded</Table.Cell>
        </StatusTableRow>
        <StatusTableRow muted>
          <Table.Cell>
            <Link to={`/members/${123456}`}>123456</Link>
          </Table.Cell>
          <Table.Cell>Folksam</Table.Cell>
          <Table.Cell>2020-02-21</Table.Cell>
          <Table.Cell>-</Table.Cell>
          <Table.Cell>
            <Button size="small" variation="secondary">
              Mark as reminded
            </Button>
          </Table.Cell>
        </StatusTableRow>
      </Table.Body>
    </Table>
  </>
)
