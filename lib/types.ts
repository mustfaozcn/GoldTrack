export interface GoldRate {
  Selling: number;
  Buying: number;
  Type: string;
  Name: string;
  Change: number;
}

export interface CurrencyRate {
  name: string;
  buying: number;
  selling: number;
  date: string;
}

export interface GoldItem {
  type: string;
  quantity: number;
  id: string;
  grams?: number; // Optional gram weight for jewelry items
}

export interface ParsedInput {
  type: string;
  quantity: number;
  grams?: number; // Optional gram weight for jewelry items
}

export type Currency = 'TRY' | 'USD' | 'EUR';