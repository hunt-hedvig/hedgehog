import { useMyRoleQuery } from 'types/generated/graphql'
import gql from 'graphql-tag'

/**
 * This abstraction is done to simplify upcoming permission & restriction setups.
 * For now, it will just do naive restriction based on user role.
 */

gql`
  query MyRole {
    me {
      role
    }
  }
`

const resources = ['questions'] as const
export type RestrictedResource = typeof resources[number]

const restrictions: Record<RestrictedResource, string[]> = {
  questions: ['IEX', 'IEX_EXTENDED', 'ROOT'],
}

export const useHasPermission = (
  resource: RestrictedResource,
): boolean | null => {
  const { data } = useMyRoleQuery({ fetchPolicy: 'cache-first' })
  const role = data?.me?.role

  if (!role) return null

  return restrictions[resource].includes(role)
}
