import { Button } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { useGetMemberName } from 'portals/hope/features/member/tabs/debt-tab/hooks/use-get-member-name'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useWhitelistMember } from 'portals/hope/common/hooks/use-whitelist-member'

export const WhitelistMemberButton: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { whitelist } = useWhitelistMember()
  const [memberName] = useGetMemberName(memberId)
  const { confirm } = useConfirmDialog()

  return (
    <Button
      onClick={() => {
        confirm(
          `Are you sure you want to whitelist ${memberName?.firstName} ${memberName?.lastName}?`,
        ).then(() =>
          toast.promise(whitelist(memberId), {
            loading: 'Whitelisting member',
            success: 'Member whitelisted',
            error: 'Could not whitelist member',
          }),
        )
      }}
    >
      Whitelist Member
    </Button>
  )
}
