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
    address: '0xdD8f107d41705a0E741d2f1143513562A43B47eb',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    name: 'Pocket Index',
    symbol: 'PocketIndex',
    address: '0xA0d8c14E731882B504Ef9bFF93B8c9c2fD561642',
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
    address: '0x7607Dda799CC9fb4696dCBF73e6d0B7f72f47138',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x00D84e62a854e54Ba7289ab6506F95000Bb4B008',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    name: 'Gold',
    symbol: 'GLD',
    address: '0x8A9F46dF987D9497DA1BdeC9AC3AFa177181c28b',
    logoURI:
      'https://assets.coingecko.com/coins/images/18125/thumb/lpgblc4h_400x400.jpg?1630570955',
  },
  {
    name: 'Pearl',
    symbol: 'PEARL',
    address: '0x85B27580e6a5ee78C65E3AdC2CE552213A114d94',
    logoURI:
      'https://assets.coingecko.com/coins/images/30799/large/Yp9H3agr_400x400.jpg?1696529660',
  },
  {
    name: 'Link',
    symbol: 'LINK',
    address: '0x5657DD39f1a6343c24a55C99180EBF5bB6474880',
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
