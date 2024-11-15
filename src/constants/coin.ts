import { CoinListTypes } from '@/types';
import { ChainId } from './chain';
import USDTIMG from '@/assets/USDT.png';
import PORKETIMG from '@/assets/PocketImg.png';
import GOLDIMG from '@/assets/GOLD.png';
import DMDIMG from '@/assets/DMDIMG.png';
export const MODECOINSLIST: CoinListTypes[] = [
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xA46Ba1732444DF2b3c0c4F98186E234B69e7D215',
    logoURI: USDTIMG,
  },
  {
    name: 'Pocket Index',
    symbol: 'PocketIndex',
    address: '0x111F608A01119707Dc70032B7738Af8B5131E949',
    logoURI: PORKETIMG,
  },
  {
    name: 'Ether',
    symbol: 'ETH',
    address: '', // Weth address is fetched from the router
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    address: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
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
    address: '0xaa2A46a015dbA96Be4D24F1637002Ff1c8762b29',
    logoURI: GOLDIMG,
  },
  {
    name: 'Pearl',
    symbol: 'PEARL',
    address: '0xf644ef54bCDDcC70f5bf1ba0BCe93E75Fb445Ba5',
    logoURI:
      'https://assets.coingecko.com/coins/images/30799/large/Yp9H3agr_400x400.jpg?1696529660',
  },
  {
    name: 'Diamond',
    symbol: 'DMD',
    address: '0x66871BD88bddC937c8Da5Fb8fc3Ef7ab09B2336a',
    logoURI: DMDIMG,
  },
];

const COINSMAP = new Map();
COINSMAP.set(ChainId.MAINNET, MODECOINSLIST);

export default COINSMAP;
