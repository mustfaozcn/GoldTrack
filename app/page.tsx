'use client';

import GoldCalculator from '@/components/gold-calculator';
import FinancialIndicators from "@/components/financial_indicators";

export default function Home() {
    return (
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex-grow flex flex-col">
            <div className="container mx-auto px-4 py-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <FinancialIndicators />
                    <GoldCalculator />
                </div>
            </div>
        </div>
    );
}
