export const persistenceMapper = async (data) => {
  const parsed = JSON.parse(data)

  const mapped = {}

  // eslint-disable-next-line
  const persistEntities: Array<any> = []
  const rootQuery = parsed['ROOT_QUERY']

  mapped['ROOT_QUERY'] = Object.keys(rootQuery).reduce(
    (obj, key: string) => {
      if (key === '__typename') return obj

      if (/@persist$/.test(key)) {
        obj[key] = rootQuery[key]

        if (Array.isArray(rootQuery[key])) {
          const entities = rootQuery[key].map((item) => item.__ref)
          persistEntities.push(...entities)
        } else {
          const entity = rootQuery[key].__ref
          persistEntities.push(entity)
        }
      }

      return obj
    },
    { __typename: 'Query' },
  )

  persistEntities.reduce((obj, key) => {
    obj[key] = parsed[key]
    return obj
  }, mapped)

  return JSON.stringify(mapped)
}
