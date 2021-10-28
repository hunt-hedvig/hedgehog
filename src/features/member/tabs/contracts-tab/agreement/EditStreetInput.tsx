import { Input } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { Keys } from '@hedvig-ui/utils/key-press-hook'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSafelyEditAgreementMutation } from 'types/generated/graphql'

export const EditStreetInput: React.FC<{
  agreementId: string
  street: string
  closeEdit: () => void
}> = ({ agreementId, street, closeEdit }) => {
  const [newStreet, setNewStreet] = useState(street)
  const { confirm } = useConfirmDialog()

  useEffect(() => {
    setNewStreet(street)
  }, [agreementId])

  const [safelyEditAgreement] = useSafelyEditAgreementMutation()

  return (
    <Input
      value={newStreet}
      onChange={(e) => setNewStreet(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.keyCode === Keys.Escape.code) {
          closeEdit()
          return
        }
        if (e.keyCode !== Keys.Enter.code) {
          return
        }
        if (street.trim() === newStreet.trim()) {
          return
        }
        confirm(
          `Are you sure you want to change the street from "${street}" to "${newStreet}"?`,
        ).then(() => {
          toast.promise(
            safelyEditAgreement({
              variables: {
                agreementId,
                request: {
                  newStreet: newStreet.trim(),
                },
              },
            }),
            {
              loading: 'Changing street',
              success: () => {
                closeEdit()
                return 'Street changed'
              },
              error: 'Could not change street',
            },
          )
        })
      }}
    />
  )
}
