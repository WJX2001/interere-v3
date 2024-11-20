import { useGetFactory, useRouterContract } from '@/hooks/useContract';
import { Abi, Address } from 'viem';

export interface MenuItemsTypes {
  title: string;
  url: string;
  cName: string;
}

export interface CoinListTypes {
  name: string;
  symbol: string;
  address: Address;
  logoURI: string;
  balance?: string;
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

export type GetBalanceAndSymbolResult = {
  balance: string;
  symbol: string;
} | false;

export type NetworkTypes = {
  wethAddress: Address;
  coins: CoinListTypes[];
  factory: ReturnType<typeof useGetFactory>;
  router: ReturnType<typeof useRouterContract>;
}