// lib/api-service.ts
'use client';

import useSWR from 'swr';

// API yanıt tipleri
export type FinancialData = {
    Meta_Data: {
        Minutes_Ago: number;
        Current_Date: string;
        Update_Date: string;
    };
    Rates: {
        [key: string]: {
            Buying?: number;
            Selling: number;
            Type: string;
            Name: string;
            Change: number;
        };
    };
};

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('API yanıtı başarısız');
    }
    return res.json();
};

export function useCurrencyRates() {
    const { data, error, isLoading } = useSWR<FinancialData>(
        'https://finance.truncgil.com/api/currency-rates',
        fetcher,
        { refreshInterval: 60000 }
    );

    return {
        currencyRates: data,
        currencyError: error,
        isCurrencyLoading: isLoading
    };
}

export function useGoldRates() {
    const { data, error, isLoading } = useSWR<FinancialData>(
        'https://finance.truncgil.com/api/gold-rates',
        fetcher,
        { refreshInterval: 60000 }
    );

    return {
        goldRates: data,
        goldError: error,
        isGoldLoading: isLoading
    };
}

// Tüm finansal verileri tek bir hook'ta birleştiren toplu fonksiyon
export function useFinancialData() {
    const { currencyRates, currencyError, isCurrencyLoading } = useCurrencyRates();
    const { goldRates, goldError, isGoldLoading } = useGoldRates();

    return {
        currencyRates,
        goldRates,
        error: currencyError || goldError,
        isLoading: isCurrencyLoading || isGoldLoading
    };
}
