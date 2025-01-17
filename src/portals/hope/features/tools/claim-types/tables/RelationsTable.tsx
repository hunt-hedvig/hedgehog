import styled from '@emotion/styled'
import {
  Button,
  Capitalized,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  GetClaimTypeRelationsDocument,
  GetClaimTypeRelationsQuery,
  useDeleteClaimTypeRelationMutation,
  useGetClaimTypeRelationsQuery,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

const NonClickableColumn = styled(TableColumn)`
  cursor: default;
`

export const RelationsTable: React.FC<{ filter: string }> = ({ filter }) => {
  const [deleteRelation, { loading }] = useDeleteClaimTypeRelationMutation()
  const { data } = useGetClaimTypeRelationsQuery()
  const claimTypeRelations = data?.claimTypeRelations

  if (!claimTypeRelations) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Property</TableHeaderColumn>
        <TableHeaderColumn>Option</TableHeaderColumn>
        <TableHeaderColumn />
      </TableHeader>

      <TableBody>
        {claimTypeRelations
          .filter((relation) => {
            if (!filter) {
              return true
            }

            if (
              relation.claimType.toLowerCase().includes(filter.toLowerCase())
            ) {
              return true
            }

            if (
              relation.property.name
                .toLowerCase()
                .includes(filter.toLowerCase())
            ) {
              return true
            }

            if (
              relation.propertyOption.name
                .toLowerCase()
                .includes(filter.toLowerCase())
            ) {
              return true
            }

            return false
          })
          .map((relation) => (
            <TableRow key={relation.id}>
              <NonClickableColumn>
                {convertEnumToTitle(relation.claimType)}
              </NonClickableColumn>
              <NonClickableColumn>{relation.property.name}</NonClickableColumn>
              <NonClickableColumn>
                <Capitalized>{relation.propertyOption.name}</Capitalized>
              </NonClickableColumn>
              <NonClickableColumn style={{ textAlign: 'right' }}>
                <Button
                  status="danger"
                  disabled={loading}
                  onClick={() =>
                    toast.promise(
                      deleteRelation({
                        variables: { id: relation.id },
                        update: (
                          cache: ApolloCache<NormalizedCacheObject>,
                          { data: response },
                        ) => {
                          if (!response) {
                            return
                          }
                          const cachedData = cache.readQuery({
                            query: GetClaimTypeRelationsDocument,
                          })

                          const cachedRelations = (
                            cachedData as GetClaimTypeRelationsQuery
                          ).claimTypeRelations

                          cache.writeQuery({
                            query: GetClaimTypeRelationsDocument,
                            data: {
                              claimTypeRelations: cachedRelations.filter(
                                (claimTypeRelation) =>
                                  claimTypeRelation.id !== relation.id,
                              ),
                            },
                          })
                        },
                      }),
                      {
                        loading: 'Deleting relation',
                        success: 'Relation deleted',
                        error: 'Could not delete relation',
                      },
                    )
                  }
                >
                  Delete
                </Button>
              </NonClickableColumn>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
