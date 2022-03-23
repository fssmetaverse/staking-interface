import React, { useCallback, useEffect, useRef } from 'react'
import { ChevronDown } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import usePrevious from '../../hooks/usePrevious'
import { addPopup, ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ChainId } from '@daoswapdex/daoswap-dex-sdk'
import { useActiveWeb3React } from '../../hooks'
import { ParsedQs } from 'qs'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../../state/hooks'

import { CHAIN_INFO } from '../../constants/chainInfo'
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from '../../constants/chains'
import { switchToNetwork } from '../../utils/switchToNetwork'
import { replaceURLParam } from '../../utils/routes'
import { useTranslation } from 'react-i18next'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}
const NetworkLabel = styled.div`
  flex: 1 1 auto;
`
const SelectorWrapper = styled.div`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    position: relative;
  }
`
const SelectorLabel = styled(NetworkLabel)`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    margin-right: 8px;
  }
`
const SelectorControls = styled.div<{ interactive: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ theme }) => theme.bg1};
  border-radius: 16px;
  color: ${({ theme }) => theme.text1};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'auto')};
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`
const StyledChevronDown = styled(ChevronDown)`
  width: 16px;
`

const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`
const FlyoutMenu = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  position: absolute;
  top: 64px;
  right: 0rem;
  min-width: 13.125rem;
  z-index: 99;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -9rem;
  `};
`
// top: -14.5rem;
const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.bg1 : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
`
const FlyoutRowActiveIndicator = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  height: 9px;
  width: 9px;
`

function Row({ targetChain, onSelectChain }: { targetChain: ChainId; onSelectChain: (targetChain: number) => void }) {
  const { library, chainId } = useActiveWeb3React()
  if (!library || !chainId) {
    return null
  }
  const active = chainId === targetChain
  // const { label } = CHAIN_INFO[targetChain]

  const rowContent = (
    <FlyoutRow onClick={() => onSelectChain(targetChain)} active={active}>
      {/* <NetworkLabel>{label}</NetworkLabel> */}
      <NetworkLabel>{CHAIN_IDS_TO_NAMES[targetChain]}</NetworkLabel>
      {chainId === targetChain && <FlyoutRowActiveIndicator />}
    </FlyoutRow>
  )
  return rowContent
}

const getChainIdFromName = (name: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([_, n]) => n === name)
  const chainId = entry?.[0]
  return chainId ? parseInt(chainId) : undefined
}

const getParsedChainId = (parsedQs?: ParsedQs) => {
  const chain = parsedQs?.chain
  if (!chain || typeof chain !== 'string') return { urlChain: undefined, urlChainId: undefined }

  return { urlChain: chain.toLowerCase(), urlChainId: getChainIdFromName(chain) }
}

const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

export default function NetworkSelector() {
  const { t } = useTranslation()

  const { library, chainId } = useActiveWeb3React()

  const parsedQs = useParsedQueryString()
  const { urlChain, urlChainId } = getParsedChainId(parsedQs)
  const prevChainId = usePrevious(chainId)
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.NETWORK_SELECTOR)
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECTOR)
  useOnClickOutside(node, open ? toggle : undefined)

  const history = useHistory()

  const info = chainId ? CHAIN_INFO[chainId] : undefined

  const dispatch = useAppDispatch()

  const handleChainSwitch = useCallback(
    (targetChain: number, skipToggle?: boolean) => {
      if (!library) return
      switchToNetwork({ library, chainId: targetChain })
        .then(() => {
          if (!skipToggle) {
            toggle()
          }
          history.replace({
            search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(targetChain))
          })
        })
        .catch(error => {
          console.error('Failed to switch networks', error)

          // we want app network <-> chainId param to be in sync, so if user changes the network by changing the URL
          // but the request fails, revert the URL back to current chainId
          if (chainId) {
            history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
          }

          if (!skipToggle) {
            toggle()
          }

          dispatch(
            addPopup({
              content: {
                failedSwitchNetwork: {
                  summary: t('Failed to switch networks') + ',' + t('please add the network manually'),
                  // summary: t('Failed to switch networks') + ',' + t('Error Network') + ':' + targetChain,
                  success: false
                }
              },
              key: `failed-network-switch`
            })
          )
        })
    },
    [t, dispatch, library, toggle, history, chainId]
  )

  useEffect(() => {
    if (!chainId || !prevChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
      // otherwise assume network change originates from URL
    } else if (urlChainId && urlChainId !== chainId) {
      handleChainSwitch(urlChainId, true)
    }
  }, [chainId, urlChainId, prevChainId, handleChainSwitch, history])

  // set chain parameter on initial load if not there
  useEffect(() => {
    if (chainId && !urlChainId) {
      history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
    }
  }, [chainId, history, urlChainId, urlChain])

  if (!chainId || !info || !library) {
    return null
  }

  return (
    <SelectorWrapper ref={node as any}>
      <SelectorControls onClick={toggle} interactive>
        {/* <SelectorLabel>{info.label}</SelectorLabel> */}
        <SelectorLabel>{CHAIN_IDS_TO_NAMES[chainId]}</SelectorLabel>
        <StyledChevronDown />
      </SelectorControls>
      {open && (
        <FlyoutMenu>
          <FlyoutHeader>{t('Select a network')}</FlyoutHeader>
          <Row onSelectChain={handleChainSwitch} targetChain={ChainId.BSC_MAINNET} />
          {/* <Row onSelectChain={handleChainSwitch} targetChain={ChainId.BSC_TESTNET} /> */}
          <Row onSelectChain={handleChainSwitch} targetChain={ChainId.HECO_MAINNET} />
          {/* <Row onSelectChain={handleChainSwitch} targetChain={ChainId.HECO_TESTNET} /> */}
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  )
}
