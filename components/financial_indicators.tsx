// components/financial-indicators.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, DollarSign, Euro, Coins } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useFinancialData } from '@/lib/api-service';

export default function FinancialIndicators() {
    const { language } = useLanguage();
    const { currencyRates, goldRates, error, isLoading } = useFinancialData();

    // Para birimi formatı için helper fonksiyon
    const formatCurrency = (value: number, currency: string = 'TRY') => {
        return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Yüzde değişim için helper fonksiyon
    const formatChange = (change: number) => {
        const prefix = change > 0 ? '+' : '';
        return `${prefix}${change.toFixed(2)}%`;
    };

    // Yükleme durumu için iskelet
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[1, 2, 3].map((n) => (
                    <Card key={n} className="bg-white dark:bg-gray-800">
                        <CardContent className="p-3">
                            <Skeleton className="h-6 w-24 mb-2" />
                            <Skeleton className="h-8 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Hata durumunda
    if (error) {
        return (
            <div className="text-red-500 mb-6 p-3 bg-red-100 dark:bg-red-900/20 rounded">
                {language === 'tr' ? 'Veriler yüklenirken bir hata oluştu.' : 'Error loading data.'}
            </div>
        );
    }

    // Veri yoksa bir şey gösterme
    if (!currencyRates?.Rates || !goldRates?.Rates) return null;

    const usdRate = currencyRates.Rates.USD;
    const eurRate = currencyRates.Rates.EUR;
    const goldRate = goldRates.Rates.GRA;

    const lastUpdate = new Date(currencyRates.Meta_Data.Update_Date);
    const formattedUpdate = lastUpdate.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Dolar/TRY Kartı */}
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                                <span className="text-sm font-medium">USD/TRY</span>
                            </div>
                            <div className={`flex items-center text-xs ${usdRate.Change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {usdRate.Change > 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{formatChange(usdRate.Change)}</span>
                            </div>
                        </div>
                        <div className="text-lg font-semibold">
                            {formatCurrency(usdRate.Selling, 'TRY')}
                        </div>
                    </CardContent>
                </Card>

                {/* Euro/TRY Kartı */}
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <Euro className="h-4 w-4 text-yellow-600 mr-1" />
                                <span className="text-sm font-medium">EUR/TRY</span>
                            </div>
                            <div className={`flex items-center text-xs ${eurRate.Change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {eurRate.Change > 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{formatChange(eurRate.Change)}</span>
                            </div>
                        </div>
                        <div className="text-lg font-semibold">
                            {formatCurrency(eurRate.Selling, 'TRY')}
                        </div>
                    </CardContent>
                </Card>

                {/* Gram Altın/TRY Kartı */}
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <Coins className="h-4 w-4 text-amber-500 mr-1" />
                                <span className="text-sm font-medium">
                  {language === 'tr' ? 'Gram Altın' : 'Gold Gram'}
                </span>
                            </div>
                            <div className={`flex items-center text-xs ${goldRate.Change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {goldRate.Change > 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{formatChange(goldRate.Change)}</span>
                            </div>
                        </div>
                        <div className="text-lg font-semibold">
                            {formatCurrency(goldRate.Selling, 'TRY')}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'tr' ? 'Son güncelleme:' : 'Last update:'} {formattedUpdate}
            </div>
        </div>
    );
}
