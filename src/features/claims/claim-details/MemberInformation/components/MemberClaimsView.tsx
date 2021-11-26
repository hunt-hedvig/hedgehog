import styled from '@emotion/styled'
import { Label, Spacing } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import chroma from 'chroma-js'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import React from 'react'
import { Claim, ClaimState, GetMemberInfoQuery } from 'types/generated/graphql'

const ClaimItemWrapper = styled.div<{ claimType: boolean; outcome: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 200ms;

  margin-bottom: 0.5rem;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent)
        .brighten(1.5)
        .alpha(0.3)
        .hex()};
  }

  width: 100%;
  height: 4rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(0.5)
      .alpha(0.15)
      .hex()};

  padding: 0.75rem;

  div {
    h5 {
      font-size: 1rem;
      padding: 0;
      margin: 0;
    }
    span {
      font-size: 0.9rem;
      color: ${({ theme, outcome }) =>
        outcome ? theme.placeholderColor : theme.semiStrongForeground};
    }
  }
`

const ClaimItem: React.FC<{ claim: Claim }> = ({ claim }) => {
  const registrationDateString = formatDate(
    parseISO(claim.registrationDate),
    'dd MMMM, yyyy',
  )
  const registrationDateTimeString = formatDate(
    parseISO(claim.registrationDate),
    'HH:mm',
  )

  return (
    <ClaimItemWrapper outcome={!!claim.outcome} claimType={!!claim.claimType}>
      <div>
        <h5>
          {claim.claimType ? convertEnumToTitle(claim.claimType) : 'No type'}
        </h5>
        <span>{claim.outcome ?? 'No outcome'}</span>
      </div>
      <div>
        <h5>{registrationDateString}</h5>
        <span>{registrationDateTimeString}</span>
      </div>
    </ClaimItemWrapper>
  )
}

export const MemberClaimsView: React.FC<{
  member: GetMemberInfoQuery['member']
}> = ({ member }) => {
  const claims = member?.claims ?? []

  const openClaims = claims.filter(
    (claim) =>
      claim.state === ClaimState.Open || claim.state === ClaimState.Reopened,
  )

  const closedClaims = claims.filter(
    (claim) => claim.state === ClaimState.Closed,
  )

  return (
    <>
      {openClaims.length !== 0 && (
        <>
          <Label>Open</Label>
          <div style={{ marginBottom: '0.25rem' }} />
        </>
      )}
      {openClaims.map((claim) => (
        <ClaimItem key={claim.id} claim={claim as Claim} />
      ))}

      <Spacing top="small" />

      {closedClaims.length !== 0 && (
        <>
          <Label>Closed</Label>
          <div style={{ marginBottom: '0.25rem' }} />
        </>
      )}
      {closedClaims.map((claim) => (
        <ClaimItem key={claim.id} claim={claim as Claim} />
      ))}
    </>
  )
}
