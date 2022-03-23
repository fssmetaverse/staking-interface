import { Interface } from '@ethersproject/abi'
import { ChainId } from '@daoswapdex/daoswap-dex-sdk'
import V1_EXCHANGE_ABI from './v1_exchange.json'
import V1_FACTORY_ABI from './v1_factory.json'

const V1_FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.BSC_MAINNET]: '0x6Ce570d02D73d4c384b46135E87f8C592A8c86dA',
  [ChainId.BSC_TESTNET]: '0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30',
  [ChainId.HECO_MAINNET]: '0x6Ce570d02D73d4c384b46135E87f8C592A8c86dA',
  [ChainId.HECO_TESTNET]: '0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30'
}

const V1_FACTORY_INTERFACE = new Interface(V1_FACTORY_ABI)
const V1_EXCHANGE_INTERFACE = new Interface(V1_EXCHANGE_ABI)

export { V1_FACTORY_ADDRESSES, V1_FACTORY_INTERFACE, V1_FACTORY_ABI, V1_EXCHANGE_INTERFACE, V1_EXCHANGE_ABI }
