import styled from '@emotion/styled'
import { Label } from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { CreateFilterModal } from 'features/claims/claim-templates/CreateFilterModal'
import { ClaimFilterTemplate } from 'features/claims/claim-templates/hooks/use-template-claims'
import { useListClaims } from 'features/claims/claims-list/graphql/use-list-claims'
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

const TemplateCardStyled = styled.div<{ active: boolean; navigated: boolean }>`
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 5px 13px;
  border-radius: 8px;
  background-color: ${({ navigated, theme }) =>
    !navigated ? theme.accent : theme.accentLight};
  cursor: pointer;
  opacity: ${({ active }) => (active ? 0.4 : 1)};

  &:hover {
    opacity: 0.8;
  }
`

const TemplateName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.accentContrast};
`

const AddTemplateCard = styled.div<{ navigated: boolean }>`
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 5px 13px;
  border-radius: 8px;
  border: 2px dashed
    ${({ theme, navigated }) => (!navigated ? theme.accent : theme.accentLight)};
  cursor: pointer;
  outline: none;

  & span {
    margin-left: 0.5rem;
    font-size: 14px;
    color: ${({ theme, navigated }) =>
      !navigated ? theme.accent : theme.accentLight};
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
  activeId?: string
  templates: ClaimFilterTemplate[]
  onSelect: (id: string) => void
  onCreate: (filter: ClaimFilterTemplate) => void
  navigationAvailable: boolean
}

export const ClaimsTemplates: React.FC<ClaimsTemplatesProps> = ({
  activeId,
  templates,
  onSelect,
  onCreate,
  navigationAvailable,
}) => {
  const [createFilter, setCreateFilter] = useState(false)

  if (!templates.length) {
    return null
  }

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: templates.length - 1,
    isActive: navigationAvailable,
    onPerformNavigation: (index) => {
      const currentIndex = index + 1
      if (currentIndex === templates.length) {
        setCreateFilter(true)
        return
      }

      onSelect(templates[currentIndex].id)
    },
    direction: 'horizontal',
    withNegative: true,
  })

  useEffect(() => {
    if (!navigationAvailable) {
      reset()
    }
  }, [navigationAvailable])

  return (
    <Wrapper>
      <Label>Templates</Label>
      <List>
        {templates.map((filter, index) => (
          <TemplateCard
            navigated={navigationAvailable && index === navigationStep + 1}
            key={filter.id}
            active={
              templates.length === 1 && !!activeId
                ? filter.id === activeId
                : !!activeId
                ? filter.id !== activeId
                : false
            }
            template={filter}
            onSelect={onSelect}
          />
        ))}
        <AddTemplateCard
          navigated={
            navigationAvailable && navigationStep + 1 === templates.length
          }
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
        </AddTemplateCard>
      </List>

      {createFilter && (
        <CreateFilterModal
          onClose={() => setCreateFilter(false)}
          onSave={onCreate}
        />
      )}
    </Wrapper>
  )
}

interface TemplateCardProps {
  template: ClaimFilterTemplate
  onSelect: (id: string) => void
  active: boolean
  navigated: boolean
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  active,
  navigated,
}) => {
  const [{ totalClaims }, listClaims] = useListClaims()

  useEffect(() => {
    listClaims({
      ...template,
    })
  }, [template])

  return (
    <TemplateCardStyled
      navigated={navigated}
      onClick={() => onSelect(template.id)}
      active={active}
      tabIndex={0}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter)) {
          onSelect(template.id)
        }
      }}
    >
      <TemplateName>
        {template.name} ({totalClaims || 0})
      </TemplateName>
    </TemplateCardStyled>
  )
}
