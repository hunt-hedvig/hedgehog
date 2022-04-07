import { Page } from 'portals/hope/pages/routes'
import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { Button, Input, MainHeadline, Spacing } from '@hedvig-ui'
import { useCreatePaymentCompletionLinkMutation } from 'types/generated/graphql'
import { useTitle } from '@hedvig-ui'

const ImpersonateMemberPage: Page = () => {
  useTitle('Impersonate Member')
  const [memberId, setMemberId] = useState('')
  const [mutate, { loading, data }] = useCreatePaymentCompletionLinkMutation()
  return (
    <>
      <MainHeadline>Impersonate member</MainHeadline>
      <Input
        value={memberId}
        onChange={({ target: { value } }) => {
          setMemberId(value)
        }}
        placeholder="Member ID"
        style={{ width: '300 px' }}
      />

      <Spacing top="small" />

      <div>
        <Button
          variant="primary"
          disabled={loading || !memberId}
          onClick={() => {
            mutate({
              variables: {
                memberId,
              },
            })
          }}
        >
          Impersonate
        </Button>
      </div>
      {data && (
        <>
          <Spacing top="small" />
          Impersonation successful - scan the following QR-Code to impersonate:
          <Spacing top="small" />
          <QRCode
            value={`hedvigengineering://impersonate?token=${
              data.createPaymentCompletionLink.url.split('#')[1]
            }`}
          />
        </>
      )}
    </>
  )
}

export default ImpersonateMemberPage
