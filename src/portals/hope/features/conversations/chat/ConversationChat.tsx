import styled from '@emotion/styled'
import { Button, FadeIn, Flex, Paragraph, Shadowed, TextArea } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { usePlatform } from '@hedvig-ui/hooks/use-platform'
import { MessagesList } from 'portals/hope/features/member/messages/MessagesList'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDraft } from '@hedvig-ui/hooks/use-draft'
import {
  GetQuestionsGroupsDocument,
  useMarkQuestionAsResolvedMutation,
  useSendMessageMutation,
  Template as TemplateMessages,
} from 'types/generated/graphql'
import { FileText } from 'react-bootstrap-icons'
import { useTemplateMessages } from 'portals/hope/features/template-messages/use-template-messages'

const ConversationContent = styled.div`
  background-color: ${({ theme }) => theme.accentBackground};
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 70vh;
  border-radius: 8px;
`

const ConversationFooter = styled.div`
  width: 100%;
  padding: 1em;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  position: relative;
`

const ConversationTextArea = styled(TextArea)`
  &&&& {
    position: relative;
    z-index: 1;
    background: transparent;
    resize: none;
    border: none;
    border-radius: 8px 8px 0 0;
    min-height: 100px;
  }
`

const TextAreaFooter = styled.div`
  position: relative;
  padding: 4px 15px;
  border-radius: 0 0 8px 8px;
  background: ${({ theme }) => theme.accentContrast};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  & * {
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  &:hover * {
    color: ${({ theme }) => theme.foreground};
  }

  & span {
    margin-left: 0.25rem;
    line-height: 0;
    font-size: 12px;
  }

  & .divider {
    position: absolute;
    top: -1px;
    left: 15px;
    width: calc(100% - 30px);
    height: 1px;
    background: ${({ theme }) => theme.accentBackground};
  }
`

const Tip = styled(Paragraph)`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const TemplatesButton = styled(Button)`
  padding: 4px;
  border-radius: 2px;

  &:hover {
    background-color: ${({ theme }) => theme.accentBackground};
  }
`

const HintContainer = styled.div`
  position: absolute;
  top: calc(1.2rem - 1px);
  left: calc(1.2rem - 0.7px);
  border-radius: 8px 8px 0 0;

  width: calc(100% - 2.4rem + 1.5px);
  height: calc(100% - 4.5rem + 2.4px);

  background: ${({ theme }) => theme.backgroundLight};

  word-wrap: break-word;

  padding-top: 11.2px;
  padding-bottom: 10.8px;
  padding-left: 13.8px;
  padding-right: 14px;

  z-index: 0;

  color: ${({ theme }) => theme.placeholderColor};
`

const HintText = styled.span`
  position: absolute;
  top: 8px;
  left: 9px;

  font-size: 14px;
  font-family: sans-serif;
  line-height: 1.15;

  padding: 4px 5px;
  border-radius: 4px;

  background: ${({ theme }) => theme.accentBackground};

  @media only screen and (max-width: 1900px) {
    top: 7px;
  }
`

export const ConversationChat: React.FC<{
  memberId: string
  onFocus: () => void
  onBlur: () => void
  onResolve: () => void
}> = ({ memberId, onFocus, onBlur, onResolve }) => {
  const [message, setMessage] = useDraft(memberId)
  const [inputFocused, setInputFocused] = useState(false)
  const [sendMessage] = useSendMessageMutation()
  const { isMetaKey, metaKey } = usePlatform()
  const [markAsResolved, { loading }] = useMarkQuestionAsResolvedMutation({
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  })
  const [hinting, setHinting] = useState(false)
  const [proposedTemplate, setProposedTemplate] =
    useState<TemplateMessages | null>(null)

  const {
    show,
    selected,
    templates,
    locale,
    loading: templatesLoading,
  } = useTemplateMessages()

  useEffect(() => {
    if (selected) {
      setMessage(selected)
    }
  }, [selected])

  const searchTemplate = (searchText: string) =>
    templates.find(
      (template) =>
        template.title.substring(0, searchText.length).toLowerCase() ===
        searchText.toLowerCase(),
    ) || null

  const getTemplateName = (
    searchTemplate: TemplateMessages | null,
    searchText: string,
  ) =>
    searchTemplate?.title
      .split('')
      .map((letter: string, index: number) => {
        if (searchText[index] === letter.toUpperCase()) {
          return letter.toUpperCase()
        }

        return letter.toLowerCase()
      })
      .join('') || ''

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value

    if (!e.currentTarget.value.includes('/') && hinting) {
      setHinting(false)
    }

    if (hinting) {
      const searchText = text.slice(1)
      const filteredTemplates = searchTemplate(searchText)
      const templateName = getTemplateName(filteredTemplates, searchText)

      setProposedTemplate(
        filteredTemplates
          ? { ...filteredTemplates, title: templateName }
          : null,
      )
      setMessage(e.currentTarget.value)

      return
    }

    setMessage(e.currentTarget.value)
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPressing(e, Keys.Slash) && !hinting && !templatesLoading) {
      e.preventDefault()

      setProposedTemplate(searchTemplate(''))
      setMessage('/')
      setHinting(true)
    }

    if (
      (isPressing(e, Keys.Down) || isPressing(e, Keys.Up)) &&
      hinting &&
      proposedTemplate &&
      !templatesLoading
    ) {
      e.preventDefault()

      const searchText = message.slice(1)

      const templatesIds = templates
        .filter(
          (template) =>
            !!template.messages.find((msg) => msg.language === locale),
        )
        .filter(
          (template) =>
            template.title.substring(0, searchText.length).toLowerCase() ===
            searchText.toLowerCase(),
        )
        .map((template) => template.id)

      const indexOfCurrentTemplate = templatesIds.indexOf(proposedTemplate.id)

      if (
        indexOfCurrentTemplate < templatesIds.length - 1 &&
        isPressing(e, Keys.Down)
      ) {
        const template =
          templates.find(
            (template) =>
              template.id === templatesIds[indexOfCurrentTemplate + 1],
          ) || null

        const templateName = getTemplateName(template, searchText)

        setProposedTemplate(
          template ? { ...template, title: templateName } : null,
        )
      }

      if (indexOfCurrentTemplate > 0 && isPressing(e, Keys.Up)) {
        const template =
          templates.find(
            (template) =>
              template.id === templatesIds[indexOfCurrentTemplate - 1],
          ) || null

        const templateName = getTemplateName(template, searchText)

        setProposedTemplate(
          template ? { ...template, title: templateName } : null,
        )
      }
    }

    if (isPressing(e, Keys.Escape) && hinting) {
      e.preventDefault()

      setProposedTemplate(null)
      setHinting(false)
    }

    if (!isMetaKey(e) && isPressing(e, Keys.Enter) && hinting) {
      e.preventDefault()

      const newMessage = proposedTemplate?.messages.find(
        (msg) => msg.language === locale,
      )?.message

      setMessage(newMessage || '')

      setProposedTemplate(null)
      setHinting(false)
    }

    if (
      isMetaKey(e) &&
      isPressing(e, Keys.Enter) &&
      !loading &&
      message &&
      !hinting
    ) {
      toast.promise(
        sendMessage({
          variables: {
            input: {
              memberId,
              message,
              forceSendMessage: false,
            },
          },
        }),
        {
          loading: 'Sending message',
          success: () => {
            setMessage('')
            return 'Message sent'
          },
          error: 'Could not send message',
        },
      )
      return
    }

    if (
      isMetaKey(e) &&
      isPressing(e, Keys.Enter) &&
      e.shiftKey &&
      !loading &&
      !message
    ) {
      toast.promise(
        markAsResolved({
          variables: { memberId },
          optimisticResponse: {
            markQuestionAsResolved: true,
          },
        }),
        {
          loading: 'Marking as resolved',
          success: () => {
            onResolve()
            return 'Marked as resolved'
          },
          error: 'Could not mark as resolved',
        },
      )
    }
  }

  return (
    <FadeIn style={{ width: '100%', height: '100%' }}>
      <ConversationContent>
        <MessagesList memberId={memberId} />
        <ConversationFooter>
          <HintContainer>
            {hinting ? (
              <HintText>
                {proposedTemplate?.title
                  ? `/${proposedTemplate?.title}`
                  : message}
              </HintText>
            ) : (
              ''
            )}
          </HintContainer>

          <ConversationTextArea
            onFocus={() => {
              setInputFocused(true)
              onFocus()
            }}
            onBlur={() => {
              setInputFocused(false)
              onBlur()
            }}
            placeholder={
              !hinting ? `Message goes here or type '/' for templates` : ''
            }
            value={message}
            onChange={onChangeHandler}
            onKeyDown={(e) => handleOnKeyDown(e)}
          />
          <TextAreaFooter onClick={show}>
            <div className="divider" />
            <TemplatesButton
              size="small"
              variant="tertiary"
              icon={
                <FileText style={{ width: 12, height: 12, marginRight: 4 }} />
              }
            >
              templates
            </TemplatesButton>
          </TextAreaFooter>
        </ConversationFooter>
      </ConversationContent>
      <Flex fullWidth justify={'space-between'} style={{ marginTop: '1.0em' }}>
        <FadeIn duration={200}>
          <Tip>
            <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Shift</Shadowed> +{' '}
            <Shadowed>Enter</Shadowed> to mark as resolved
          </Tip>
        </FadeIn>
        {inputFocused && (
          <FadeIn duration={200}>
            <Tip>
              <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Enter</Shadowed>{' '}
              to send
            </Tip>
          </FadeIn>
        )}
      </Flex>
    </FadeIn>
  )
}
