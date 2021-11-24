import styled from '@emotion/styled'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { useListClaims } from 'features/claims/claims-list/graphql/use-list-claims'
import {
  ClaimsFiltersTypeWithName,
  MetricName,
  MetricNumber,
  metricStyles,
} from 'pages/DashboardPage'
import React, { useEffect, useState } from 'react'
import { Files, Pencil, Trash } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { CreateFilterForm } from './CreateFilterForm'

const IconsWrapper = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;

  display: flex;
  align-items: center;
`

const Icon = styled.div`
  &:not(:last-child) {
    margin-right: 0.5em;
  }

  &:hover {
    opacity: 0.8;
  }
`

const Metric = styled.div`
  position: relative;
  cursor: pointer;
  max-width: 200px;
  ${({ theme }) => metricStyles(theme)};
`

interface FilteredMetricProps {
  id: number
  filter: ClaimsFiltersTypeWithName
  onRemove: (id: number) => void
  onCreate: (id: number, filter: ClaimsFiltersTypeWithName) => void
  onEdit: (id: number, filter: ClaimsFiltersTypeWithName) => void
}

const FilteredMetric: React.FC<FilteredMetricProps> = ({
  id,
  filter,
  onRemove,
  onCreate,
  onEdit,
}) => {
  const history = useHistory()
  const [edit, setEdit] = useState(false)
  const [hover, setHover] = useState(false)

  const [{ totalClaims }, listClaims] = useListClaims()
  const { confirm } = useConfirmDialog()

  const clickHandler = (e) => {
    if (e.currentTarget !== e.target) {
      return
    }

    history.push(`/claims/list/1?filter=${id}`)
  }

  useEffect(() => {
    listClaims({
      ...filter,
    })
  }, [filter])

  const deleteHandler = () => {
    confirm(`Are you sure you want to delete ${filter.name}?`).then(() => {
      onRemove(id)
    })
  }

  return (
    <Metric
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={clickHandler}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter)) {
          clickHandler(e)
        }
      }}
    >
      <MetricNumber onClick={clickHandler}>{totalClaims || 0}</MetricNumber>
      <MetricName onClick={clickHandler} title={filter.name}>
        {filter.name || `Claims Template ${id}`}
      </MetricName>
      {hover && (
        <IconsWrapper>
          <Icon
            title="Edit"
            onClick={() => {
              setEdit(true)
            }}
          >
            <Pencil />
          </Icon>
          <Icon
            title="Duplicate"
            onClick={() => {
              onCreate(id + 1, { ...filter, name: `${filter.name} copy` })
            }}
          >
            <Files />
          </Icon>
          <Icon title="Delete" onClick={deleteHandler}>
            <Trash />
          </Icon>
        </IconsWrapper>
      )}
      {edit && (
        <CreateFilterForm
          onClose={() => setEdit(false)}
          editableFilter={filter}
          id={id}
          onSave={onEdit}
        />
      )}
    </Metric>
  )
}

export default FilteredMetric
