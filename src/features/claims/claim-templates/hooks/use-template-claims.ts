import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import { ClaimsFiltersTypeWithName, TemplateFilters } from 'pages/DashboardPage'
import { useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

const useQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export const useTemplateClaims = () => {
  const filterQuery = useQuery().get('filter')

  const [templateActive, setTemplateActive] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number>()
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
    TemplateFilters
  >('claims:template-filters', {
    filters: [],
  })

  const history = useHistory()

  useEffect(() => {
    if (!filterQuery) {
      setTemplateActive(false)
      return
    }

    const filter = { ...templateFilters.filters[filterQuery] }

    if (filter) {
      delete filter.name
      setLocalFilter(filter)
      setTemplateActive(true)
      setSelectedTemplate(+filterQuery)
    }
  }, [filterQuery])

  const selectTemplate = (id: number) => {
    if (id === selectedTemplate) {
      setSelectedTemplate(undefined)
      history.push(`/claims/list/1`)
      return
    }

    history.push(`/claims/list/1?filter=${id}`)
  }

  const createTemplate = (id: number, filter: ClaimsFiltersTypeWithName) => {
    setTemplateFilters((prev) => ({
      filters: [
        ...prev.filters,
        {
          ...filter,
          name: filter.name ? filter.name : `Claims Template ${id + 1}`,
        },
      ],
    }))
  }

  const editTemplate = (newFilter: ClaimsFiltersType, id?: number) => {
    setLocalFilter(newFilter)
    setTemplateFilters((prev) => ({
      filters: prev.filters.map((filter, index) =>
        index !== id ? filter : { ...newFilter, name: filter.name },
      ),
    }))
  }

  const editTemplateWithName = (
    id: number,
    newFilter: ClaimsFiltersTypeWithName,
  ) => {
    setTemplateFilters((prev) => ({
      filters: prev.filters.map((filter, index) =>
        index !== id ? filter : newFilter,
      ),
    }))
  }

  const removeTemplate = (id: number) => {
    const newFilters = templateFilters.filters.filter(
      (_, index) => index !== id,
    )
    setTemplateFilters({
      filters: newFilters,
    })
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
