import { Contract } from 'api/generated/graphql'
import {
  safelyEditAgreementOptions,
  useSafelyEditAgreement,
} from 'graphql/use-safely-edit-agreement'
import { Input } from 'hedvig-ui/input'
import React, { useEffect, useState } from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { Keys } from 'utils/hooks/key-press-hook'
import { withShowNotification } from 'utils/notifications'

const EditStreetInputComponent: React.FC<{
  agreementId: string
  contract: Contract
  street: string
  closeEdit: () => void
} & WithShowNotification> = ({
  agreementId,
  contract,
  street,
  closeEdit,
  showNotification,
}) => {
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
        if (e.keyCode !== Keys.Return.code) {
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
        safelyEditAgreement(safelyEditAgreementOptions(agreementId, newStreet))
          .then(() => {
            showNotification({
              message: `Street changed to "${newStreet}"`,
              header: 'Success!',
              type: 'olive',
            })
            closeEdit()
          })
          .catch((error) => {
            showNotification({
              message: error.message,
              header: 'Error',
              type: 'red',
            })
            throw error
          })
      }}
    />
  )
}

export const EditStreetInput = withShowNotification(EditStreetInputComponent)
