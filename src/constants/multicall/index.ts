import { ChainId, MULTICALL_ADDRESS } from '@daoswapdex/daoswap-dex-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.BSC_MAINNET]: MULTICALL_ADDRESS[ChainId.BSC_MAINNET],
  [ChainId.BSC_TESTNET]: MULTICALL_ADDRESS[ChainId.BSC_TESTNET],
  [ChainId.HECO_MAINNET]: MULTICALL_ADDRESS[ChainId.HECO_MAINNET],
  [ChainId.HECO_TESTNET]: MULTICALL_ADDRESS[ChainId.HECO_TESTNET]
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
