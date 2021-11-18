import styled from '@emotion/styled'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useListClaims } from 'features/claims/claims-list/graphql/use-list-claims'
import {
  ClaimsFiltersTypeWithName,
  MetricName,
  MetricNumber,
  metricStyles,
} from 'pages/DashboardPage'
import React, { useEffect, useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import CreateFilterForm from './CreateFilterForm'

const IconWrapper = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;

  &:hover {
    opacity: 0.8;
  }
`

const Metric = styled.div`
  position: relative;
  cursor: pointer;
  ${({ theme }) => metricStyles(theme)};
`

interface FilteredMetricProps {
  id: number
  filter: ClaimsFiltersTypeWithName
  removeFilter: (id: number) => void
  editFilterHandler: (id: number, filter: ClaimsFiltersTypeWithName) => void
}

const FilteredMetric: React.FC<FilteredMetricProps> = ({
  id,
  filter,
  editFilterHandler,
  removeFilter,
}) => {
  const history = useHistory()
  const [edit, setEdit] = useState(false)
  const [hover, setHover] = useState(false)

  const [{ totalClaims }, listClaims] = useListClaims()

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

  return (
    <Metric
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={clickHandler}
      onKeyDown={(e) => {
        if (e.keyCode === Keys.Enter.code) {
          clickHandler(e)
        }
      }}
    >
      <MetricNumber onClick={clickHandler}>{totalClaims || 0}</MetricNumber>
      <MetricName onClick={clickHandler}>
        {filter.name || 'Filtered Claims'}
      </MetricName>
      {hover && (
        <IconWrapper
          onClick={() => {
            setEdit(true)
          }}
        >
          <PencilSquare />
        </IconWrapper>
      )}
      {edit && (
        <CreateFilterForm
          close={() => setEdit(false)}
          editFilter={filter}
          id={id}
          removeFilter={removeFilter}
          createFilter={editFilterHandler}
        />
      )}
    </Metric>
  )
}

export default FilteredMetric
