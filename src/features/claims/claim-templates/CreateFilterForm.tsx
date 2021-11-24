import styled from '@emotion/styled'
import { Button, Input, Modal } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ClaimListTemplateFilters } from 'features/claims/claims-list/filters/ClaimListTemplateFilters'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import { ClaimsFiltersTypeWithName } from 'pages/DashboardPage'
import React, { useEffect, useState } from 'react'

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

interface CreateFilterProps {
  close: () => void
  editFilter?: ClaimsFiltersTypeWithName
  createFilter: (id: number, filters: ClaimsFiltersTypeWithName) => void
  id: number
}

const CreateFilterForm: React.FC<CreateFilterProps> = ({
  editFilter,
  createFilter,
  id,
  close,
}) => {
  const isEnterPressed = useKeyIsPressed(Keys.Enter)

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

  useEffect(() => {
    if (isEnterPressed) {
      createFilterHandler()
    }
  }, [isEnterPressed])

  return (
    <Modal
      onClose={close}
      width="700px"
      height="500px"
      title={name ? name : 'Set Claim Filters'}
    >
      <Body>
        <Input
          placeholder="Template name"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value)
          }}
        />

        <ClaimListTemplateFilters
          filters={filters}
          setFilters={setFilters}
          style={filtersStyle}
        />

        <Button onClick={createFilterHandler}>
          {!editFilter ? 'Create' : 'Save'}
        </Button>
      </Body>
    </Modal>
  )
}

export default CreateFilterForm
