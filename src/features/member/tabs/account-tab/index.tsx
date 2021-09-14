import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  FadeIn,
  InfoContainer,
  InfoRow,
  InfoText,
  LoadingMessage,
  MainHeadline,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { AccountEntryTable } from 'features/member/tabs/account-tab/AccountEntryTable'
import { AddEntryForm } from 'features/member/tabs/account-tab/AddEntryForm'
import { AddMonthlyEntryForm } from 'features/member/tabs/account-tab/AddMonthlyEntryForm'
import { BackfillSubscriptionsButton } from 'features/member/tabs/account-tab/BackfillSubscriptionsButton'
import { MonthlyEntriesTable } from 'features/member/tabs/account-tab/MonthlyEntriesTable'
import { useGetAccount } from 'graphql/use-get-account'
import React, { useState } from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import { formatMoney } from 'utils/money'
import { RefreshButton } from '../shared/refresh-button'

const moneyOptions = {
  minimumFractionDigits: 2,
  useGrouping: true,
}

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

const NoTableMessage = styled(StandaloneMessage)`
  font-size: 1.1em;
`

export const AccountTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [showAccountEntryForm, setShowAccountEntryForm] = useState(false)
  const [showMonthlyEntryForm, setShowMonthlyEntryForm] = useState(false)
  const [account, { loading, refetch, error }] = useGetAccount(memberId)

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }
  if (error || !account) {
    return (
      <StandaloneMessage paddingTop="10vh">No account found</StandaloneMessage>
    )
  }

  return (
    <FadeIn>
      <MainHeadline>
        Account
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>
      <CardsWrapper>
        <Card span={2}>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>Balance</ThirdLevelHeadline>
            </InfoRow>
            <Spacing top={'small'} />
            <InfoRow>
              Current Month
              <InfoText>
                {formatMoney(account?.currentBalance, moneyOptions)}
              </InfoText>
            </InfoRow>
            <Spacing top={'small'} />
            <InfoRow>
              Total
              <InfoText>
                {formatMoney(account?.totalBalance, moneyOptions)}
              </InfoText>
            </InfoRow>
          </InfoContainer>
        </Card>
        <Card span={2}>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>
                Upcoming Charge Information
              </ThirdLevelHeadline>
            </InfoRow>
            <Spacing top={'small'} />
            <InfoRow>
              Current Balance
              <InfoText>
                {formatMoney(account?.currentBalance, moneyOptions)}
              </InfoText>
            </InfoRow>
            <InfoRow>
              Upcoming Subscription
              <InfoText>
                +{' '}
                {formatMoney(
                  account?.chargeEstimation.subscription,
                  moneyOptions,
                )}
              </InfoText>
            </InfoRow>
            {+account?.chargeEstimation.discount.amount > 0 && (
              <InfoRow>
                Upcoming Discount
                <InfoText>
                  -{' '}
                  {formatMoney(
                    account?.chargeEstimation.discount,
                    moneyOptions,
                  )}
                </InfoText>
              </InfoRow>
            )}
            <Spacing top={'small'} />
            {account?.chargeEstimation?.discountCodes.length > 0 && (
              <InfoRow>
                Discount References
                <InfoText>
                  {account?.chargeEstimation?.discountCodes.join(', ')}
                </InfoText>
              </InfoRow>
            )}
            <Spacing top={'small'} />
            <InfoRow>
              Upcoming Charge
              <InfoText>
                = {formatMoney(account?.chargeEstimation?.charge, moneyOptions)}
              </InfoText>
            </InfoRow>
          </InfoContainer>
        </Card>
      </CardsWrapper>

      <CardsWrapper>
        <Card>
          <TitleWrapper>
            <div>
              <ThirdLevelHeadline>Account Entries</ThirdLevelHeadline>
            </div>
            <div>
              <BackfillSubscriptionsButton memberId={memberId} />
              <Button
                style={{ marginLeft: '1.0em' }}
                variation={'primary'}
                onClick={() => setShowAccountEntryForm(true)}
                disabled={showAccountEntryForm}
              >
                New account entry
              </Button>
            </div>
          </TitleWrapper>
          {/*<FourthLevelHeadline>
            The total amount from the account entries, called the <i>balance</i>
            , at the end of a month, is the amount we will charge a member that
            month.
          </FourthLevelHeadline>*/}
          {showAccountEntryForm && (
            <FadeIn duration={200} style={{ width: '100%' }}>
              <Spacing top={'medium'} bottom={'large'}>
                <AddEntryForm
                  memberId={memberId}
                  onCancel={() => setShowAccountEntryForm(false)}
                  onSuccess={() => setShowAccountEntryForm(false)}
                />
              </Spacing>
            </FadeIn>
          )}
          {account.entries.length !== 0 ? (
            <Spacing top={'medium'}>
              <AccountEntryTable accountEntries={account.entries} />
            </Spacing>
          ) : (
            <NoTableMessage paddingTop={'2em'} paddingBottom={'2em'}>
              No account entries
            </NoTableMessage>
          )}
        </Card>
      </CardsWrapper>
      <CardsWrapper>
        <Card>
          <TitleWrapper>
            <div>
              <ThirdLevelHeadline>Monthly Entries</ThirdLevelHeadline>
            </div>
            <Button
              variation={'primary'}
              onClick={() => setShowMonthlyEntryForm(true)}
              disabled={showMonthlyEntryForm}
            >
              New monthly entry
            </Button>
          </TitleWrapper>

          {showMonthlyEntryForm && (
            <FadeIn duration={200} style={{ width: '100%' }}>
              <Spacing top={'medium'} bottom={'large'}>
                <AddMonthlyEntryForm
                  memberId={memberId}
                  onCancel={() => setShowMonthlyEntryForm(false)}
                  onSuccess={() => setShowMonthlyEntryForm(false)}
                />
              </Spacing>
            </FadeIn>
          )}

          {account.monthlyEntries.length !== 0 ? (
            <Spacing top={'medium'}>
              <MonthlyEntriesTable
                memberId={memberId}
                monthlyEntries={account.monthlyEntries}
              />
            </Spacing>
          ) : (
            <NoTableMessage paddingTop={'2em'} paddingBottom={'2em'}>
              No monthly entries
            </NoTableMessage>
          )}
        </Card>
      </CardsWrapper>
    </FadeIn>
  )
}
