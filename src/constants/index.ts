import { CoinListTypes, MenuItemsTypes } from '@/types';
import { zeroAddress } from 'viem';

export const HEADERHEIGHT = 48;

export const MENUITEMS: MenuItemsTypes[] = [
  {
    title: 'Swap',
    url: '/swap',
    cName: 'nav-links',
  },
  {
    title: 'Liquidity',
    url: '/liquidity',
    cName: 'nav-links',
  },
  {
    title: 'Index',
    url: '/buy-index',
    cName: 'nav-links',
  },
  {
    title: 'Stake',
    url: '/staking',
    cName: 'nav-links',
  },
  {
    title: 'Loans',
    url: '/loans',
    cName: 'nav-links',
  },
];

export const FONT = 'Inter, Arial';

export const ROUTES = {
  dashboard: '/',
  markets: '/markets',
  staking: '/staking',
};

export const COINLISTS: CoinListTypes[] = [
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xC4D9ADD7063F520596AEAD39888bAe8af0B10a31',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    name: 'Pocket Index',
    symbol: 'PocketIndex',
    address: '0xaD3D248B510C23F71915BBf73C6ce6a1b620F8d3',
    logoURI:
      'https://coin-images.coingecko.com/coins/images/31696/large/POKT.jpg?1703257336',
  },
  {
    name: 'Ether',
    symbol: 'ETH',
    address: zeroAddress, // Weth address is fetched from the router
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    address: '0x416Ec59418c50867a3A26dD9FB84A117744B31F2',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  // {
  //   name: 'Wrapped BTC',
  //   symbol: 'WBTC',
  //   address: '0x00D84e62a854e54Ba7289ab6506F95000Bb4B008',
  //   logoURI:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  // },
  {
    name: 'Gold',
    symbol: 'GLD',
    address: '0x8a30F2D0b38a70b7aD3A9A1Cf1010537B6129e43',
    logoURI:
      'https://assets.coingecko.com/coins/images/18125/thumb/lpgblc4h_400x400.jpg?1630570955',
  },
  {
    name: 'Pearl',
    symbol: 'PEARL',
    address: '0xe411e046b42760FA917401d0B83EAb48197e452B',
    logoURI:
      'https://assets.coingecko.com/coins/images/30799/large/Yp9H3agr_400x400.jpg?1696529660',
  },
  {
    name: 'Link',
    symbol: 'LINK',
    address: '0xc55ECc3c35cc30c650b6b67E3DA9A9c3BF3c5046',
    logoURI:
      'https://assets.coingecko.com/coins/images/12738/thumb/AlphaToken_256x256.png?1617160876',
  },
];

export const COMMON_SWAPS = [
  'ETH',
  'DAI',
  'USDC',
  'USDT',
  'WBTC',
  'WETH',
  'DAI.e',
  'USDC.e',
  'USDT.e',
  'GHO',
];
