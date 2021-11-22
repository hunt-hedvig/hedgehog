import styled from '@emotion/styled'
import { Button, Input, Modal } from '@hedvig-ui'
import { ClaimListFilters } from 'features/claims/claims-list/ClaimListFilters'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import { ClaimsFiltersTypeWithName } from 'pages/DashboardPage'
import React, { useState } from 'react'

const filtersStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  columnGap: '1em',
  rowGap: '1em',
}

const Body = styled.div`
  height: 100%;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ButtonsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1em;
`

interface CreateFilterProps {
  close: () => void
  editFilter?: ClaimsFiltersTypeWithName
  removeFilter?: (id: number) => void
  createFilter: (id: number, filters: ClaimsFiltersTypeWithName) => void
  id: number
}

const CreateFilterForm: React.FC<CreateFilterProps> = ({
  editFilter,
  createFilter,
  removeFilter,
  id,
  close,
}) => {
  const [name, setName] = useState<string>(
    (editFilter && editFilter.name) || '',
  )
  const [filters, setFilters] = useState<ClaimsFiltersType>(
    editFilter || {
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
    createFilter(id, { ...filters, name })
    close()
  }

  const removeFilterHandler = () => {
    if (removeFilter) {
      removeFilter(id)
    }
    close()
  }

  return (
    <Modal
      onClose={close}
      width="700px"
      height="500px"
      title={name ? name : 'Set Claims filters'}
    >
      <Body>
        <Input
          placeholder="Template name"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value)
          }}
        />
        <ClaimListFilters
          withDate={false}
          templated
          filters={filters}
          setFilters={setFilters}
          style={filtersStyle}
        />
        <ButtonsWrapper>
          <Button onClick={createFilterHandler}>
            {!editFilter ? 'Create' : 'Edit'}
          </Button>
          {editFilter ? (
            <Button status="danger" onClick={removeFilterHandler}>
              Remove
            </Button>
          ) : null}
        </ButtonsWrapper>
      </Body>
    </Modal>
  )
}

export default CreateFilterForm
