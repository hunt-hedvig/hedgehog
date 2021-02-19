import { Contract, Member, SanctionStatus } from 'api/generated/graphql'
import { MemberFlag } from 'components/member/shared/member-flag'
import { formatDistance, parseISO } from 'date-fns'
import { FlagOrbIndicator } from 'hedvig-ui/orb-indicator'
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

  const { useAction, isHinting } = useCommandLine()

  useAction([
    {
      label: `Go to member`,
      keysHint: ['⌥', 'M'],
      keys: [KeyCode.Option, KeyCode.M],
      onResolve: () => {
        history.push(`/members/${member.memberId}`)
      },
    },
  ])

  return (
    <Paper>
      <h3>Member Information</h3>
      <MemberName>
        {member.firstName} {member.lastName}{' '}
        <MemberFlag memberId={member.memberId} />
      </MemberName>
      <p>
        <strong>Id:</strong>{' '}
        <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>{' '}
        {isHinting && '(M)'}
      </p>
      {member.contractMarketInfo?.market === Market.Norway && (
        <p>
          <strong>Identified:</strong>{' '}
          {member.identity ? <Checkmark /> : <Cross />}
        </p>
      )}
      <p>
        <strong>Personal Number:</strong> {member.personalNumber}
      </p>
      {address && (
        <p>
          <strong>Address:</strong> {address.street}, {address.postalCode}{' '}
          {address.city}
        </p>
      )}

      <p>
        <strong>Sanction Status:</strong> {member.sanctionStatus}{' '}
        <SanctionStatusIcon status={member.sanctionStatus!} />
      </p>
      <h3>Fraud Checks</h3>
      <p>
        <strong>Signed:</strong>{' '}
        {Boolean(member.signedOn) &&
          formatDistance(parseISO(member.signedOn), new Date(), {
            addSuffix: true,
          })}
      </p>
      <p>
        <strong>First Master Inception:</strong> {firstMasterInception}
        {firstMasterInception && (
          <>({formatDistance(new Date(firstMasterInception), new Date())})</>
        )}
        {!firstMasterInception && 'Never been active'})
      </p>
      {lastTermination && (
        <p>
          <strong>Last Termination Date:</strong> {lastTermination} (
          {lastTermination &&
            formatDistance(new Date(lastTermination), new Date(), {
              addSuffix: true,
            })}
        </p>
      )}
      <p style={{ marginTop: '-7px' }}>
        <strong>Fraudulent Status:</strong>{' '}
        <span style={{ fontSize: '32px' }}>
          <FraudulentStatus stateInfo={{ state: member.fraudulentStatus }} />
        </span>
      </p>
      <p>
        <strong>Direct Debit:</strong>{' '}
        {member.directDebitStatus?.activated ? <Checkmark /> : <Cross />}
      </p>
      <p>
        <strong>Payments Balance (Minimum):</strong>{' '}
        {member.account?.totalBalance &&
          formatMoney(member.account.totalBalance)}
      </p>
      <p>
        <strong>Failed Payments:</strong>{' '}
        {member.numberFailedCharges?.numberFailedCharges} payment(s) in a row
      </p>
      <p>
        <strong>Total Number of Claims:</strong> {member.totalNumberOfClaims}
      </p>
      {member.person && (
        <p>
          <strong>Debt Status:</strong>{' '}
          <FlagOrbIndicator flag={member.person.debtFlag} size={'tiny'} />
        </p>
      )}
    </Paper>
  )
}

export { MemberInformation }
