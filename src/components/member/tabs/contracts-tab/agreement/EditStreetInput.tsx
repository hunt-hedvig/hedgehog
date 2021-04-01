import { Contract } from 'api/generated/graphql'
import {
  safelyEditAgreementOptions,
  useSafelyEditAgreement,
} from 'graphql/use-safely-edit-agreement'
import { Input } from 'hedvig-ui/input'
import React, { useState } from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { KeyCode } from 'utils/hooks/key-press-hook'
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
  const [safelyEditAgreement] = useSafelyEditAgreement(contract)
  return (
    <Input
      value={newStreet}
      onChange={(e) => setNewStreet(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.keyCode === KeyCode.Escape) {
          closeEdit()
          return
        }
        if (e.keyCode !== KeyCode.Return) {
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
