// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  999: { // Hyperliquid EVM
    DOT_HYPE_RESOLVER: '0x4d5e4ed4D5e4A160Fa136853597cDc2eBBe66494', // dotHYPE Resolver on Hyperliquid EVM
    DOT_HYPE_CONTROLLER: '0xCd0A58e078c57B69A3Da6703213aa69085E2AC65', // dotHYPE Controller
    DOT_HYPE_REGISTRY: '0xBf7cE65e6E920052C11690a80EAa3ed2fE752Dd8', // dotHYPE Registry
    DOT_HYPE_PRICE_ORACLE: '0x09fAB7D96dB646a0f164E3EA84782B45F650Fb51', // dotHYPE Price Oracle
  },
} as const;

export function getCurrentNetworkAddresses() {
  // Default to Hyperliquid EVM
  return CONTRACT_ADDRESSES[999];
}

// Helper function to check if resolver address is configured
export function isResolverConfigured(): boolean {
  const addresses = getCurrentNetworkAddresses();
  return addresses.DOT_HYPE_RESOLVER !== '0x0000000000000000000000000000000000000000' && addresses.DOT_HYPE_RESOLVER.length === 42;
}