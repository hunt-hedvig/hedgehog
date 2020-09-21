import { Button } from 'hedvig-ui/button'
import { Input } from 'hedvig-ui/input'
import { Search as SearchBootstrapIcon } from 'react-bootstrap-icons'
import styled, { keyframes } from 'react-emotion'

export const fadeIn = (max: number) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

export const Instructions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  paddingLeft: '1rem',
  paddingTop: '2rem',
  code: {
    background: theme.backgroundTransparent,
    padding: '1px 2px',
    borderRadius: 1,
  },
  opacity: 0,
  animation: `${fadeIn(0.3)} 1000ms forwards`,
  animationDelay: '500ms',
}))

export const MemberSuggestionsWrapper = styled(Instructions)({
  paddingTop: '25vh',
  width: '100%',
  maxWidth: '50rem',
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '750ms',
})

export const NoMembers = styled(Instructions)({
  width: '100%',
  flex: 1,
  alignItems: 'center',
  fontSize: '1.5rem',
  paddingTop: '25vh',
})

export const ExtraInstruction = styled('div')({
  opacity: 0,
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '1000ms',
})

export const ListWrapper = styled('div')({
  paddingLeft: '1rem',
})

export const Group = styled('div')<{ pushLeft?: boolean }>(({ pushLeft }) => ({
  paddingBottom: '1rem',
  paddingLeft: pushLeft ? '1rem' : 0,
}))
export const SearchInputGroup = styled('div')({
  display: 'flex',
  position: 'relative',
  fontSize: '1rem',
  maxWidth: '40rem',
})
export const SearchIcon = styled(SearchBootstrapIcon)<{ muted: boolean }>(
  ({ muted, theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 1,
    fill: muted ? theme.mutedText : undefined,
    transition: 'fill 300ms',
  }),
)

export const SearchInput = styled(Input)({
  marginRight: '1rem',

  '&&': {
    width: '100%',
  },

  '&& input': {
    borderRadius: '0.5rem',
    paddingLeft: '3rem',
  },
})

export const SearchButton = styled(Button)<{ visible: boolean }>(
  ({ visible }) => ({
    opacity: visible ? 1 : 0,
    transition: 'opacity 400ms',
  }),
)

export const EscapeButton = styled(Button)<{ visible: boolean }>(
  ({ visible }) => ({
    opacity: visible ? 1 : 0,
    transition: 'opacity 300ms',
    marginLeft: '2rem',
  }),
)

export const MemberAgeWrapper = styled('div')(({ theme }) => ({
  color: theme.mutedText,
  fontSize: '0.8rem',
}))
