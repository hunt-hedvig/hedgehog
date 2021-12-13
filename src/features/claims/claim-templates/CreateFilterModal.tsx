import styled from '@emotion/styled'
import { Button, Input, Modal } from '@hedvig-ui'
import { ClaimTemplateFilters } from 'features/claims/claim-templates/components/ClaimTemplateFilters'
import { ClaimFilterTemplate } from 'features/claims/claim-templates/hooks/use-template-claims'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React, { useState } from 'react'
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

  return (
    <Modal
      onClose={onClose}
      width="700px"
      height="530px"
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
          {!editableTemplate ? 'Create' : 'Save'}
        </Button>
      </Body>
    </Modal>
  )
}
