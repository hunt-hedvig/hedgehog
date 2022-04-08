import styled from '@emotion/styled'
import { CardContent, Loadable, Spacing, Tabs } from '@hedvig-ui'
import { Keys } from '@hedvig-ui'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import { MemberClaimsView } from 'portals/hope/features/claims/claim-details/MemberInformation/components/MemberClaimsView'
import { MemberGeneralView } from 'portals/hope/features/claims/claim-details/MemberInformation/components/MemberGeneralView'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { getMemberFlag } from 'portals/hope/features/member/utils'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useGetMemberInfoQuery } from 'types/generated/graphql'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(0.5).alpha(0.25).hex()};
  border-radius: 0.5rem;
  padding: 1rem;
  height: 10rem;

  div {
    h3 {
      font-size: 1.3rem;
      margin: 0;
      padding: 0 0 0.25rem;
    }
    a {
      font-size: 1rem;

      :hover {
        color: ${({ theme }) => chroma(theme.accent).brighten(1).hex()};
      }
  }
`

export const MemberInformation: React.FC<{
  claimId: string
  memberId: string
  slim?: boolean
}> = ({ claimId, memberId, slim = false }) => {
  const [tab, setTab] = useState<'general' | 'claims'>('general')
  const { data, loading } = useGetMemberInfoQuery({ variables: { memberId } })
  const { registerActions } = useCommandLine()
  const history = useHistory()

  const member = data?.member

  registerActions([
    {
      label: `Go to member`,
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        if (slim) return
        history.push(`/members/${memberId}`)
      },
    },
    {
      label: 'Copy member ID',
      keys: [Keys.Option, Keys.I],
      onResolve: () => {
        copy(memberId)
        toast.success('Member ID copied to clipboard')
      },
    },
    {
      label: 'Copy member link',
      keys: [Keys.Option, Keys.L],
      onResolve: () => {
        copy(`${window.location.origin}/members/${memberId}`)
        toast.success('Member link copied to clipboard')
      },
    },
  ])

  const totalClaimsWithoutDuplicates =
    member?.claims.reduce(
      (count, claim) => (claim.outcome !== 'DUPLICATE' ? count + 1 : count),
      0,
    ) ?? []

  const flag = member
    ? getMemberFlag(
        member.contractMarketInfo,
        member.pickedLocale as PickedLocale,
      )
    : ''

  const { register } = useNavigation()

  return (
    <CardContent>
      <Loadable loading={loading}>
        <MemberCard>
          <div>
            <h3>
              {(member?.firstName ?? '') + ' ' + (member?.lastName ?? '')}
            </h3>
            {!slim && (
              <Link
                to={`/members/${memberId}`}
                {...register('Claim Details - MemberId')}
              >
                {memberId}
              </Link>
            )}
          </div>
          <div>{flag}</div>
        </MemberCard>
        <Spacing top="small" />
        {!slim && (
          <Tabs
            list={[
              {
                active: tab === 'general',
                title: 'General',
                action: () => {
                  PushUserAction('claim', 'view', 'member_overview_tab', null)
                  setTab('general')
                },
              },
              {
                active: tab === 'claims',
                title: `Claims (${totalClaimsWithoutDuplicates})`,
                action: () => {
                  PushUserAction('claim', 'view', 'member_claims_tab', null)
                  setTab('claims')
                },
              },
            ]}
          />
        )}
        {tab === 'general' && !slim && (
          <>
            <Spacing top="small" />
            <MemberGeneralView memberId={memberId} claimId={claimId} />
          </>
        )}
        {tab === 'claims' && !slim && (
          <MemberClaimsView member={member} claimId={claimId} />
        )}
        <MemberGeneralView memberId={memberId} claimId={claimId} />
      </Loadable>
    </CardContent>
  )
}
