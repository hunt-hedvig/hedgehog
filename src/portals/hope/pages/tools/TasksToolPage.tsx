import React from 'react'
import { Page } from 'portals/hope/pages/routes'
import gql from 'graphql-tag'
import { Button, useConfirmDialog } from '@hedvig-ui'
import { usePurgeTasksMutation } from 'types/generated/graphql'
import { toast } from 'react-hot-toast'

gql`
  mutation PurgeTasks {
    purgeTasks
  }
`

export const TasksToolPage: Page = () => {
  const [purgeTasks, { loading }] = usePurgeTasksMutation()
  const { confirm } = useConfirmDialog()

  const handleRecreateTasks = () => {
    confirm(
      'Are you sure you want to purge and recreate all current tasks?',
    ).then(() => {
      toast.promise(purgeTasks(), {
        success: 'Tasks purged, will be recreated in a moment',
        loading: 'Purging tasks',
        error: 'Could not purge tasks',
      })
    })
  }

  return (
    <>
      <div>
        <Button onClick={handleRecreateTasks} disabled={loading}>
          Recreate tasks
        </Button>
      </div>
    </>
  )
}
