import styled from '@emotion/styled'
import {
  Flag,
  SanctionStatus,
  useClaimContractQuery,
  useClaimMemberContractsMasterInceptionQuery,
} from 'api/generated/graphql'
import { MemberFlag } from 'components/member/shared/member-flag'
import { formatDistance, parseISO } from 'date-fns'
import { Loadable } from 'hedvig-ui/loadable'
import { ErrorText, ThirdLevelHeadline } from 'hedvig-ui/typography'
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
  InfoRow,
  InfoSection,
  InfoTag,
  InfoTagStatus,
  InfoText,
} from 'hedvig-ui/info-row'
import { formatSsn } from 'utils/member'
import { convertEnumOrSentenceToTitle, formatPostalCode } from 'utils/text'
import { Checkmark, Cross } from '../../../icons'
import { Paper } from '../../../shared/Paper'

type FraudulentStatus = 'NOT_FRAUD' | 'SUSPECTED_FRAUD' | 'CONFIRMED_FRAUD'

const fraudulentStatusMap: Record<FraudulentStatus, InfoTagStatus> = {
  NOT_FRAUD: 'success',
  SUSPECTED_FRAUD: 'warning',
  CONFIRMED_FRAUD: 'danger',
}

const sanctionStatusMap: Record<SanctionStatus, InfoTagStatus> = {
  [SanctionStatus.NoHit]: 'success',
  [SanctionStatus.PartialHit]: 'warning',
  [SanctionStatus.Undetermined]: 'warning',
  [SanctionStatus.FullHit]: 'danger',
}

const debtFlagMap: Record<Flag, InfoTagStatus> = {
  [Flag.Green]: 'success',
  [Flag.Amber]: 'warning',
  [Flag.Red]: 'danger',
}

const debtFlagDescriptionMap: Record<Flag, string> = {
  [Flag.Green]: 'No debt',
  [Flag.Amber]: 'Minor debt',
  [Flag.Red]: 'Major debt',
}

const MemberName = styled('h2')({
  marginTop: 0,
  marginBottom: '2rem',
})

export const MemberInformation: React.FC<{
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
            <InfoText>
              {member?.personalNumber ? formatSsn(member.personalNumber) : '-'}
            </InfoText>
          </InfoRow>
          {member?.sanctionStatus && (
            <InfoRow>
              Sanction status
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={sanctionStatusMap[member.sanctionStatus]}
                >
                  {member.sanctionStatus}
                </InfoTag>
              </InfoText>
            </InfoRow>
          )}
          {address && (
            <InfoSection>
              <InfoRow>
                Street
                <InfoText>
                  {convertEnumOrSentenceToTitle(address.street)}
                </InfoText>
              </InfoRow>
              <InfoRow>
                Postal code
                <InfoText>{formatPostalCode(address.postalCode)}</InfoText>
              </InfoRow>
              <InfoRow>
                City
                <InfoText>
                  {convertEnumOrSentenceToTitle(address.city ?? '')}
                </InfoText>
              </InfoRow>
            </InfoSection>
          )}

          {member?.fraudulentStatus && (
            <InfoRow>
              Fraudulent status
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={fraudulentStatusMap[member.fraudulentStatus]}
                >
                  {convertEnumOrSentenceToTitle(member.fraudulentStatus ?? '')}
                </InfoTag>
              </InfoText>
            </InfoRow>
          )}

          <InfoRow>
            Direct debit
            <InfoText>
              <InfoTag
                style={{ fontWeight: 'bold' }}
                status={
                  member?.directDebitStatus?.activated ? 'success' : 'warning'
                }
              >
                {member?.directDebitStatus?.activated
                  ? 'Activated'
                  : 'Not activated'}
              </InfoTag>
            </InfoText>
          </InfoRow>

          {member?.person?.debtFlag && (
            <InfoRow>
              Debt status
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={debtFlagMap[member.person.debtFlag]}
                >
                  {debtFlagDescriptionMap[member.person.debtFlag]}
                </InfoTag>
              </InfoText>
            </InfoRow>
          )}

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
              {member?.numberFailedCharges?.numberFailedCharges ?? 0 > 1
                ? 's in a row'
                : ''}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Total number of claims
            <InfoText>{member?.totalNumberOfClaims ?? '-'}</InfoText>
          </InfoRow>
        </Loadable>
      </InfoContainer>
    </Paper>
  )
}
