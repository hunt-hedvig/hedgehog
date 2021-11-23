import styled from '@emotion/styled'
import { Label } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import CreateFilterForm from 'features/claims/claim-templates/CreateFilterForm'
import { useListClaims } from 'features/claims/claims-list/graphql/use-list-claims'
import {
  ClaimsFiltersTypeWithName,
  TemplateFiltersType,
} from 'pages/DashboardPage'
import React, { useEffect, useState } from 'react'
import { Plus } from 'react-bootstrap-icons'

const Wrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
`

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 0.5rem;
`

const TemplateCard = styled.div<{ nonActive: boolean }>`
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 5px 13px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.accent};
  cursor: pointer;
  opacity: ${({ nonActive }) => (nonActive ? 0.5 : 1)};

  &:hover,
  &:focus {
    opacity: 0.8;
  }
`

const TemplateName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.accentContrast};
`

const AddTemplate = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 5px 13px;
  border-radius: 8px;
  border: 2px dashed ${({ theme }) => theme.accent};
  cursor: pointer;
  outline: none;

  & span {
    margin-left: 0.5rem;
    font-size: 14px;
    color: ${({ theme }) => theme.accent};
  }

  &:hover,
  &:focus {
    border: 2px dashed ${({ theme }) => theme.accentLight};
    opacity: 0.8;

    & span {
      color: ${({ theme }) => theme.accentLight};
    }
  }
`

interface ClaimsTemplatesProps {
  activeId?: number
  templates: TemplateFiltersType
  selectHandler: (id: number) => void
  createHandler: (id: number, filter: ClaimsFiltersTypeWithName) => void
}

export const ClaimsTemplates: React.FC<ClaimsTemplatesProps> = ({
  activeId,
  templates,
  selectHandler,
  createHandler,
}) => {
  const [createFilter, setCreateFilter] = useState(false)

  if (!templates.filters.length) {
    return null
  }

  return (
    <Wrapper>
      <Label>Templates</Label>
      <List>
        {templates.filters.map((filter, index) => (
          <Template
            key={`${filter.name}-${index}`}
            nonActive={
              !!activeId || activeId === 0 ? index !== activeId : false
            }
            filter={filter}
            id={index}
            select={selectHandler}
          />
        ))}
        <AddTemplate
          onClick={() => setCreateFilter(true)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (isPressing(e, Keys.Enter)) {
              setCreateFilter(true)
            }
          }}
        >
          <Plus />
          <span>Add New</span>
        </AddTemplate>
      </List>

      {createFilter && (
        <CreateFilterForm
          close={() => setCreateFilter(false)}
          createFilter={createHandler}
          id={templates.filters.length}
        />
      )}
    </Wrapper>
  )
}

interface TemplateProps {
  filter: ClaimsFiltersTypeWithName
  select: (id: number) => void
  id: number
  nonActive: boolean
}

const Template: React.FC<TemplateProps> = ({
  filter,
  select,
  id,
  nonActive,
}) => {
  const [{ totalClaims }, listClaims] = useListClaims()

  useEffect(() => {
    listClaims({
      ...filter,
    })
  }, [filter])

  return (
    <TemplateCard
      onClick={() => select(id)}
      nonActive={nonActive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter)) {
          select(id)
        }
      }}
    >
      <TemplateName>
        {filter.name} ({totalClaims || 0})
      </TemplateName>
    </TemplateCard>
  )
}
