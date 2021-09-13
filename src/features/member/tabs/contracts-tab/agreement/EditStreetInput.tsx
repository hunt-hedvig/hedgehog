import { Input } from '@hedvig-ui'
import {
  safelyEditAgreementOptions,
  useSafelyEditAgreement,
} from 'graphql/use-safely-edit-agreement'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Contract } from 'types/generated/graphql'
import { Keys } from 'utils/hooks/key-press-hook'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

export const EditStreetInput: React.FC<{
  agreementId: string
  contract: Contract
  street: string
  closeEdit: () => void
}> = ({ agreementId, contract, street, closeEdit }) => {
  const [newStreet, setNewStreet] = useState(street)
  const { confirm } = useConfirmDialog()

  useEffect(() => {
    setNewStreet(street)
  }, [agreementId])

  const [safelyEditAgreement] = useSafelyEditAgreement(contract)

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
            safelyEditAgreement(
              safelyEditAgreementOptions(agreementId, newStreet),
            ),
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
