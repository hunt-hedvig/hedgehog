import * as React from 'react'
import { is } from 'redux-saga/utils'
import { Table } from 'semantic-ui-react'
import { Button, ButtonsGroup } from '../../../../../shared/hedvig-ui/button'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import { Agreement, Contract } from '../../../../api/generated/graphql'
import { useContracts } from '../../../../graphql/use-contracts'
import { useContractMarketInfo } from '../../../../graphql/use-get-member-contract-market-info'
import { useMemberInfo } from '../../../../graphql/use-member-info'
import { ButtonSpacing, FlexWrapper } from './contract-item'
import { InsuranceCertificate } from './InsuranceCertificate'
import { InsuranceMandate } from './InsuranceMandate'
import { NorwegianHomeContentAgreementKeyInfoComponent } from './norwegian-home-content-agreement-key-info'
import { NorwegianTravelAgreementKeyInfoComponent } from './norwegian-travel-agreement-key-info'
import { SwedishApartmentAgreementKeyInfo } from './swedish-apartment-agreement-key-info'
import { SwedishHouseAgreementKeyInfoComponent } from './swedish-house-agreement-key-info'
import { ToDate } from './ToDateComponent'
import { FromDate } from './FromDateComponent'
import { WithShowNotification } from '../../../../store/actions/notificationsActions'
import { isOfType } from './type-of-contract-helper'

export const AgreementItemComponent: React.FunctionComponent<{
  agreement: Agreement
  contract: Contract
} & WithShowNotification> = ({ agreement, contract, showNotification }) => {
  const [member, { loading, refetch }] = useMemberInfo(contract.holderMemberId)
  const getAgreementKeyInfo = () => {
    console.log(typeof agreement)

    if (agreement.__typename === 'SwedishApartment') {
      return (
        <SwedishApartmentAgreementKeyInfo
          contract={contract}
          member={member}
          agreement={agreement}
        />
      )
    }
    if (agreement.__typename === 'SwedishHouse') {
      return (
        <SwedishHouseAgreementKeyInfoComponent
          contract={contract}
          agreement={agreement}
          member={member}
        />
      )
    }
    if (agreement.__typename === 'NorwegianHomeContent') {
      return (
        <NorwegianHomeContentAgreementKeyInfoComponent
          contract={contract}
          agreement={agreement}
          member={member}
        />
      )
    }
    if (agreement.__typename === 'NorwegianTravel') {
      return (
        <NorwegianTravelAgreementKeyInfoComponent
          contract={contract}
          agreement={agreement}
          member={member}
        />
      )
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
                  {/*{getAddress().street}, {getAddress().city}*/}
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
          {getAgreementKeyInfo()}
          <FlexWrapper>
            <InsuranceMandate contract={contract} />
            <InsuranceCertificate
              contract={contract}
              agreement={agreement}
              showNotification={showNotification}
              onUploaded={() => refetch()}
            />
          </FlexWrapper>
          <FlexWrapper>
            <ToDate agreement={agreement} contract={contract} />
            <FromDate agreement={agreement} contract={contract} />
          </FlexWrapper>
          <Card span={2}>
            Create quote
            <ButtonSpacing>
              <Button>Create quote</Button>
            </ButtonSpacing>
          </Card>
        </div>
      </Spacing>
    </>
  )
}

export const AgreementItem = AgreementItemComponent
