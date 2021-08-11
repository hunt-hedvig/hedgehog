import { useWhitelistMemberMutation } from 'api/generated/graphql'
import { useGetMemberName } from 'graphql/use-get-member-name'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { toast } from 'react-hot-toast'

export const WhitelistMemberButton: React.FC<{
  memberId: string
}> = ({ memberId }) => {
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

        toast.promise(
          whitelistMember({
            variables: {
              memberId,
            },
            refetchQueries: ['GetPerson'],
          }),
          {
            loading: 'Whitelisting member',
            success: 'Member whitelisted',
            error: 'Could not whitelist member',
          },
        )
      }}
    >
      Whitelist Member
    </Button>
  )
}
