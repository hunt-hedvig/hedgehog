import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { ExpandMoreOutlined } from '@material-ui/icons'
import { ContractMarketInfo } from 'api/generated/graphql'
import { AddEntryForm } from 'components/member/tabs/account-tab/add-entry-form'
import { BackfillSubscriptionsButton } from 'components/member/tabs/account-tab/backfill-subscriptions-button'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/shared/card-components'
import { Paper } from 'components/shared/Paper'
import { useGetAccount } from 'graphql/use-get-account'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { Spacing } from 'hedvig-ui/spacing'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import styled, { css, keyframes } from 'react-emotion'
import { formatMoney } from 'utils/money'

const moneyOptions = {
  minimumFractionDigits: 2,
  useGrouping: true,
}

const TableRowColored = styled(TableRow)(({ entry }: { entry }) => {
  if (entry.failedAt) {
    return { backgroundColor: '#FFDDDD' }
  } else if (entry.amount.amount < 0) {
    return { backgroundColor: '#FFFFDD' }
  } else {
    return { backgroundColor: '#DDFFDD' }
  }
})

const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

const spin = keyframes`
  from{transform: rotate(0deg)}
  to{transform: rotate(360deg)}
`
const RefreshButton = styled.button<{ loading: boolean }>`
  background: transparent;
  font-size: 0.875em;
  color: ${({ theme }) => theme.mutedText};
  padding: 0;
  border: 0;
  margin-left: 1rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: transform 500ms;
  ${({ loading }) =>
    loading &&
    css`
      animation: ${spin} 500ms linear infinite;
    `};
`

const TableCell = styled(MuiTableCell)({
  fontSize: '1rem',
})

export const AccountTab: React.FC<{
  memberId: string
  contractMarketInfo: ContractMarketInfo
}> = ({ memberId, contractMarketInfo }) => {
  const [account, { loading, refetch, error }] = useGetAccount(memberId)

  if (loading) {
    return (
      <>
        <Headline>
          Account
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </Headline>
        Loading...
      </>
    )
  }
  if (error || !account) {
    return (
      <>
        <Headline>
          Account
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </Headline>
        No account found :(
      </>
    )
  }
  return (
    <>
      <Headline>
        Account
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </Headline>
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
              Total Discount Amount
              <InfoText>
                {formatMoney(account?.currentBalance, moneyOptions)}
              </InfoText>
            </InfoRow>
            <InfoRow>
              Subscription Charge
              <InfoText>
                {formatMoney(
                  account?.chargeEstimation.subscription,
                  moneyOptions,
                )}
              </InfoText>
            </InfoRow>
            <Spacing top={'small'} />
            <InfoRow>
              Discount References
              <InfoText>
                {account?.chargeEstimation?.discountCodes.length === 0
                  ? 'None'
                  : account?.chargeEstimation?.discountCodes}
              </InfoText>
            </InfoRow>
            <Spacing top={'small'} />
            <InfoRow>
              Net Charge Next Month
              <InfoText>
                {formatMoney(account?.chargeEstimation?.charge, moneyOptions)}
              </InfoText>
            </InfoRow>
          </InfoContainer>
        </Card>
      </CardsWrapper>
      <Spacing top={'small'} />
      <ExpansionPanel elevation={0}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreOutlined />}>
          <Typography>Add entry</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AddEntryForm
            memberId={memberId}
            preferredCurrency={contractMarketInfo.preferredCurrency}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {account.entries.map((entry) => (
              <TableRowColored key={entry.id} entry={entry}>
                <TableCell>{entry.fromDate}</TableCell>
                <TableCell>{entry.type.toLowerCase()}</TableCell>
                <TableCell>
                  {entry.id}
                  <br />
                  {entry.title
                    ? entry.title
                    : `${entry.reference} (${entry.source})`}
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {entry.amount.amount} {entry.amount.currency}
                  </strong>
                </TableCell>
              </TableRowColored>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}
