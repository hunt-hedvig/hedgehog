import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { Input } from 'hedvig-ui/input'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'

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

interface ForeverStatusProps {
  eligible: boolean
}

const ForeverStatusBadge = styled('div')<ForeverStatusProps>`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ eligible, theme }) =>
    eligible ? theme.success : theme.danger};
  border-radius: 8px;
  color: #fff;
`

const CampaignCodeBadge = styled('div')`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ theme }) => theme.accent};
  border-radius: 8px;
  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
`

export const ReferralsTab: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [referralInformation] = useGetReferralInformation(memberId)
  const [referralCode, setReferralCode] = React.useState('')

  /* MOCK DATA
  const referralInformation = {
    eligible: true,
    campaign: { code: 'Meletis' },
    hasReferred: [
      {
        memberId: '123',
        name: 'Rasmus',
        status: 'OFFER',
      },
      {
        memberId: '654321',
        name: 'Elvin',
        status: 'OFFER',
      },
    ],
  }
   */

  return (
    <>
      <Headline>Referrals</Headline>
      <ReferralsWrapper>
        <CardsWrapper>
          <Card span={2}>
            <InfoContainer>
              <InfoRow style={{ marginTop: '0.4rem' }}>
                <span style={{ marginTop: '0.3rem' }}>Campaign Code</span>
                <InfoText>
                  {(
                    <CampaignCodeBadge>
                      {referralInformation?.campaign.code.toUpperCase()}
                    </CampaignCodeBadge>
                  ) ?? 'Not available'}
                </InfoText>
              </InfoRow>
              <InfoRow style={{ marginTop: '1.5rem' }}>
                <span style={{ marginTop: '0.3rem' }}>Hedvig Forever</span>
                <InfoText>
                  {referralInformation ? (
                    <ForeverStatusBadge eligible={referralInformation.eligible}>
                      {referralInformation.eligible ? 'Activated' : 'Disabled'}
                    </ForeverStatusBadge>
                  ) : (
                    'Not available'
                  )}
                </InfoText>
              </InfoRow>
            </InfoContainer>
          </Card>
          <Card span={2}>
            {referralInformation?.eligible ? (
              <>
                <Input
                  placeholder={'Campaign code'}
                  value={referralCode}
                  onChange={(_e, { value }) => setReferralCode(value)}
                />
                <ButtonsGroup style={{ marginTop: '1.0rem' }}>
                  <Button
                    variation="primary"
                    fullWidth
                    onClick={() => console.log('Hello world')}
                  >
                    Unredeem
                  </Button>
                  <Button
                    variation="primary"
                    fullWidth
                    onClick={() => console.log('Hello world')}
                  >
                    Redeem
                  </Button>
                </ButtonsGroup>
              </>
            ) : (
              <Button
                variation="primary"
                fullWidth
                onClick={() => console.log('Hello world')}
                style={{ marginTop: '1.0rem' }}
              >
                Activate Hedvig Forever
              </Button>
            )}
          </Card>
        </CardsWrapper>
      </ReferralsWrapper>
      <ThirdLevelHeadline style={{ marginBottom: '-0.2rem' }}>
        Members referred
      </ThirdLevelHeadline>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={6}>Member id</Table.HeaderCell>
            <Table.HeaderCell width={6}>Name</Table.HeaderCell>
            <Table.HeaderCell width={6}>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {referralInformation?.hasReferred?.map((member) => (
            <Table.Row key={member.memberId}>
              <Table.Cell>{member.memberId}</Table.Cell>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
