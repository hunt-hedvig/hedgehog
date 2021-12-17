import styled from '@emotion/styled'
import { Button, Input, Modal } from '@hedvig-ui'
import {
  isPressing,
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ClaimTemplateFilters } from 'features/claims/claim-templates/components/ClaimTemplateFilters'
import { ClaimFilterTemplate } from 'features/claims/claim-templates/hooks/use-template-claims'
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ClaimFilters = styled(ClaimTemplateFilters)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1em;
  row-gap: 1em;
`

const Body = styled.div`
  height: 100%;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

interface CreateFilterProps {
  onClose: () => void
  editableTemplate?: ClaimFilterTemplate
  onSave: (filters: ClaimFilterTemplate) => void
}

export const CreateFilterModal: React.FC<CreateFilterProps> = ({
  editableTemplate,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>(
    (editableTemplate && editableTemplate.name) || '',
  )
  const [filters, setFilters] = useState<ClaimsFiltersType>(
    editableTemplate || {
      filterClaimStates: null,
      filterCreatedBeforeOrOnDate: null,
      filterComplexities: null,
      filterNumberOfMemberGroups: null,
      filterSelectedMemberGroups: null,
      filterMarkets: null,
      filterTypesOfContract: null,
    },
  )

  const createFilterHandler = () => {
    onSave({
      ...filters,
      name,
      id: editableTemplate ? editableTemplate.id : uuidv4(),
    })
    onClose()
  }

  const { focus, setFocus } = useNavigation()

  useEffect(() => {
    setFocus(FocusItems.Main.items.Modal)

    return () => setFocus(null)
  }, [])

  const isEnterPressed = useKeyIsPressed(Keys.Enter)

  useEffect(() => {
    if (isEnterPressed && focus === FocusItems.Main.items.ModalSubmit) {
      createFilterHandler()
    }
  }, [isEnterPressed])

  return (
    <Modal
      onClose={onClose}
      width="700px"
      height="500px"
      title={name ? name : 'Create claim filter'}
    >
      <Body>
        <Input
          placeholder="Template name"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value)
          }}
          focus={focus === FocusItems.Main.items.Modal}
          onKeyDown={(e) => {
            if (isPressing(e, Keys.Down)) {
              setFocus(FocusItems.Main.items.ModalFilters)
            }
          }}
        />

        <ClaimFilters
          filters={filters}
          setFilters={setFilters}
          navigationAvailable={focus === FocusItems.Main.items.ModalFilters}
          setFocus={(value: string) => setFocus(value)}
        />

        <Button
          focus={focus === FocusItems.Main.items.ModalSubmit}
          onClick={createFilterHandler}
          onKeyDown={(e) => {
            if (isPressing(e, Keys.Up) || isPressing(e, Keys.Left)) {
              setFocus(FocusItems.Main.items.ModalFilters)
            }
          }}
        >
          {!editableTemplate ? 'Create' : 'Save'}
        </Button>
      </Body>
    </Modal>
  )
}
