import { useWhitelistMemberMutation } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { Notification } from 'store/actions/notificationsActions'

export const WhitelistMemberButton: React.FC<{
  memberId: string
  showNotification: (data: Notification) => void
}> = ({ memberId, showNotification }) => {
  const [whitelistMember] = useWhitelistMemberMutation()

  return (
    <Button
      variation="primary"
      fullWidth
      onClick={() => {
        const confirm = window.confirm('Are you sure?')

        if (confirm) {
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
        }
      }}
    >
      Whitelist Member
    </Button>
  )
}
