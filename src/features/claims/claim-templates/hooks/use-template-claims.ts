import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

export interface ClaimFilterTemplate extends ClaimsFiltersType {
  id: string
  name: string
}

interface UseTemplateClaimsResult {
  templateActive: boolean
  selectedTemplate?: string
  localFilter: ClaimsFiltersType
  templateFilters: ClaimFilterTemplate[]
  selectTemplate: (id: string) => void
  createTemplate: (filter: ClaimFilterTemplate) => void
  editTemplate: (filter: ClaimsFiltersType, id?: string) => void
  editTemplateWithName: (filter: ClaimFilterTemplate) => void
  removeTemplate: (id: string) => void
}

export const useTemplateClaims = (
  selectedId?: string | null,
): UseTemplateClaimsResult => {
  const [templateActive, setTemplateActive] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>()
  const [localFilter, setLocalFilter] = useState<ClaimsFiltersType>({
    filterClaimStates: null,
    filterCreatedBeforeOrOnDate: null,
    filterComplexities: null,
    filterNumberOfMemberGroups: null,
    filterSelectedMemberGroups: null,
    filterMarkets: null,
    filterTypesOfContract: null,
  })

  const [templateFilters, setTemplateFilters] = useInsecurePersistentState<
    ClaimFilterTemplate[]
  >('claims:templates', [])

  const history = useHistory()

  useEffect(() => {
    if (!selectedId) {
      setTemplateActive(false)
      return
    }

    const filter = {
      ...templateFilters.filter((template) => template.id === selectedId)[0],
    }

    if (filter) {
      setLocalFilter(filter)
      setTemplateActive(true)
      setSelectedTemplate(selectedId)
    }
  }, [selectedId])

  const selectTemplate = (id: string) => {
    if (id === selectedTemplate) {
      setSelectedTemplate(undefined)
      history.push(`/claims/list/1`)
      return
    }

    history.push(`/claims/list/1?filter=${id}`)
  }

  const createTemplate = (filter: ClaimFilterTemplate) => {
    setTemplateFilters((prev) => [
      ...prev,
      {
        ...filter,
        name: filter.name ? filter.name : `Claims Template ${filter.id + 1}`,
      },
    ])
  }

  const editTemplate = (newFilter: ClaimsFiltersType, id?: string) => {
    setLocalFilter(newFilter)
    setTemplateFilters((prev) =>
      prev.map((filter) =>
        filter.id !== id ? filter : { ...newFilter, name: filter.name, id },
      ),
    )
  }

  const editTemplateWithName = (newFilter: ClaimFilterTemplate) => {
    setTemplateFilters((prev) =>
      prev.map((filter) => (filter.id !== newFilter.id ? filter : newFilter)),
    )
  }

  const removeTemplate = (id: string) => {
    const newFilters = templateFilters.filter((filter) => filter.id !== id)
    setTemplateFilters(newFilters)
  }

  return {
    templateActive,
    selectedTemplate,
    localFilter,
    templateFilters,
    selectTemplate,
    createTemplate,
    editTemplate,
    editTemplateWithName,
    removeTemplate,
  }
}
