// ABI for dotHYPE resolver contract - based on dotHYPE documentation
export const DOT_HYPE_RESOLVER_ABI = [
  // getName function - gets primary domain for an address
  {
    inputs: [{ name: 'addr', type: 'address' }],
    name: 'getName',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  // getValue function - gets text records for a domain
  {
    inputs: [
      { name: 'addr', type: 'address' },
      { name: 'key', type: 'string' }
    ],
    name: 'getValue',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  // resolve function - resolves domain to address
  {
    inputs: [{ name: 'name', type: 'string' }],
    name: 'resolve',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;