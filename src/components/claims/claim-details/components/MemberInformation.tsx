import styled from '@emotion/styled'
import {
  SanctionStatus,
  useClaimContractQuery,
  useClaimMemberContractsMasterInceptionQuery,
} from 'api/generated/graphql'
import { MemberFlag } from 'components/member/shared/member-flag'
import { formatDistance, parseISO } from 'date-fns'
import { Loadable } from 'hedvig-ui/loadable'
import { FlagOrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import { ErrorText, Paragraph, ThirdLevelHeadline } from 'hedvig-ui/typography'
import { FraudulentStatus } from 'lib/fraudulentStatus'
import React from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Market } from 'types/enums'
import {
  currentAgreementForContract,
  getFirstMasterInception,
  getLastTerminationDate,
} from 'utils/contract'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys } from 'utils/hooks/key-press-hook'
import { formatMoney } from 'utils/money'

import {
  Ban,
  Checkmark,
  Cross,
  QuestionMark,
  RedQuestionMark,
  ThumpsUp,
} from '../../../icons'
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
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const {
    data: contractData,
    error: claimContractQueryError,
  } = useClaimContractQuery({
    variables: { claimId },
  })
  const {
    data: memberContractsData,
    loading: memberContractsDataLoading,
    error: memberContractsQueryError,
  } = useClaimMemberContractsMasterInceptionQuery({ variables: { memberId } })
  const contract = contractData?.claim?.contract
  const member = memberContractsData?.member
  const queryError = claimContractQueryError ?? memberContractsQueryError

  const address = contract && currentAgreementForContract(contract)?.address
  const firstMasterInception =
    member && getFirstMasterInception(member.contracts)
  const lastTermination = member && getLastTerminationDate(member.contracts)

  const { registerActions, isHintingOption } = useCommandLine()
  const history = useHistory()

  registerActions([
    {
      label: `Go to member`,
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        history.push(`/members/${memberId}`)
      },
    },
  ])

  return (
    <Paper>
      <ThirdLevelHeadline>Member Information</ThirdLevelHeadline>
      {queryError && <ErrorText>{queryError.message}</ErrorText>}

      <Loadable loading={memberContractsDataLoading}>
        <MemberName>
          {member?.firstName ?? '-'} {member?.lastName ?? '-'}{' '}
          {member && <MemberFlag memberId={memberId} />}
        </MemberName>
        <Paragraph>
          <strong>Id:</strong>{' '}
          <Link to={`/members/${memberId}`}>{memberId}</Link>{' '}
          {isHintingOption && '(M)'}
        </Paragraph>
        {member?.contractMarketInfo?.market === Market.Norway && (
          <Paragraph>
            <strong>Identified:</strong>{' '}
            {member.identity ? <Checkmark /> : <Cross />}
          </Paragraph>
        )}
        <Paragraph>
          <strong>Personal Number:</strong> {member?.personalNumber ?? '-'}
        </Paragraph>
        {address && (
          <Paragraph>
            <strong>Address:</strong> {address.street}, {address.postalCode}{' '}
            {address.city}
          </Paragraph>
        )}

        <Paragraph>
          <strong>Sanction Status:</strong> {member?.sanctionStatus ?? '-'}{' '}
          {member?.sanctionStatus && (
            <SanctionStatusIcon status={member.sanctionStatus} />
          )}
        </Paragraph>
        <ThirdLevelHeadline>Fraud Checks</ThirdLevelHeadline>
        <Spacing bottom="small">
          <Paragraph>
            <strong>Fraudulent Status:</strong>{' '}
            <span style={{ fontSize: '32px' }}>
              {member?.fraudulentStatus && (
                <FraudulentStatus
                  stateInfo={{ state: member.fraudulentStatus }}
                />
              )}
            </span>
          </Paragraph>
        </Spacing>
        <Paragraph>
          <strong>Signed:</strong>{' '}
          {member?.signedOn &&
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
          {member?.directDebitStatus?.activated ? <Checkmark /> : <Cross />}
        </Paragraph>
        <Paragraph>
          <strong>Payments Balance (Minimum):</strong>{' '}
          {member?.account?.totalBalance &&
            formatMoney(member.account.totalBalance)}
        </Paragraph>
        <Paragraph>
          <strong>Failed Payments:</strong>{' '}
          {member?.numberFailedCharges?.numberFailedCharges ?? '-'} payment(s)
          in a row
        </Paragraph>
        <Paragraph>
          <strong>Total Number of Claims:</strong>{' '}
          {member?.totalNumberOfClaims ?? '-'}
        </Paragraph>
        {member?.person && (
          <Paragraph>
            <strong>Debt Status:</strong>{' '}
            <FlagOrbIndicator flag={member.person.debtFlag} size={'tiny'} />
          </Paragraph>
        )}
      </Loadable>
    </Paper>
  )
}

export { MemberInformation }
