import styled from '@emotion/styled'
import { Button, Checkbox, Flex, Label, Modal } from '@hedvig-ui'
import chroma from 'chroma-js'
import React from 'react'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { convertEnumOrSentenceToTitle } from '@hedvig-ui'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'

const StyledModal = styled(Modal)`
  width: 24rem;
  min-height: 20rem;

  padding: 1.5rem;

  h4 {
    font-size: 1.4rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .tip {
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;
    font-size: 0.8rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    text-align: center;
  }
`

export const UpdateUserMarketModal: React.FC<{
  onClose: () => void
  onSubmit: () => void
  visible: boolean
}> = ({ onClose, onSubmit, visible }) => {
  const { markets: userMarkets, removeMarket, addMarket } = useMyMarkets()

  return (
    <StyledModal onClose={onClose} visible={visible}>
      <Flex
        style={{ height: '100%', width: '100%' }}
        direction="column"
        justify="space-between"
      >
        <div>
          <h4>Select Markets</h4>
          <p>
            Hope will assign you questions and claims according to the market(s)
            you handle.
          </p>

          <Label style={{ fontSize: '0.85rem' }}>Focus Market(s)</Label>
          <Flex
            style={{
              flexWrap: 'wrap',
              marginTop: '0.25rem',
              marginBottom: '2.5rem',
            }}
            justify="space-between"
          >
            {Object.values(Market).map((market) => {
              const checked = userMarkets.includes(market)

              return (
                <Checkbox
                  key={market}
                  style={{ width: '50%', marginTop: '0.25rem' }}
                  label={`${convertEnumOrSentenceToTitle(market)} ${
                    MarketFlags[market]
                  }`}
                  checked={checked}
                  onChange={() =>
                    checked ? removeMarket(market) : addMarket(market)
                  }
                />
              )
            })}
          </Flex>
        </div>
        <div style={{ width: '100%' }}>
          <Button
            style={{ width: '100%' }}
            disabled={!userMarkets.length}
            onClick={onSubmit}
          >
            Check-in
          </Button>
          <div className="tip">
            These can be changed under your profile settings
          </div>
        </div>
      </Flex>
    </StyledModal>
  )
}
