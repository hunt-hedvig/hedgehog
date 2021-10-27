import styled from '@emotion/styled'
import { FadeIn, Flex, Label, Loadable, Placeholder } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { colorsV3 } from '@hedviginsurance/brand'
import { differenceInYears, format, parseISO } from 'date-fns'
import React from 'react'
import { ClaimState, useGetMemberInfoQuery } from 'types/generated/graphql'
import {
  getMemberFlag,
  getMemberGroupName,
  getMemberIdColor,
} from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

const MemberPlaceholder = styled.div`
  border-radius: 8px;
  width: 100%;
  height: 180px;
`

const MemberCard = styled(FadeIn)`
  padding: 1em;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.foreground};
  color: ${({ theme }) => theme.background};
  width: 100%;
  min-height: 180px;
  cursor: pointer;
  transition: all 200ms;

  :hover {
    background-color: ${({ theme }) =>
      theme.type === 'dark' ? colorsV3.gray300 : colorsV3.gray800};
  }
`

const ClaimItem = styled.div`
  background-color: ${({ theme }) => theme.backgroundTransparent};
  padding: 0.8em 1em;
  font-size: 0.8em;
  width: 100%;
  border-radius: 8px;
  color: ${({ theme }) => theme.semiStrongForeground};
  margin-top: 0.5em;
  cursor: pointer;
  transition: all 200ms;

  :first-of-type {
    margin-top: 0.2em;
  }

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
  }
`

const MemberId = styled.span`
  color: ${({ theme }) => theme.semiStrongForeground};
`

const Tag = styled.span`
  font-size: 0.8em;
  background-color: ${({ theme }) => theme.backgroundTransparentContrast};
  border-radius: 8px;
  padding: 0.3em 0.6em;
`

const MemberGroupTag = styled(Tag)<{ color: string }>`
  background-color: ${({ color }) => color};
`

const MemberSummaryWrapper = styled.div`
  max-height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`

const AdditionalInfo = styled.div`
  overflow-y: scroll;
  width: 100%;

  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.backgroundTransparent};
  }
`

export const MemberSummary: React.FC<{ memberId: string }> = ({ memberId }) => {
  const { numberMemberGroups } = useNumberMemberGroups()
  const { data } = useGetMemberInfoQuery({
    variables: { memberId },
  })

  if (!data) {
    return (
      <Loadable loading>
        <MemberPlaceholder />
      </Loadable>
    )
  }

  const { member } = data

  if (!member) {
    return (
      <Loadable loading>
        <MemberPlaceholder />
      </Loadable>
    )
  }

  const { birthDate, claims } = member
  const age = differenceInYears(new Date(), parseISO(birthDate))

  const today = new Date()
  const isBirthday =
    new Date(birthDate).getDate() === today.getDate() &&
    new Date(birthDate).getMonth() === today.getMonth()

  const memberGroup = getMemberGroupName(memberId, numberMemberGroups)
  const memberGroupColor = getMemberIdColor(memberId, numberMemberGroups)

  const openClaims = member.claims.filter(
    (claim) => claim.state === ClaimState.Open || ClaimState.Reopened,
  )

  return (
    <Flex direction="column" style={{ maxHeight: '70vh' }}>
      <MemberCard
        onClick={() => {
          window.open(`/members/${memberId}`)
        }}
      >
        <Flex align="center" justify={'space-between'}>
          <span style={{ fontSize: '2rem' }}>
            {member?.firstName ?? ''} {member?.lastName ?? ''}
          </span>
          <Tag>{age} years</Tag>
        </Flex>
        <MemberId>{memberId}</MemberId>
        <Flex direction="row" style={{ marginTop: '3.5em' }}>
          <MemberGroupTag color={memberGroupColor}>
            {memberGroup}
          </MemberGroupTag>
          <Tag style={{ marginLeft: '1em' }}>
            {getMemberFlag(member?.contractMarketInfo, member.pickedLocale)}
          </Tag>
          {!openClaims.length && (
            <Tag style={{ marginLeft: '1em' }}>No open claims</Tag>
          )}
          {isBirthday && (
            <Tag style={{ marginLeft: '1em' }}>Birthday today 🎉</Tag>
          )}
        </Flex>
      </MemberCard>

      {!!openClaims.length && (
        <>
          <Label style={{ fontSize: '0.9em', marginTop: '2em' }}>
            Open claims
          </Label>
          <AdditionalInfo>
            <MemberSummaryWrapper>
              {claims
                .filter(
                  (claim) =>
                    claim.state === (ClaimState.Open || ClaimState.Reopened),
                )
                .slice(0)
                .reverse()
                .map((claim) => {
                  const registrationDate = parseISO(claim.registrationDate)
                  return (
                    <ClaimItem
                      onClick={() => window.open(`/claims/${claim.id}`)}
                      key={claim.id}
                    >
                      <Flex justify={'space-between'} align="center">
                        <div>
                          {claim.registrationDate &&
                            format(registrationDate, 'dd MMMM, yyyy')}
                          <br />
                          <span style={{ fontSize: '0.8em' }}>
                            {claim.registrationDate &&
                              format(registrationDate, 'HH:mm')}
                          </span>
                        </div>
                        <span style={{ paddingRight: '0.5em' }}>
                          {claim.claimType ? (
                            convertEnumToTitle(claim.claimType)
                          ) : (
                            <Placeholder>No claim type</Placeholder>
                          )}
                        </span>
                      </Flex>
                    </ClaimItem>
                  )
                })}
            </MemberSummaryWrapper>
          </AdditionalInfo>
        </>
      )}
    </Flex>
  )
}
