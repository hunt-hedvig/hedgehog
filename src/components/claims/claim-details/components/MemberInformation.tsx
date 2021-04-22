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
import { ErrorText, ThirdLevelHeadline } from 'hedvig-ui/typography'
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
  InfoContainer,
  InfoDelimiter,
  InfoRow,
  InfoSection,
  InfoText,
} from 'hedvig-ui/info-row'
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

      <InfoContainer>
        <Loadable loading={memberContractsDataLoading}>
          <MemberName>
            {member?.firstName ?? '-'} {member?.lastName ?? '-'}{' '}
            {member && <MemberFlag memberId={memberId} />}
          </MemberName>
          <InfoRow>
            Member ID
            <InfoText>
              <Link to={`/members/${memberId}`}>{memberId}</Link>{' '}
              {isHintingOption && '(M)'}
            </InfoText>
          </InfoRow>
          {member?.contractMarketInfo?.market === Market.Norway && (
            <InfoRow>
              Identified
              <InfoText>{member.identity ? <Checkmark /> : <Cross />}</InfoText>
            </InfoRow>
          )}
          <InfoRow>
            Personal number
            <InfoText>{member?.personalNumber ?? '-'}</InfoText>
          </InfoRow>
          {address && (
            <InfoSection>
              <InfoRow>
                Street
                <InfoText>{address.street}</InfoText>
              </InfoRow>
              <InfoRow>
                Postal code
                <InfoText>{address.postalCode}</InfoText>
              </InfoRow>
              <InfoRow>
                City
                <InfoText>{address.city}</InfoText>
              </InfoRow>
            </InfoSection>
          )}

          <InfoRow>
            Sanction status
            <InfoText>
              {member?.sanctionStatus ?? '-'}{' '}
              {member?.sanctionStatus && (
                <SanctionStatusIcon status={member.sanctionStatus} />
              )}
            </InfoText>
          </InfoRow>
          <InfoDelimiter />
          <InfoRow>
            Fraudulent status
            <InfoText>
              <span style={{ fontSize: '32px' }}>
                {member?.fraudulentStatus && (
                  <FraudulentStatus
                    stateInfo={{ state: member.fraudulentStatus }}
                  />
                )}
              </span>
            </InfoText>
          </InfoRow>

          <InfoRow>
            Signed
            <InfoText>
              {member?.signedOn &&
                formatDistance(parseISO(member.signedOn), new Date(), {
                  addSuffix: true,
                })}
            </InfoText>
          </InfoRow>

          <InfoRow>
            First master inception
            <InfoText>
              {firstMasterInception}
              {firstMasterInception && (
                <>
                  {' '}
                  ({formatDistance(new Date(firstMasterInception), new Date())}
                </>
              )}
              {!firstMasterInception && 'Never been active'})
            </InfoText>
          </InfoRow>

          {lastTermination && (
            <InfoRow>
              Last termination date
              <InfoText>
                {lastTermination} (
                {lastTermination &&
                  formatDistance(new Date(lastTermination), new Date(), {
                    addSuffix: true,
                  })}
              </InfoText>
            </InfoRow>
          )}
          <InfoRow>
            Direct debit
            <InfoText>
              {member?.directDebitStatus?.activated ? <Checkmark /> : <Cross />}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Payments balance (minimum)
            <InfoText>
              {member?.account?.totalBalance &&
                formatMoney(member.account.totalBalance)}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Failed payments
            <InfoText>
              {member?.numberFailedCharges?.numberFailedCharges ?? '-'} payment
              {member?.numberFailedCharges?.numberFailedCharges > 1
                ? 's in a row'
                : ''}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Total number of claims
            <InfoText>{member?.totalNumberOfClaims ?? '-'}</InfoText>
          </InfoRow>
          {member?.person && (
            <InfoRow>
              Debt status
              <InfoText>
                <FlagOrbIndicator flag={member.person.debtFlag} size={'tiny'} />
              </InfoText>
            </InfoRow>
          )}
        </Loadable>
      </InfoContainer>
    </Paper>
  )
}

export { MemberInformation }
