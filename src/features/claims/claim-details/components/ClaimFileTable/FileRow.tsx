import styled from '@emotion/styled'
import { Dropdown, DropdownOption } from '@hedvig-ui'
import React from 'react'
import { Table } from 'semantic-ui-react'
import { useSetClaimFileCategoryMutation } from 'types/generated/graphql'
import { dateTimeFormatter } from 'utils/helpers'
import { sleep } from 'utils/sleep'
import { DeleteButton } from '../DeleteClaimFileButton'

const Image = styled.img`
  width: 450px;
`

const fileUploadOptions = [
  {
    key: 'Reciept',
    text: 'Reciept',
    value: 'Reciept',
  },
  {
    key: 'Proof of ownership',
    text: 'Proof of ownership',
    value: 'Proof of ownership',
  },
  {
    key: 'Police report',
    text: 'Police report',
    value: 'Police report',
  },
  {
    key: 'Invoice',
    text: 'Invoice',
    value: 'Invoice',
  },
  {
    key: 'Proof of damage',
    text: 'Proof of damage',
    value: 'Proof of damage',
  },
  {
    key: 'Other',
    text: 'Other',
    value: 'Other',
  },
]

export const FileRow = ({ claimId, claimFile, refetch }) => {
  const [selectedCategory, setSelectedCategory] = React.useState(
    claimFile.category,
  )

  const [setClaimFileCategory] = useSetClaimFileCategoryMutation()

  return (
    <Table.Row key={claimFile.claimFileId}>
      <Table.Cell>
        {claimFile.contentType === 'application/pdf' ? (
          <embed src={claimFile.fileUploadUrl} width="800px" height="300px" />
        ) : (
          <Image src={claimFile.fileUploadUrl} />
        )}
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          style={{ width: 200 }}
          placeholder={
            claimFile.category !== null ? claimFile.category : 'File Type'
          }
        >
          {fileUploadOptions.map((file) => (
            <DropdownOption
              key={file.key}
              selected={file.value === selectedCategory}
              onClick={() => {
                setSelectedCategory(file.value)
                setClaimFileCategory({
                  variables: {
                    claimId,
                    claimFileId: claimFile.claimFileId!,
                    category: file.value,
                  },
                })
              }}
            >
              {file.text}
            </DropdownOption>
          ))}
        </Dropdown>
      </Table.Cell>
      <Table.Cell>
        {dateTimeFormatter(claimFile.uploadedAt, 'yyyy-MM-dd HH:mm:ss')}
      </Table.Cell>
      <Table.Cell>
        <DeleteButton
          claimId={claimId}
          claimFileId={claimFile.claimFileId!}
          onDeleted={async () => {
            await sleep(500)
            await refetch()
          }}
        />
      </Table.Cell>
    </Table.Row>
  )
}
