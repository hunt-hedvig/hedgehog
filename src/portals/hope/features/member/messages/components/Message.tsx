import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { format } from 'date-fns'
import ImageMessage from 'portals/hope/features/member/messages/components/ImageMessage'
import SelectMessage from 'portals/hope/features/member/messages/components/SelectMessage'
import React from 'react'
import Linkify from 'react-linkify'

const MessageRow = styled.div<
  WithLeft & { isQuestion?: boolean; isVisible: boolean }
>`
  display: flex;
  flex-shrink: 0;
  justify-content: ${(props) => (props.left ? 'flex-end' : 'flex-start')};
  margin: ${(props) => (props.isQuestion ? '0px' : '0.5rem 0')};
  width: 100%;
  box-sizing: border-box;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'scale(1)' : 'scale(0.6)')};
  transform-origin: ${(props) => (props.left ? 'right' : 'left')} bottom;
  transition: all 0.25s ease-out;
`

const MessageBox = styled.div`
  max-width: 100%;
`

interface WithLeft {
  left: boolean
}

const MessageBody = styled.div<WithLeft>`
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 2000;
  position: relative;
  &,
  & label {
    color: ${({ left, theme }) =>
      left ? theme.accentContrast : theme.foreground} !important;
  }

  line-height: 1.4em;
  background: ${(props) =>
    props.left ? props.theme.accent : props.theme.accentLight};
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;

  & a {
    color: ${({ theme }) => theme.accentSaturated};
    text-decoration: underline;
  }

  &:before {
    position: absolute;
    content: '';
    width: 0.7em;
    height: 0.7em;
    background: ${(props) =>
      props.left ? props.theme.accent : props.theme.accentLight};

    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    z-index: 2;
    box-shadow: 1px 1px 0 0 ${({ theme }) => theme.border};
    bottom: -0.3em;
    ${({ left }) => css`
      ${left ? `right: 1em;` : `left: 1em;`};
    `};
    top: auto;
    margin-left: 0;
  }
`

const MessageInfo = styled.div<WithLeft>`
  margin: 0.5em 0;
  font-size: 0.9rem;
  ${({ left }) => left && `text-align: right;`};
`
const Timestamp = styled.div`
  color: ${({ theme }) => theme.mutedText};
  font-size: 0.8rem;
`

const Video = styled.video`
  max-width: 300px;
`

const Image = styled.img`
  max-width: 300px;
`

const isImage = (text: string) => {
  return text.match(/\.(jpeg|jpg|gif|png)$/) != null
}

export enum MessageTypes {
  TEXT = 'text',
  NUMBER = 'number',
  SINGLE_SELECT = 'single_select',
  MULTIPLE_SELECT = 'multiple_select',
  DATE = 'date_picker',
  ACTIVATION_DATE = 'activation_date_picker',
  CANCELLATION_DATE = 'cancellation_date_picker',
  PARAGRAPH = 'paragraph',
  AUDIO = 'audio',
  VIDEO = 'video',
  HERO = 'hero',
  PHOTO = 'photo_upload',
  BANK_ID_COLLECT = 'bankid_collect',
  FILE_UPLOAD = 'file_upload',
}

export interface MessageContentType {
  type: keyof typeof MessageTypes
  text: string
  url?: string
  URL?: string
  imageUri?: string
  imageURL?: string
  date?: string
  choices: {
    type?: string
    selected?: boolean
    appUrl?: string
    webUrl?: string
    view?: string
    text: string | number
  }[]
}

export const Message = React.forwardRef<
  React.ReactNode,
  {
    left: boolean
    content: MessageContentType
    isQuestionMessage?: boolean
    timestamp: Date | null
    from?: string | null
  }
>(({ left, content, isQuestionMessage, timestamp, from }, ref) => {
  const [isVisible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <MessageRow
      left={left}
      isQuestion={isQuestionMessage}
      ref={ref as React.RefObject<HTMLDivElement>}
      isVisible={isVisible}
    >
      <MessageBox>
        <MessageBody left={left}>
          {isImage(content.text) && <Image src={content.text} />}
          {!isImage(content.text) && (
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="_blank" href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              {content.text}
            </Linkify>
          )}
          <MessageContent content={content} />
        </MessageBody>
        <MessageInfo left={left}>
          {from}
          {timestamp ? (
            <Timestamp>{format(timestamp, "MMM dd ''yy, HH:mm")}</Timestamp>
          ) : null}
        </MessageInfo>
      </MessageBox>
    </MessageRow>
  )
})

const MessageContent = ({ content }: { content: MessageContentType }) => {
  switch (content.type) {
    case 'DATE':
      return <p>Date: {content?.date}</p>
    case 'AUDIO':
      return <audio src={content?.URL} controls />
    case 'VIDEO':
      return <Video src={content.URL} controls />
    case 'PHOTO':
    case 'PARAGRAPH':
    case 'HERO':
      return <ImageMessage content={content} />
    case 'MULTIPLE_SELECT':
    case 'SINGLE_SELECT':
      return <SelectMessage content={content} />
    case 'FILE_UPLOAD':
      return <a href={content.url}>Attached file</a>
    case 'TEXT':
    case 'NUMBER':
    case 'ACTIVATION_DATE':
    case 'CANCELLATION_DATE':
    case 'BANK_ID_COLLECT':
      return null
    default:
      return null
  }
}
