import styled from '@emotion/styled'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { CreateFilterModal } from 'portals/hope/features/claims/claim-templates/CreateFilterModal'
import { ClaimFilterTemplate } from 'portals/hope/features/claims/claim-templates/hooks/use-template-claims'
import { useListClaims } from 'portals/hope/features/claims/claims-list/graphql/use-list-claims'
import {
  MetricName,
  MetricNumber,
  metricStyles,
} from 'portals/hope/features/dashboard/MetricList'
import React, { useEffect, useState } from 'react'
import { Files, Pencil, Trash } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

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

const Metric = styled.div<{ focus: boolean }>`
  transition: none;
  position: relative;
  cursor: pointer;
  max-width: 200px;
  ${({ theme, focus }) => metricStyles(theme, focus)};
`

interface FilteredMetricProps {
  template: ClaimFilterTemplate
  onRemove: (id: string) => void
  onCreate: (filter: ClaimFilterTemplate) => void
  onEdit: (filter: ClaimFilterTemplate) => void
  focus: boolean
}

export const FilteredMetric: React.FC<FilteredMetricProps> = ({
  template,
  onRemove,
  onCreate,
  onEdit,
  focus,
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

    history.push(`/claims/list/1?template=${template.id}`)
  }

  useEffect(() => {
    listClaims({
      ...template,
    })
  }, [template])

  const deleteHandler = () => {
    confirm(`Are you sure you want to delete ${template.name}?`).then(() => {
      onRemove(template.id)
    })
  }

  return (
    <Metric
      focus={focus}
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
      <MetricName onClick={clickHandler} title={template.name}>
        {template.name}
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
              onCreate({
                ...template,
                name: `${template.name} copy`,
                id: uuidv4(),
              })
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
        <CreateFilterModal
          onClose={() => setEdit(false)}
          editableTemplate={template}
          onSave={onEdit}
        />
      )}
    </Metric>
  )
}
