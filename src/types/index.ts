import { Abi, Address } from 'viem';

export interface MenuItemsTypes {
  title: string;
  url: string;
  cName: string;
}

export interface CoinListTypes {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  balance?: number;
}

export interface TokenInfoTypes {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  balance?: string;
}

export type AbiType = {
  abi: Abi;
};

export type BalanceAndSymbol = {
  address: string;
  symbol: string;
  balance: string;
};
