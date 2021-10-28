import { Button } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { useGetMemberName } from 'graphql/use-get-member-name'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useWhitelistMemberMutation } from 'types/generated/graphql'

export const WhitelistMemberButton: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [whitelistMember] = useWhitelistMemberMutation()
  const [memberName] = useGetMemberName(memberId)
  const { confirm } = useConfirmDialog()

  return (
    <Button
      onClick={() => {
        confirm(
          `Are you sure you want to whitelist ${memberName?.firstName} ${memberName?.lastName}?`,
        ).then(() => {
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
        })
      }}
    >
      Whitelist Member
    </Button>
  )
}
