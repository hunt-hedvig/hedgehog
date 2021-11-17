import styled from '@emotion/styled'
import {
  CardContent,
  CardTitle,
  Copyable,
  InfoContainer,
  InfoRow,
  InfoSection,
  InfoTag,
  InfoTagStatus,
  InfoText,
  Loadable,
  Popover,
} from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { formatMoney } from '@hedvig-ui/utils/money'
import {
  convertCamelcaseToTitle,
  convertEnumOrSentenceToTitle,
  formatPostalCode,
} from '@hedvig-ui/utils/text'
import copy from 'copy-to-clipboard'
import { format, formatDistanceToNowStrict, parse, parseISO } from 'date-fns'
import { useCommandLine } from 'features/commands/command-line-hook'
import { Market } from 'features/config/constants'
import {
  currentAgreementForContract,
  getFirstMasterInception,
  getLastTerminationDate,
} from 'features/member/tabs/contracts-tab/utils'
import { formatSsn, getMemberFlag } from 'features/member/utils'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import {
  Flag,
  SanctionStatus,
  useClaimMemberContractsMasterInceptionQuery,
  useClaimPageQuery,
} from 'types/generated/graphql'

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
  [Flag.Green]: 'No Debt',
  [Flag.Amber]: 'Minor Debt',
  [Flag.Red]: 'Major Debt',
}

const MemberName = styled('h2')({
  marginTop: 0,
  marginBottom: '2rem',
})

const ClickableText = styled.span`
  color: ${({ theme }) => theme.accent};
`

export const MemberInformation: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const {
    data: contractData,
    error: claimContractQueryError,
  } = useClaimPageQuery({
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

  const nameEndsOnS =
    member?.firstName &&
    member?.firstName[member?.firstName?.length - 1] === 's'

  useTitle(
    member && member.firstName
      ? !nameEndsOnS
        ? `${member?.firstName}’s claim`
        : `${member?.firstName}' claim`
      : `Claim Details`,
    [member],
  )

  return (
    <CardContent>
      <CardTitle
        title="Member Info"
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />

      <InfoContainer>
        <Loadable loading={memberContractsDataLoading}>
          {member && !!member?.firstName && !!member?.lastName && (
            <MemberName>
              {`${member.firstName} ${member.lastName} ${getMemberFlag(
                member.contractMarketInfo,
                member.pickedLocale,
              )}`}
            </MemberName>
          )}
          <InfoRow>
            Member ID
            <InfoText>
              <Copyable
                copyLabel={{ before: 'Copy link' }}
                onClick={() => {
                  copy(`${window.location.origin}/members/${memberId}`)
                }}
              >
                <Link to={`/members/${memberId}`}>{memberId}</Link>{' '}
                {isHintingOption && '(M)'}
              </Copyable>
            </InfoText>
          </InfoRow>
          {member?.contractMarketInfo?.market === Market.Norway && (
            <InfoRow>
              Identified
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={member.identity ? 'success' : 'warning'}
                >
                  {member.identity ? 'Yes' : 'No'}
                </InfoTag>
              </InfoText>
            </InfoRow>
          )}
          {!!member?.personalNumber && (
            <InfoRow>
              Personal number
              <InfoText>
                <Copyable onClick={() => copy(member.personalNumber!)}>
                  <ClickableText>
                    {formatSsn(member.personalNumber)}
                  </ClickableText>
                </Copyable>
              </InfoText>
            </InfoRow>
          )}
          {!!member?.sanctionStatus && (
            <InfoRow>
              Sanction status
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={sanctionStatusMap[member.sanctionStatus]}
                >
                  {convertCamelcaseToTitle(member.sanctionStatus)}
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
              {address.city && (
                <InfoRow>
                  City
                  <InfoText>
                    {convertEnumOrSentenceToTitle(address.city)}
                  </InfoText>
                </InfoRow>
              )}
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
                  : 'Not Activated'}
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

          {member?.signedOn && (
            <InfoRow>
              Signed
              <InfoText>
                <Popover
                  contents={formatDistanceToNowStrict(
                    parseISO(member.signedOn),
                    {
                      addSuffix: true,
                    },
                  )}
                >
                  {member.signedOn &&
                    format(parseISO(member.signedOn), 'yyyy-MM-dd HH:mm')}
                </Popover>
              </InfoText>
            </InfoRow>
          )}

          <InfoRow>
            Master inception
            <InfoText>
              <Popover
                contents={
                  firstMasterInception
                    ? formatDistanceToNowStrict(
                        parse(firstMasterInception, 'yyyy-MM-dd', new Date()),
                        {
                          addSuffix: true,
                        },
                      )
                    : 'Never active'
                }
              >
                {firstMasterInception ?? 'Never active'}
              </Popover>
            </InfoText>
          </InfoRow>

          {lastTermination && (
            <InfoRow>
              Last termination date
              <InfoText>{lastTermination}</InfoText>
            </InfoRow>
          )}
          {!!member?.account?.totalBalance && (
            <InfoRow>
              Payments balance
              <InfoText>{formatMoney(member.account.totalBalance)}</InfoText>
            </InfoRow>
          )}
          {member?.numberFailedCharges?.numberFailedCharges && (
            <InfoRow>
              Failed payments
              <InfoText>
                {member.numberFailedCharges.numberFailedCharges}
                {member.numberFailedCharges.numberFailedCharges > 1
                  ? ' in a row'
                  : ''}
              </InfoText>
            </InfoRow>
          )}
          {!!member?.totalNumberOfClaims && (
            <InfoRow>
              Total number of claims
              <InfoText>{member.totalNumberOfClaims}</InfoText>
            </InfoRow>
          )}
        </Loadable>
      </InfoContainer>
    </CardContent>
  )
}
