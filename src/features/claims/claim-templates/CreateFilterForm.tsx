import styled from '@emotion/styled'
import { Button, Input, Modal } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ClaimTemplateFilters } from 'features/claims/claim-templates/ClaimTemplateFilters'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import { ClaimsFiltersTypeWithName } from 'pages/DashboardPage'
import React, { useState } from 'react'

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
  editableFilter?: ClaimsFiltersTypeWithName
  onSave: (id: number, filters: ClaimsFiltersTypeWithName) => void
  id: number
}

export const CreateFilterForm: React.FC<CreateFilterProps> = ({
  editableFilter,
  onSave,
  id,
  onClose,
}) => {
  const [name, setName] = useState<string>(
    (editableFilter && editableFilter.name) || '',
  )
  const [filters, setFilters] = useState<ClaimsFiltersType>(
    editableFilter || {
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
    onSave(id, { ...filters, name })
    onClose()
  }

  useKeyIsPressed(Keys.Enter, createFilterHandler)

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
        />

        <ClaimFilters filters={filters} setFilters={setFilters} />

        <Button onClick={createFilterHandler}>
          {!editableFilter ? 'Create' : 'Save'}
        </Button>
      </Body>
    </Modal>
  )
}
