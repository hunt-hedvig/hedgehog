import React from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { Button, Flex } from '@hedvig-ui'
import toast from 'react-hot-toast'
import { useCheckInOut } from 'portals/hope/features/tasks/hooks/use-check-in-out'

const CheckedInWrapper = styled.div`
  padding: 1.2rem;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 0.25rem;

  h4 {
    font-size: 1.3rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.accentContrast).alpha(0.6).hex()};
  }

  .n-questions {
    background-color: ${({ theme }) =>
      chroma(theme.accentContrast).alpha(0.15).hex()};
    color: ${({ theme }) => theme.accentContrast};
    border-radius: 0.25rem;
    padding: 0.1rem 0.2rem;
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.5, 0.5);
      opacity: 0.5;
    }
    to {
      transform: scale(2.5, 2.5);
      opacity: 0;
    }
  }

  .bouncing-orb {
    position: absolute;
    top: 0;
    left: 0;

    width: 0.75rem;
    height: 0.75rem;

    border-radius: 50%;

    animation: scaleIn 4s infinite cubic-bezier(0.36, 0.11, 0.89, 0.32);

    background-color: ${({ theme }) => theme.accentContrast};
  }
`

export const CheckedInCard: React.FC = () => {
  const { checkOut, checkedIn } = useCheckInOut()

  if (!checkedIn) return null

  return (
    <CheckedInWrapper>
      <Flex direction="column">
        <Flex align="center" justify="space-between">
          <div>
            <h4>You are checked-in </h4>
          </div>
          <div style={{ marginTop: '-0.75rem', width: '1rem' }}>
            <div
              style={{
                position: 'relative',
              }}
            >
              <div className="bouncing-orb" style={{ animationDelay: '0s' }} />
              <div className="bouncing-orb" style={{ animationDelay: '1s' }} />
              <div className="bouncing-orb" style={{ animationDelay: '2s' }} />
              <div className="bouncing-orb" style={{ animationDelay: '3s' }} />
            </div>
          </div>
        </Flex>
        <Flex justify="space-between" style={{ marginTop: '1rem' }}>
          <Button
            variant="secondary"
            onClick={() => {
              toast.success('Checked out')
              checkOut()
            }}
          >
            Check out
          </Button>
        </Flex>
      </Flex>
    </CheckedInWrapper>
  )
}
