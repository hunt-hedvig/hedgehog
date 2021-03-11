import { Contract, Member, SanctionStatus } from 'api/generated/graphql'
import { MemberFlag } from 'components/member/shared/member-flag'
import { formatDistance, parseISO } from 'date-fns'
import { FlagOrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import { Paragraph, ThirdLevelHeadline } from 'hedvig-ui/typography'
import { FraudulentStatus } from 'lib/fraudulentStatus'
import * as React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { history } from 'store'
import { Market } from 'types/enums'
import {
  currentAgreementForContract,
  getFirstMasterInception,
  getLastTerminationDate,
} from 'utils/contract'
import { formatMoney } from 'utils/money'

import {
  Ban,
  Checkmark,
  Cross,
  QuestionMark,
  RedQuestionMark,
  ThumpsUp,
} from '../../../icons'

import { useCommandLine } from 'utils/hooks/command-line-hook'
import { KeyCode } from 'utils/hooks/key-press-hook'
import { Paper } from '../../../shared/Paper'

const SanctionStatusIcon: React.FC<{ status: SanctionStatus }> = ({
  status,
}) => {
  switch (status) {
    case SanctionStatus.Undetermined:
      return <QuestionMark />
    case SanctionStatus.NoHit:
      return <ThumpsUp />
    case SanctionStatus.PartialHit:
      return <RedQuestionMark />
    case SanctionStatus.FullHit:
      return <Ban />
    default:
      throw new Error('SanctionStatusPicker failed to map the status')
  }
}

const MemberName = styled('h2')({
  marginTop: 0,
  marginBottom: '2rem',
})

const MemberInformation: React.FC<{
  member: Member
  contract: Contract | null
}> = ({ member, contract }) => {
  const address = contract && currentAgreementForContract(contract)?.address
  const firstMasterInception = getFirstMasterInception(member.contracts)
  const lastTermination = getLastTerminationDate(member.contracts)

  const { registerActions, isHinting } = useCommandLine()

  registerActions([
    {
      label: `Go to member`,
      keysHint: ['CTRL', 'M'],
      keys: [KeyCode.Control, KeyCode.M],
      onResolve: () => {
        history.push(`/members/${member.memberId}`)
      },
    },
  ])

  return (
    <Paper>
      <ThirdLevelHeadline>Member Information</ThirdLevelHeadline>
      <MemberName>
        {member.firstName} {member.lastName}{' '}
        <MemberFlag memberId={member.memberId} />
      </MemberName>
      <Paragraph>
        <strong>Id:</strong>{' '}
        <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>{' '}
        {isHinting && '(M)'}
      </Paragraph>
      {member.contractMarketInfo?.market === Market.Norway && (
        <Paragraph>
          <strong>Identified:</strong>{' '}
          {member.identity ? <Checkmark /> : <Cross />}
        </Paragraph>
      )}
      <Paragraph>
        <strong>Personal Number:</strong> {member.personalNumber}
      </Paragraph>
      {address && (
        <Paragraph>
          <strong>Address:</strong> {address.street}, {address.postalCode}{' '}
          {address.city}
        </Paragraph>
      )}

      <Paragraph>
        <strong>Sanction Status:</strong> {member.sanctionStatus}{' '}
        <SanctionStatusIcon status={member.sanctionStatus!} />
      </Paragraph>
      <ThirdLevelHeadline>Fraud Checks</ThirdLevelHeadline>
      <Spacing bottom="small">
        <Paragraph>
          <strong>Fraudulent Status:</strong>{' '}
          <span style={{ fontSize: '32px' }}>
            <FraudulentStatus stateInfo={{ state: member.fraudulentStatus }} />
          </span>
        </Paragraph>
      </Spacing>
      <Paragraph>
        <strong>Signed:</strong>{' '}
        {Boolean(member.signedOn) &&
          formatDistance(parseISO(member.signedOn), new Date(), {
            addSuffix: true,
          })}
      </Paragraph>
      <Paragraph>
        <strong>First Master Inception:</strong> {firstMasterInception}
        {firstMasterInception && (
          <> ({formatDistance(new Date(firstMasterInception), new Date())}</>
        )}
        {!firstMasterInception && 'Never been active'})
      </Paragraph>
      {lastTermination && (
        <Paragraph>
          <strong>Last Termination Date:</strong> {lastTermination} (
          {lastTermination &&
            formatDistance(new Date(lastTermination), new Date(), {
              addSuffix: true,
            })}
        </Paragraph>
      )}
      <Paragraph>
        <strong>Direct Debit:</strong>{' '}
        {member.directDebitStatus?.activated ? <Checkmark /> : <Cross />}
      </Paragraph>
      <Paragraph>
        <strong>Payments Balance (Minimum):</strong>{' '}
        {member.account?.totalBalance &&
          formatMoney(member.account.totalBalance)}
      </Paragraph>
      <Paragraph>
        <strong>Failed Payments:</strong>{' '}
        {member.numberFailedCharges?.numberFailedCharges} payment(s) in a row
      </Paragraph>
      <Paragraph>
        <strong>Total Number of Claims:</strong> {member.totalNumberOfClaims}
      </Paragraph>
      {member.person && (
        <Paragraph>
          <strong>Debt Status:</strong>{' '}
          <FlagOrbIndicator flag={member.person.debtFlag} size={'tiny'} />
        </Paragraph>
      )}
    </Paper>
  )
}

export { MemberInformation }
