// hooks/use-gold-calculator.ts
'use client';

import { useState, useEffect } from 'react';
import { GoldItem, Currency } from '@/lib/types';
import { parseNaturalInput } from '@/lib/gold-utils';
import { useFinancialData } from '@/lib/api-service';

export function useGoldCalculator() {
  const [items, setItems] = useState<GoldItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('goldItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('TRY');

  // API verilerini merkezi servisden alıyoruz
  const { currencyRates, goldRates, error, isLoading } = useFinancialData();

  useEffect(() => {
    localStorage.setItem('goldItems', JSON.stringify(items));
  }, [items]);

  const addItem = (type: string, quantity: number, grams?: number) => {
    setItems((prevItems) => {
      // Aynı türden ve (varsa) aynı gram ağırlığından olan item'ı bul
      const existingItemIndex = prevItems.findIndex(item =>
          item.type === type &&
          (grams ? item.grams === grams : !item.grams)
      );

      if (existingItemIndex !== -1) {
        // Eğer aynı türden item varsa, miktarını güncelle
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      }

      // Eğer aynı türden item yoksa, yeni item ekle
      return [...prevItems, {
        type,
        quantity,
        grams,
        id: crypto.randomUUID()
      }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const processNaturalInput = async (input: string) => {
    const parsedItems = await parseNaturalInput(input);

    parsedItems.forEach((item) => {
      addItem(item.type, item.quantity, item.grams);
    });
  };

  const clearItems = () => {
    setItems([]);
    localStorage.removeItem('goldItems');
  };

  return {
    items,
    goldRates: goldRates || { Meta_Data: {}, Rates: {} },
    currencyRates: currencyRates || { Meta_Data: {}, Rates: {} },
    selectedCurrency,
    setSelectedCurrency,
    addItem,
    removeItem,
    clearItems,
    processNaturalInput,
    isLoading,
    error,
  };
}
