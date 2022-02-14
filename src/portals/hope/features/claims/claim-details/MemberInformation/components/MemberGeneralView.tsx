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
import {
  addMonths,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  parse,
  parseISO,
} from 'date-fns'
import { Market } from 'portals/hope/features/config/constants'
import {
  getFirstMasterInception,
  getLastTerminationDate,
} from 'portals/hope/features/member/tabs/contracts-tab/utils'
import { formatSsn } from 'portals/hope/features/member/utils'
import React from 'react'
import {
  Flag,
  SanctionStatus,
  useMemberGeneralViewQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

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

export const Info = styled.div`
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

const formatDistanceWithAccuracy = (date: Date): string => {
  const result = []
  const now = new Date()

  const years = differenceInYears(now, date)

  if (years > 0) {
    result.push(`${years} years`)
    date = addYears(date, years)
  }

  const months = differenceInMonths(now, date)
  if (months > 0) {
    result.push(`${months} months`)
    date = addMonths(date, months)
  }

  const days = differenceInDays(now, date)

  if (days > 0) {
    result.push(`${days} days`)
  }

  result.push('ago')

  return result.join(' ')
}

gql`
  query MemberGeneralView($claimId: ID!) {
    claim(id: $claimId) {
      id
      member {
        memberId
        personalNumber
        firstName
        lastName
        signedOn
        contracts {
          id
          masterInception
          terminationDate
        }
        contractMarketInfo {
          market
        }
        identity {
          firstName
        }
        fraudulentStatus
        directDebitStatus {
          activated
        }
        sanctionStatus
        person {
          debtFlag
        }
        account {
          totalBalance {
            amount
            currency
          }
        }
        numberFailedCharges {
          numberFailedCharges
        }
      }
      contract {
        id
        currentAgreement {
          address {
            street
            postalCode
            city
          }
        }
      }
    }
  }
`

export const MemberGeneralView: React.FC<{
  memberId: string
  claimId: string
}> = ({ claimId }) => {
  const { data, loading } = useMemberGeneralViewQuery({
    variables: { claimId },
  })

  const contract = data?.claim?.contract
  const member = data?.claim?.member

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

  const address = contract?.currentAgreement?.address
  const firstMasterInception = getFirstMasterInception(member?.contracts ?? [])
  const lastTermination = getLastTerminationDate(member?.contracts ?? [])

  return (
    <InfoContainer>
      <Loadable loading={loading}>
        <InfoSection>
          <Flex direction="row">
            <Info style={{ width: '70%' }}>
              <span>Personal number</span>
              <div>
                {member?.personalNumber ? (
                  <Copyable
                    onClick={() => {
                      if (member?.personalNumber) {
                        copy(member.personalNumber)
                      }
                    }}
                  >
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
                      ? fraudulentStatusMap[
                          member.fraudulentStatus as FraudulentStatus
                        ]
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
                  contents={formatDistanceWithAccuracy(
                    parseISO(member.signedOn),
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
                      ? formatDistanceWithAccuracy(
                          parse(firstMasterInception, 'yyyy-MM-dd', new Date()),
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
