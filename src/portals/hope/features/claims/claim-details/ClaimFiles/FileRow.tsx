import styled from '@emotion/styled'
import { Dropdown, DropdownOption, TableColumn, TableRow } from '@hedvig-ui'
import { dateTimeFormatter } from '@hedvig-ui/utils/date'
import { sleep } from '@hedvig-ui/utils/sleep'
import React from 'react'
import { useSetClaimFileCategoryMutation } from 'types/generated/graphql'
import { DeleteButton } from './DeleteClaimFileButton'

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
    <TableRow>
      <TableColumn>
        {claimFile.contentType === 'application/pdf' ? (
          <embed src={claimFile.fileUploadUrl} width="800px" height="300px" />
        ) : (
          <Image src={claimFile.fileUploadUrl} />
        )}
      </TableColumn>
      <TableColumn>
        <Dropdown
          style={{ width: 200 }}
          placeholder={claimFile.category ?? 'File Type'}
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
                    claimFileId: claimFile.claimFileId,
                    category: file.value,
                  },
                })
              }}
            >
              {file.text}
            </DropdownOption>
          ))}
        </Dropdown>
      </TableColumn>
      <TableColumn>
        {dateTimeFormatter(claimFile.uploadedAt, 'yyyy-MM-dd HH:mm:ss')}
      </TableColumn>
      <TableColumn>
        <DeleteButton
          claimId={claimId}
          claimFileId={claimFile.claimFileId}
          onDeleted={async () => {
            await sleep(500)
            await refetch()
          }}
        />
      </TableColumn>
    </TableRow>
  )
}
