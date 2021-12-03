import styled from '@emotion/styled'
import {
  Copyable,
  Flex,
  InfoContainer,
  InfoSection,
  InfoTag,
  InfoTagStatus,
  Loadable,
  Placeholder,
  Popover,
} from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { formatMoney } from '@hedvig-ui/utils/money'
import {
  convertCamelcaseToTitle,
  convertEnumOrSentenceToTitle,
  formatPostalCode,
} from '@hedvig-ui/utils/text'
import copy from 'copy-to-clipboard'
import { format, formatDistanceToNowStrict, parse, parseISO } from 'date-fns'
import { Market } from 'features/config/constants'
import {
  currentAgreementForContract,
  getFirstMasterInception,
  getLastTerminationDate,
} from 'features/member/tabs/contracts-tab/utils'
import { formatSsn } from 'features/member/utils'
import React from 'react'
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

const Info = styled.div`
  width: 100%;
  margin: 0.5rem 0;

  > span {
    display: block;
    width: 100%;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.semiStrongForeground};
    margin-bottom: -0.1rem;
  }

  > div {
    border-radius: 0.5rem;
  }
`

export const MemberGeneralView: React.FC<{
  memberId: string
  claimId: string
}> = ({ memberId, claimId }) => {
  const { data: contractData } = useClaimPageQuery({
    variables: { claimId },
  })
  const {
    data: memberContractsData,
    loading: memberContractsDataLoading,
  } = useClaimMemberContractsMasterInceptionQuery({ variables: { memberId } })

  const contract = contractData?.claim?.contract
  const member = memberContractsData?.member

  const address = contract && currentAgreementForContract(contract)?.address
  const firstMasterInception =
    member && getFirstMasterInception(member.contracts)
  const lastTermination = member && getLastTerminationDate(member.contracts)

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
    <InfoContainer>
      <Loadable loading={memberContractsDataLoading}>
        <InfoSection>
          <Flex direction="row">
            <Info style={{ width: '70%' }}>
              <span>Personal number</span>
              <div>
                {member?.personalNumber ? (
                  <Copyable onClick={() => copy(member.personalNumber!)}>
                    {formatSsn(member.personalNumber)}
                  </Copyable>
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </div>
            </Info>
            {member?.contractMarketInfo?.market === Market.Norway && (
              <Info style={{ width: '30%' }}>
                <span>Identified</span>
                <div>
                  <InfoTag
                    style={{
                      fontWeight: 'bold',
                      marginTop: '0.25rem',
                      textAlign: 'center',
                    }}
                    status={member.identity ? 'success' : 'warning'}
                  >
                    {member.identity ? 'Yes' : 'No'}
                  </InfoTag>
                </div>
              </Info>
            )}
          </Flex>
        </InfoSection>
        {address && (
          <InfoSection>
            <Flex direction="row">
              <Info style={{ width: '70%' }}>
                <span>Street</span>
                <div>{convertEnumOrSentenceToTitle(address.street)}</div>
              </Info>
              <Info style={{ width: '30%' }}>
                <span>Postal code</span>
                <div>{formatPostalCode(address.postalCode)}</div>
              </Info>
            </Flex>
            {address.city && (
              <Info>
                <span>City</span>
                <div>{convertEnumOrSentenceToTitle(address.city)}</div>
              </Info>
            )}
          </InfoSection>
        )}

        <InfoSection>
          <Flex direction="row">
            <Info style={{ marginRight: '0.5rem' }}>
              <span>Fraudulent Status</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.fraudulentStatus
                      ? fraudulentStatusMap[member.fraudulentStatus]
                      : 'neutral'
                  }
                >
                  {member?.fraudulentStatus
                    ? convertEnumOrSentenceToTitle(member.fraudulentStatus)
                    : 'Not applicable'}
                </InfoTag>
              </div>
            </Info>

            <Info style={{ marginLeft: '0.5rem' }}>
              <span>Direct Debit</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.directDebitStatus?.activated ? 'success' : 'warning'
                  }
                >
                  {member?.directDebitStatus?.activated
                    ? 'Activated'
                    : 'Not Activated'}
                </InfoTag>
              </div>
            </Info>
          </Flex>

          <Flex direction="row" justify="center" align="center">
            <Info style={{ marginRight: '0.5rem' }}>
              <span>Sanction Status</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.sanctionStatus
                      ? sanctionStatusMap[member.sanctionStatus]
                      : 'neutral'
                  }
                >
                  {member?.sanctionStatus
                    ? convertCamelcaseToTitle(member.sanctionStatus)
                    : 'Not applicable'}
                </InfoTag>
              </div>
            </Info>

            <Info style={{ marginLeft: '0.5rem' }}>
              <span>Debt status</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.person?.debtFlag
                      ? debtFlagMap[member.person.debtFlag]
                      : 'neutral'
                  }
                >
                  {member?.person?.debtFlag
                    ? debtFlagDescriptionMap[member.person.debtFlag]
                    : 'Not applicable'}
                </InfoTag>
              </div>
            </Info>
          </Flex>
        </InfoSection>

        <InfoSection>
          <Info>
            <span>Signed</span>
            <div>
              {member?.signedOn ? (
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
              ) : (
                <Placeholder>Not applicable</Placeholder>
              )}
            </div>
          </Info>

          <Flex direction="row">
            <Info>
              <span>Master inception</span>
              <div>
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
                  {firstMasterInception ?? (
                    <Placeholder>Never active</Placeholder>
                  )}
                </Popover>
              </div>
            </Info>

            <Info>
              <span>Last termination date</span>
              <div>
                {lastTermination ?? <Placeholder>Not applicable</Placeholder>}
              </div>
            </Info>
          </Flex>

          <Flex direction="row">
            <Info>
              <span>Payments balance</span>
              <div>
                {member?.account?.totalBalance ? (
                  formatMoney(member.account.totalBalance)
                ) : (
                  <Placeholder>Not applicable</Placeholder>
                )}
              </div>
            </Info>
            <Info>
              <span>Failed payments</span>
              <div>
                {member?.numberFailedCharges?.numberFailedCharges === 0 ? (
                  <Placeholder>None</Placeholder>
                ) : (
                  member?.numberFailedCharges?.numberFailedCharges &&
                  member.numberFailedCharges.numberFailedCharges
                )}
                {member?.numberFailedCharges?.numberFailedCharges &&
                member.numberFailedCharges.numberFailedCharges > 1
                  ? ' in a row'
                  : ''}
              </div>
            </Info>
          </Flex>
        </InfoSection>
      </Loadable>
    </InfoContainer>
  )
}
