import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  FadeIn,
  Flex,
  InfoContainer,
  InfoRow,
  InfoTag,
  InfoText,
  LoadingMessage,
  MainHeadline,
  Popover,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui/utils/money'
import { AccountEntryTable } from 'portals/hope/features/member/tabs/account-tab/AccountEntryTable'
import { AddEntryForm } from 'portals/hope/features/member/tabs/account-tab/AddEntryForm'
import { AddMonthlyEntryForm } from 'portals/hope/features/member/tabs/account-tab/AddMonthlyEntryForm'
import { BackfillSubscriptionsButton } from 'portals/hope/features/member/tabs/account-tab/BackfillSubscriptionsButton'
import { useGetAccount } from 'portals/hope/features/member/tabs/account-tab/hooks/use-get-account'
import { MonthlyEntriesTable } from 'portals/hope/features/member/tabs/account-tab/MonthlyEntriesTable'
import { RefreshButton } from 'portals/hope/features/member/tabs/shared/refresh-button'
import React, { useState } from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

const moneyOptions = {
  minimumFractionDigits: 2,
  useGrouping: true,
}

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
        <RefreshButton onClick={() => refetch()} isloading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>
      <CardsWrapper>
        <Card span={2}>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>Balance</ThirdLevelHeadline>
            </InfoRow>
            <Spacing top="small" />
            <InfoRow>
              Current Month
              <InfoText>
                {formatMoney(account?.currentBalance, moneyOptions)}
              </InfoText>
            </InfoRow>
            <Spacing top="small" />
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
            <Spacing top="small" />
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
            <Spacing top="small" />
            {account?.chargeEstimation?.discountCodes.length > 0 && (
              <InfoRow>
                Discount References
                <InfoText>
                  {account?.chargeEstimation?.discountCodes.join(', ')}
                </InfoText>
              </InfoRow>
            )}
            <Spacing top="small" />
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
          <Flex justify="space-between">
            <Flex>
              <ThirdLevelHeadline>Account Entries</ThirdLevelHeadline>
              <Spacing left="small">
                <Popover
                  contents={
                    <>
                      The total amount from the account entries, <br />
                      called the balance, is the amount we will
                      <br /> charge a member that month.
                    </>
                  }
                >
                  <InfoTag status="info">How does it work?</InfoTag>
                </Popover>
              </Spacing>
            </Flex>
            <div>
              <BackfillSubscriptionsButton memberId={memberId} />
              <Button
                onClick={() => setShowAccountEntryForm(true)}
                disabled={showAccountEntryForm}
                style={{ marginLeft: '1.0em' }}
              >
                New account entry
              </Button>
            </div>
          </Flex>
          {showAccountEntryForm && (
            <FadeIn duration={200} style={{ width: '100%' }}>
              <Spacing top="medium" bottom="large">
                <AddEntryForm
                  memberId={memberId}
                  onCancel={() => setShowAccountEntryForm(false)}
                  onSuccess={() => setShowAccountEntryForm(false)}
                />
              </Spacing>
            </FadeIn>
          )}
          {account.entries.length !== 0 ? (
            <Spacing top="medium">
              <AccountEntryTable accountEntries={account.entries} />
            </Spacing>
          ) : (
            <NoTableMessage paddingTop="4em" paddingBottom="2em">
              No account entries
            </NoTableMessage>
          )}
        </Card>
      </CardsWrapper>
      <CardsWrapper>
        <Card>
          <Flex justify="space-between">
            <Flex direction="row">
              <ThirdLevelHeadline>Monthly Entries</ThirdLevelHeadline>
              <Spacing left="small">
                <Popover
                  contents={
                    <>
                      Entries that will be added once every month to the
                      member's account. <br /> Note that they are always added,
                      regardless of contract status, <br /> to their full
                      amount. You can remove them though.
                    </>
                  }
                >
                  <InfoTag status="info">How does it work?</InfoTag>
                </Popover>
              </Spacing>
            </Flex>
            <Button
              onClick={() => setShowMonthlyEntryForm(true)}
              disabled={showMonthlyEntryForm}
            >
              New monthly entry
            </Button>
          </Flex>

          {showMonthlyEntryForm && (
            <FadeIn duration={200} style={{ width: '100%' }}>
              <Spacing top="medium" bottom="large">
                <AddMonthlyEntryForm
                  memberId={memberId}
                  onCancel={() => setShowMonthlyEntryForm(false)}
                  onSuccess={() => setShowMonthlyEntryForm(false)}
                />
              </Spacing>
            </FadeIn>
          )}

          {account.monthlyEntries.length ? (
            <Spacing top="medium">
              <MonthlyEntriesTable
                memberId={memberId}
                monthlyEntries={account.monthlyEntries}
              />
            </Spacing>
          ) : (
            <NoTableMessage paddingTop="4em" paddingBottom="2em">
              No monthly entries
            </NoTableMessage>
          )}
        </Card>
      </CardsWrapper>
    </FadeIn>
  )
}
