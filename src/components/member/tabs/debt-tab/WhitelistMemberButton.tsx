import { useWhitelistMemberMutation } from 'api/generated/graphql'
import { useGetMemberName } from 'graphql/use-get-member-name'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { Notification } from 'store/actions/notificationsActions'

export const WhitelistMemberButton: React.FC<{
  memberId: string
  showNotification: (data: Notification) => void
}> = ({ memberId, showNotification }) => {
  const [whitelistMember] = useWhitelistMemberMutation()
  const [memberName] = useGetMemberName(memberId)

  return (
    <Button
      variation="primary"
      fullWidth
      onClick={() => {
        if (
          !window.confirm(
            `Are you sure you want to whitelist ${memberName?.firstName} ${memberName?.lastName}?`,
          )
        ) {
          return
        }

        whitelistMember({
          variables: {
            memberId,
          },
          refetchQueries: ['GetPerson'],
        })
          .then(() =>
            showNotification({
              message: 'Member whitelisted.',
              header: 'Success',
              type: 'olive',
            }),
          )
          .catch((whitelistError) =>
            showNotification({
              message: whitelistError.message,
              header: 'Error',
              type: 'red',
            }),
          )
      }}
    >
      Whitelist Member
    </Button>
  )
}
