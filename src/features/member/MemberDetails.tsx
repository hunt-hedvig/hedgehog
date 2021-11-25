import styled from '@emotion/styled'
import { HotkeyStyled, Popover } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import copy from 'copy-to-clipboard'
import { PickedLocaleFlag } from 'features/config/constants'
import { formatSsn } from 'features/member/utils'
import React from 'react'
import { Clipboard } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { useHistory } from 'react-router'
import { Member } from 'types/generated/graphql'
import { useCommandLine } from '../commands/use-command-line'

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
          href={`${window.location.protocol}//${window.location.host}${history.location.pathname}`}
          onClick={(e) => {
            e.preventDefault()
            copy(
              `${window.location.protocol}//${window.location.host}${history.location.pathname}`,
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
          Language: {PickedLocaleFlag[member.pickedLocale]}
        </MemberDetail>
      )}
    </Wrapper>
  )
}
