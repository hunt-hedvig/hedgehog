import styled from '@emotion/styled'
import { HotkeyStyled, Popover } from '@hedvig-ui'
import { Keys } from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import {
  Market,
  PickedLocale,
  PickedLocaleFlag,
} from 'portals/hope/features/config/constants'
import { formatSsn } from 'portals/hope/features/member/utils'
import React from 'react'
import { Clipboard } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { useHistory } from 'react-router'
import { Member } from 'types/generated/graphql'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.mutedText};
  padding-bottom: 4rem;
`

const MemberDetail = styled.span`
  position: relative;
  padding-right: 1rem;
`

const CustomerIOButton = styled.button`
  background-color: #5721cc;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;

  transition: background-color 200ms;
  :hover {
    background-color: #8f72ce;
  }

  outline: none;
  border: none;
  padding: 0.25rem 0.5rem;
  margin-right: 1rem;
`

const MemberDetailLink = MemberDetail.withComponent('a')

const CopyIcon = styled(Clipboard)`
  height: 15px;
  width: 15px;
  cursor: pointer;
`

const Hotkey = styled(HotkeyStyled)`
  font-size: 0.7rem;
  right: 50%;
  top: 25px;
`

interface MemberDetailsProps {
  memberId: string
  member: Member
}

export const MemberDetails: React.FC<MemberDetailsProps> = ({
  memberId,
  member,
}) => {
  const history = useHistory()

  const { registerActions, isHintingOption } = useCommandLine()

  registerActions([
    {
      label: 'Copy email',
      keys: [Keys.Option, Keys.E],
      onResolve: () => {
        copy(member.email || '', {
          format: 'text/plain',
        })
        toast.success('Email copied')
      },
    },
    {
      label: 'Copy phone number',
      keys: [Keys.Option, Keys.N],
      onResolve: () => {
        copy(member.phoneNumber || '', {
          format: 'text/plain',
        })
        toast.success('Phone number copied')
      },
    },
    {
      label: 'Copy ID',
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        copy(memberId, {
          format: 'text/plain',
        })
        toast.success('ID copied')
      },
    },
  ])

  return (
    <Wrapper>
      {member?.signedOn && member?.personalNumber && (
        <MemberDetail>{formatSsn(member.personalNumber)}</MemberDetail>
      )}

      {member?.contractMarketInfo?.market && (
        <CustomerIOButton
          onClick={() => {
            const env = window.location.host.includes('hope.hedvig.com')
              ? 'prod'
              : 'staging'

            const market = member?.contractMarketInfo?.market as Market

            const idMap: Record<'prod' | 'staging', Record<Market, string>> = {
              staging: {
                NORWAY: '90964',
                SWEDEN: '78110',
                DENMARK: '97571',
              },
              prod: {
                NORWAY: '92282',
                SWEDEN: '78930',
                DENMARK: '97570',
              },
            }

            window.open(
              `https://fly.customer.io/env/${idMap[env][market]}/people/${memberId}/sent`,
            )
          }}
        >
          customer.io
        </CustomerIOButton>
      )}
      {member?.email && (
        <MemberDetailLink href={`mailto:${member.email}`}>
          {member.email}
          {isHintingOption && <Hotkey dark>E</Hotkey>}
        </MemberDetailLink>
      )}
      {member?.phoneNumber && (
        <MemberDetailLink href={`tel:${member.phoneNumber}`}>
          {member.phoneNumber}
          {isHintingOption && <Hotkey dark>N</Hotkey>}
        </MemberDetailLink>
      )}
      <Popover contents="Click to copy member link">
        <MemberDetailLink
          href={`${window.location.protocol}//${window.location.host}/members/${member.memberId}`}
          onClick={(e) => {
            e.preventDefault()
            const tabMaybe = history.location.pathname.includes(member.memberId)
              ? history.location.pathname.split(member.memberId)[1]
              : ''

            copy(
              `${window.location.protocol}//${window.location.host}/members/${member.memberId}${tabMaybe}`,
              {
                format: 'text/plain',
              },
            )
            toast.success('Member link copied')
          }}
        >
          {memberId}
          {isHintingOption && <Hotkey dark>M</Hotkey>}
        </MemberDetailLink>
      </Popover>
      <Popover contents="Click to copy ID">
        <CopyIcon
          onClick={() => {
            copy(memberId, {
              format: 'text/plain',
            })
            toast.success('Member ID copied')
          }}
        />
      </Popover>

      {member?.pickedLocale && (
        <MemberDetail style={{ paddingLeft: '1rem' }}>
          Language: {PickedLocaleFlag[member.pickedLocale as PickedLocale]}
        </MemberDetail>
      )}
    </Wrapper>
  )
}
