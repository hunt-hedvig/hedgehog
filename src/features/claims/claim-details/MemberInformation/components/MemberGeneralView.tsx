import styled from '@emotion/styled'
import {
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

const ClickableText = styled.span`
  color: ${({ theme }) => theme.accent};
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

        <InfoSection>
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
          {!!member?.numberFailedCharges?.numberFailedCharges && (
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
        </InfoSection>
      </Loadable>
    </InfoContainer>
  )
}
