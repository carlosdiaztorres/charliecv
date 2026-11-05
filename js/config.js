/**
 * Central configuration for metrics and brands
 * Allows easy tuning and verification without modifying DOM logic.
 */
window.PORTFOLIO_CONFIG = {
  metrics: [
    {
      id: 'accounts',
      target: 20,
      prefix: '',
      suffix: '+',
      decimals: 0,
      label: 'Enterprise accounts<br>in active portfolio'
    },
    {
      id: 'retention',
      target: 99.4,
      prefix: '',
      suffix: '%',
      decimals: 1,
      label: 'Customer retention<br>rate'
    },
    {
      id: 'upsell',
      target: 93,
      prefix: '',
      suffix: '%',
      decimals: 0,
      label: 'Upsell target<br>achievement'
    },
    {
      id: 'portfolio_arr',
      target: 3.0,
      prefix: '~',
      suffix: 'M€',
      decimals: 0,
      label: 'Enterprise customer portfolio<br>under management (~€3M ARR)'
    }
  ],
  brands: [
    { name: 'Orange', region: 'Spain' },
    { name: 'Bedrock Streaming', region: 'Europe' },
    { name: 'France Télévisions', region: 'France' },
    { name: 'Channel 5', region: 'UK' },
    { name: 'Sky Switzerland', region: 'Switzerland' },
    { name: 'Molotov', region: 'France' },
    { name: 'NOS Technology', region: 'Portugal' },
    { name: 'Simplestream', region: 'UK' },
    { name: 'Go3 / TV3', region: 'Baltics' },
    { name: 'Playtech', region: 'Global' }
  ]
};

