import { Contract } from 'api/generated/graphql'
import {
  safelyEditAgreementOptions,
  useSafelyEditAgreement,
} from 'graphql/use-safely-edit-agreement'
import { Input } from 'hedvig-ui/input'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Keys } from 'utils/hooks/key-press-hook'

export const EditStreetInput: React.FC<{
  agreementId: string
  contract: Contract
  street: string
  closeEdit: () => void
}> = ({ agreementId, contract, street, closeEdit }) => {
  const [newStreet, setNewStreet] = useState(street)

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
        if (
          !window.confirm(
            `Are you sure you want to change the street from "${street}" to "${newStreet}"?`,
          )
        ) {
          return
        }

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
      }}
    />
  )
}
