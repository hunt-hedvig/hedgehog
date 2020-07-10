import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'

const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

const ReferralsWrapper = styled('div')`
  &:not(:first-of-type) {
    margin-top: 5rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 5rem;
  }
`

export const ReferralsTab: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [referralInformation] = useGetReferralInformation(memberId)
  return (
    <>
      {console.log(referralInformation)}
      <Headline>Referrals</Headline>
      <ReferralsWrapper>
        <CardsWrapper>
          <Card span={1}>
            <InfoContainer>
              <InfoRow>
                Campaign Code
                <InfoText>{memberId}</InfoText>
              </InfoRow>
              <InfoRow>
                Hedvig Forever status
                <InfoText>ACTIVE</InfoText>
              </InfoRow>
            </InfoContainer>
          </Card>
        </CardsWrapper>
      </ReferralsWrapper>

      <Table celled selectable sortable={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={6}>Member id</Table.HeaderCell>
            <Table.HeaderCell width={6}>Date</Table.HeaderCell>
            <Table.HeaderCell width={6}>Type</Table.HeaderCell>
            <Table.HeaderCell width={6}>State</Table.HeaderCell>
            <Table.HeaderCell width={6}>Reserves</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>hello</Table.Cell>
            <Table.Cell>123</Table.Cell>
            <Table.Cell>456</Table.Cell>
            <Table.Cell>789</Table.Cell>
            <Table.Cell>10234</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  )
}
