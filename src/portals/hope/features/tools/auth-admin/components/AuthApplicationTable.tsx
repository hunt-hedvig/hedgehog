import React, { useState } from 'react'
import {
  Button,
  Card,
  LoadingMessage,
  MainHeadline,
  Modal,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import {
  AuthApplication,
  AuthCredentialGenerationOutput,
  useGenerateCredentialsMutation,
  useListAuthApplicationsQuery,
} from 'types/generated/graphql'
import { formatRelative } from 'date-fns'
import { Row } from 'portals/hope/features/tools/employees/components/CreateEmployee'
import styled from '@emotion/styled'

export const AuthApplicationTable: React.FC = () => {
  const { data, loading, refetch } = useListAuthApplicationsQuery()

  const [selectedApplication, setSelectedApplication] =
    useState<AuthApplication | null>(null)

  if (loading) {
    return <LoadingMessage paddingTop="25vh" />
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableHeaderColumn>Id</TableHeaderColumn>
          <TableHeaderColumn>Name</TableHeaderColumn>
          <TableHeaderColumn>Created at</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {data?.auth_applications.map((application) => {
            return (
              <TableRow
                key={application.id}
                onClick={() => setSelectedApplication(application)}
              >
                <TableColumn>{application.id}</TableColumn>
                <TableColumn>{application.name}</TableColumn>
                <TableColumn>
                  {formatRelative(
                    Date.parse(application.createdAt),
                    new Date(),
                  )}
                </TableColumn>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <ApplicationDetails
        onClose={async () => {
          setSelectedApplication(null)
          await refetch()
        }}
        application={selectedApplication}
      />
    </>
  )
}

const ApplicationModal = styled(Modal)`
  padding: 1rem;
`

const ApplicationDetails: React.FC<{
  onClose: () => void
  application: AuthApplication | null
}> = ({ onClose, application }) => {
  const [generateCredentials, { loading }] = useGenerateCredentialsMutation()

  const [generatedCredentials, setGeneratedCredentials] =
    useState<AuthCredentialGenerationOutput | null>(null)

  return (
    <ApplicationModal
      onClose={() => {
        onClose()
        setGeneratedCredentials(null)
      }}
      visible={!!application}
    >
      {!!application && (
        <div>
          <Row>
            <MainHeadline>{`${application.name}'s list of client credentials`}</MainHeadline>
          </Row>
          <Table style={{ margin: '1rem 0 1rem 0' }}>
            <TableHeader>
              <TableHeaderColumn>Client id</TableHeaderColumn>
              <TableHeaderColumn>Created at</TableHeaderColumn>
            </TableHeader>
            <TableBody>
              {application.credentials.map((credential) => {
                return (
                  <TableRow key={credential.clientId}>
                    <TableColumn>{credential.clientId}</TableColumn>
                    <TableColumn>
                      {formatRelative(
                        Date.parse(credential.createdAt),
                        new Date(),
                      )}
                    </TableColumn>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {generatedCredentials ? (
            <Card>
              <span>
                <b>
                  The generated client secret will only be shown once, copy it
                  before exiting this window!
                </b>
              </span>
              <span>
                <b>Generated client id: </b>
                {generatedCredentials.clientId}
              </span>
              <span>
                <b>Generated client secret: </b>
                {generatedCredentials.clientSecret}
              </span>
            </Card>
          ) : (
            <Button
              disabled={loading}
              onClick={async () => {
                const result = await generateCredentials({
                  variables: { applicationId: application.id },
                })
                setGeneratedCredentials(
                  result.data?.auth_generateCredentials ?? null,
                )
              }}
            >
              Generate credentials
            </Button>
          )}
        </div>
      )}
    </ApplicationModal>
  )
}
