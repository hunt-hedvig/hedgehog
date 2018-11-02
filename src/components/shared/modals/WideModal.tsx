import styled from 'react-emotion'
import { Modal } from 'semantic-ui-react'

const isClient = typeof window !== 'undefined'

export const WideModal = styled(Modal)({
  height: isClient ? window.innerHeight + 100 : '120%',
})
