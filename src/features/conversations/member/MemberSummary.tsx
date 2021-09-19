import styled from '@emotion/styled'
import { FadeIn, Flex, Label, Placeholder } from '@hedvig-ui'
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
import { splitOnUpperCase } from 'utils/text'

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

export const MemberSummary: React.FC<{ memberId: string }> = ({ memberId }) => {
  const { numberMemberGroups } = useNumberMemberGroups()
  const { data } = useGetMemberInfoQuery({
    variables: { memberId },
  })

  if (!data) {
    return null
  }

  const { member } = data

  if (!member) {
    return null
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
    <>
      <MemberCard
        onClick={() => {
          window.open(`/members/${memberId}`)
        }}
      >
        <Flex align={'center'} justify={'space-between'}>
          <span style={{ fontSize: '1.8em' }}>
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
      {!!claims.length && (
        <FadeIn style={{ marginTop: '2.0em', width: '100%' }}>
          <Label style={{ fontSize: '0.9em' }}>Open claims</Label>
          <Flex direction={'column'}>
            {claims
              .slice(0)
              .reverse()
              .filter(
                (claim) =>
                  claim.state === (ClaimState.Open || ClaimState.Reopened),
              )
              .map((claim) => {
                const registrationDate = parseISO(claim.registrationDate)
                return (
                  <ClaimItem
                    onClick={() => window.open(`/claims/${claim.id}`)}
                    key={claim.id}
                  >
                    <Flex justify={'space-between'} align={'center'}>
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
                        {claim.type?.__typename ? (
                          splitOnUpperCase(claim.type.__typename.toString())
                        ) : (
                          <Placeholder>No claim type</Placeholder>
                        )}
                      </span>
                    </Flex>
                  </ClaimItem>
                )
              })}
          </Flex>
        </FadeIn>
      )}
    </>
  )
}
