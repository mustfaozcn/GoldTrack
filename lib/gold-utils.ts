import { parseWithGemini } from './gemini';
import { GoldItem, ParsedInput, Currency } from './types';

export const GOLD_TYPES = {
  GRA: 'Gram Altın',
  TAM: 'Tam Altın',
  YAR: 'Yarım Altın',
  CEY: 'Çeyrek Altın',
  CUM: 'Cumhuriyet Altını',
  ATA: 'Ata Altın',
  ODA: '14 Ayar Altın',
  OSA: '18 Ayar Altın',
  YIA: '22 Ayar Bilezik',
  IKI: 'İki Buçuk Altın',
  BES: 'Beşli Altın',
  GRE: 'Gremse Altın',
  RES: 'Reşat Altın',
  HAM: 'Hamit Altın',
} as const;

export const GOLD_WEIGHTS = {
  GRA: 1,
  TAM: 7.2,
  YAR: 3.6,
  CEY: 1.8,
  CUM: 7.2,
  ATA: 7.2,
  IKI: 18,
  BES: 36,
  GRE: 18,
  RES: 7.2,
  HAM: 7.2,
} as const;

export async function parseNaturalInput(input: string): Promise<ParsedInput[]> {
  return await parseWithGemini(input);
}

export function calculateTotalValue(
  items: GoldItem[],
  goldRates: {
    Rates: Record<string, {
      Selling: number;
      Buying: number;
      Type: string;
      Name: string;
      Change: number;
    }>;
  },
  selectedCurrency: Currency,
  currencyRates: {
    Rates: Record<string, {
      Type: string;
      Change: number;
      Name: string;
      Buying: number;
      Selling: number;
    }>;
  }
) {
  let totalTRY = 0;

  items.forEach((item) => {
    const rate = goldRates.Rates[item.type];
    if (rate) {
      // For jewelry items (ODA, OSA, YIA), use the gram weight
      if (['ODA', 'OSA', 'YIA'].includes(item.type) && item.grams) {
        totalTRY += rate.Selling * item.quantity * item.grams;
      } else {
        // For standard gold items, use the predefined weights
        const weight = GOLD_WEIGHTS[item.type as keyof typeof GOLD_WEIGHTS] || 1;
        totalTRY += rate.Selling * item.quantity;
      }
    }
  });

  if (selectedCurrency === 'TRY') {
    return totalTRY;
  }

  const currencyRate = currencyRates.Rates[selectedCurrency];
  return currencyRate ? totalTRY / currencyRate.Selling : 0;
}
