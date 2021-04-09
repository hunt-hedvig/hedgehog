import styled from '@emotion/styled'
import { Modal } from 'semantic-ui-react'

const isClient = typeof window !== 'undefined'

export const WideModal = styled(Modal)({
  height: isClient ? window.innerHeight + 100 : '120%',
})
