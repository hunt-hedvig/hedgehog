import { Table, TableBody, TableHeader, TableHeaderColumn } from '@hedvig-ui'
import React from 'react'
import { GenericAgreement } from 'types/generated/graphql'
import { AgreementRow } from './AgreementRow'

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<GenericAgreement>
  selectedAgreement: string | undefined
  setSelectedAgreement: (agreementId: string | undefined) => void
  locale: string
}> = ({ agreements, selectedAgreement, setSelectedAgreement, locale }) => (
  <Table style={{ margin: '1em 0' }}>
    <TableHeader>
      <TableHeaderColumn>Line of Business</TableHeaderColumn>
      <TableHeaderColumn>Carrier</TableHeaderColumn>
      <TableHeaderColumn>From Date</TableHeaderColumn>
      <TableHeaderColumn>To Date</TableHeaderColumn>
      <TableHeaderColumn>Premium</TableHeaderColumn>
      <TableHeaderColumn>Status</TableHeaderColumn>
    </TableHeader>
    <TableBody>
      {agreements.map((agreement) => (
        <AgreementRow
          key={agreement.id}
          selected={agreement.id === selectedAgreement}
          agreement={agreement}
          selectedAgreement={selectedAgreement}
          setSelectedAgreement={setSelectedAgreement}
          locale={locale}
        />
      ))}
    </TableBody>
  </Table>
)
