import styled from '@emotion/styled'
import { HotkeyStyled, Popover } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import copy from 'copy-to-clipboard'
import { PickedLocaleFlag } from 'features/config/constants'
import { formatSsn } from 'features/member/utils'
import React from 'react'
import { Clipboard } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Member } from 'types/generated/graphql'
import { useCommandLine } from '../commands/command-line-hook'

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

  const { registerActions, isHintingControl } = useCommandLine()

  registerActions([
    {
      label: 'Copy Email',
      keys: [Keys.Control, Keys.E],
      onResolve: () =>
        copy(member.email || '', {
          format: 'text/plain',
        }),
    },
    {
      label: 'Copy Phone number',
      keys: [Keys.Control, Keys.N],
      onResolve: () =>
        copy(member.phoneNumber || '', {
          format: 'text/plain',
        }),
    },
    {
      label: 'Copy Id',
      keys: [Keys.Control, Keys.I],
      onResolve: () =>
        copy(memberId, {
          format: 'text/plain',
        }),
    },
  ])

  return (
    <Wrapper>
      {member?.signedOn && member?.personalNumber && (
        <MemberDetail>{formatSsn(member.personalNumber)}</MemberDetail>
      )}
      {member?.email && (
        <MemberDetailLink href={`mailto:${member.email}`}>
          {member.email}
          {isHintingControl && <Hotkey dark>E</Hotkey>}
        </MemberDetailLink>
      )}
      {member?.phoneNumber && (
        <MemberDetailLink href={`tel:${member.phoneNumber}`}>
          {member.phoneNumber}
          {isHintingControl && <Hotkey dark>N</Hotkey>}
        </MemberDetailLink>
      )}
      <Popover contents="Click to copy Link">
        <MemberDetailLink
          href={`${window.location.protocol}//${window.location.host}${history.location.pathname}`}
          onClick={(e) => {
            e.preventDefault()
            copy(
              `${window.location.protocol}//${window.location.host}${history.location.pathname}`,
              {
                format: 'text/plain',
              },
            )
          }}
        >
          {memberId}
          {isHintingControl && <Hotkey dark>I</Hotkey>}
        </MemberDetailLink>
      </Popover>
      <Popover contents="Click to copy Id">
        <CopyIcon
          onClick={() => {
            copy(memberId, {
              format: 'text/plain',
            })
          }}
        />
      </Popover>

      {member?.pickedLocale && (
        <MemberDetail style={{ paddingLeft: '1rem' }}>
          Language: {PickedLocaleFlag[member.pickedLocale]}
        </MemberDetail>
      )}
    </Wrapper>
  )
}
