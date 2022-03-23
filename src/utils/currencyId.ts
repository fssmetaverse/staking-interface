import { Currency, ETHER, Token, ChainId, CURRENCY_SYMBOL } from '@daoswapdex/daoswap-dex-sdk'

export function currencyId(chainId: ChainId | undefined, currency: Currency): string {
  const currentChainId = chainId ? chainId : ChainId.HECO_MAINNET
  if (currency === ETHER) return CURRENCY_SYMBOL[currentChainId]
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
