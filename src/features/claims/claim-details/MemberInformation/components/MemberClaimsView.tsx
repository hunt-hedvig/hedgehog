import styled from '@emotion/styled'
import { Label, Spacing } from '@hedvig-ui'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import chroma from 'chroma-js'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import React, { HTMLAttributes } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Claim, ClaimState, GetMemberInfoQuery } from 'types/generated/graphql'

const ClaimItemWrapper = styled(Link)<{ claimType: boolean; outcome: boolean }>`
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
    :nth-of-type(2) {
      text-align: right;
    }

    h5 {
      font-size: 1rem;
      padding: 0;
      margin: 0;
      color: ${({ theme, claimType }) =>
        claimType ? theme.foreground : theme.semiStrongForeground};
    }
    span {
      font-size: 0.9rem;
      color: ${({ theme, outcome }) =>
        outcome ? theme.foreground : theme.semiStrongForeground};
    }
  }
`

const ClaimItem: React.FC<{ claim: Claim } & HTMLAttributes<
  HTMLAnchorElement
>> = ({ claim, ...props }) => {
  const registrationDateString = formatDate(
    parseISO(claim.registrationDate),
    'dd MMMM, yyyy',
  )
  const registrationDateTimeString = formatDate(
    parseISO(claim.registrationDate),
    'HH:mm',
  )

  return (
    <ClaimItemWrapper
      outcome={!!claim.outcome}
      claimType={!!claim.claimType}
      to={`/claims/${claim.id}`}
      {...props}
    >
      <div>
        <h5>
          {claim.claimType ? convertEnumToTitle(claim.claimType) : 'No type'}
        </h5>
        <span>
          {claim.outcome ? convertEnumToTitle(claim.outcome) : 'No outcome'}
        </span>
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
  claimId: string
}> = ({ member, claimId }) => {
  const history = useHistory()
  const { register } = useNavigation()
  const currentClaim = (member?.claims ?? []).find(
    (claim) => claim.id === claimId,
  )

  const claims = (member?.claims ?? [])
    .filter((claim) => claim.outcome !== 'DUPLICATE' && claim.id !== claimId)
    .sort((c1, c2) => (c1.registrationDate < c2.registrationDate ? 1 : -1))

  const openClaims = claims.filter(
    (claim) =>
      claim.state === ClaimState.Open || claim.state === ClaimState.Reopened,
  )

  const closedClaims = claims.filter(
    (claim) => claim.state === ClaimState.Closed || claim.id === claimId,
  )

  return (
    <>
      {currentClaim && (
        <div>
          <Label>This claim</Label>
          <div style={{ marginBottom: '0.25rem' }} />
          <ClaimItem
            {...register('ThisClaim', {
              resolve: 'ThisClaim',
              neighbors: {
                up: 'MemberClaims',
                down:
                  openClaims.length !== 0
                    ? openClaims[0].id
                    : closedClaims.length !== 0
                    ? closedClaims[0].id
                    : undefined,
              },
            })}
            key={currentClaim?.id}
            claim={currentClaim as Claim}
          />

          <Spacing top="small" />
        </div>
      )}

      {openClaims.length !== 0 && (
        <div>
          <Label>Open</Label>
          <div style={{ marginBottom: '0.25rem' }} />
          {openClaims.map((claim, index) => (
            <ClaimItem
              {...register(claim.id, {
                resolve: () => history.push(`/claims/${claim.id}`),
                neighbors: {
                  up: index !== 0 ? openClaims[index - 1].id : 'ThisClaim',
                  down:
                    index !== openClaims.length - 1
                      ? openClaims[index + 1].id
                      : undefined,
                },
              })}
              key={claim.id}
              claim={claim as Claim}
            />
          ))}
        </div>
      )}

      <Spacing top="small" />

      {closedClaims.length !== 0 && (
        <div
          {...register('ClosedClaims', {
            resolve: closedClaims[0].id,
            neighbors: {
              up: openClaims.length !== 0 ? 'OpenClaims' : 'ThisClaim',
            },
          })}
        >
          <Label>Closed</Label>
          <div style={{ marginBottom: '0.25rem' }} />
          {closedClaims.map((claim, index) => (
            <ClaimItem
              {...register(claim.id, {
                resolve: () => history.push(`/claims/${claim.id}`),
                neighbors: {
                  up: index !== 0 ? closedClaims[index - 1].id : undefined,
                  down:
                    index !== closedClaims.length - 1
                      ? closedClaims[index + 1].id
                      : undefined,
                },
              })}
              key={claim.id}
              claim={claim as Claim}
            />
          ))}
        </div>
      )}
    </>
  )
}
