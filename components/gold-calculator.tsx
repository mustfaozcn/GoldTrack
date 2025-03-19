'use client';

import {useState} from 'react';
import {useGoldCalculator} from '@/hooks/use-gold-calculator';
import {calculateTotalValue} from '@/lib/gold-utils';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {translations} from '@/lib/translations';
import {useLanguage} from '@/contexts/language-context';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {Coins, Trash2} from 'lucide-react';
import {format} from 'date-fns';
import {tr, enUS} from 'date-fns/locale';

export default function GoldCalculator() {
    const {language} = useLanguage();
    const t = translations[language];
    const dateLocale = language === 'tr' ? tr : enUS;

    const {
        items,
        goldRates,
        currencyRates,
        selectedCurrency,
        setSelectedCurrency,
        addItem,
        removeItem,
        clearItems,
        processNaturalInput,
        isLoading,
        error,
    } = useGoldCalculator();

    const [naturalInput, setNaturalInput] = useState('');
    const [manualType, setManualType] = useState('GRA');
    const [manualQuantity, setManualQuantity] = useState('1');
    const [manualGrams, setManualGrams] = useState('1');
    const [isProcessing, setIsProcessing] = useState(false);

    const isJewelryType = ['ODA', 'OSA', 'YIA'].includes(manualType);

    if (error) {
        return (
            <div className="text-center text-red-600">
                {t.errorLoading}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-amber-800">{t.loading}</p>
            </div>
        );
    }

    const totalValue = calculateTotalValue(
        items,
        goldRates,
        selectedCurrency,
        currencyRates
    );

    const lastUpdate = goldRates?.Meta_Data?.Update_Date
        ? format(new Date(goldRates.Meta_Data.Update_Date), 'dd MMM yyyy HH:mm', {locale: dateLocale})
        : 'N/A';

    const handleNaturalInput = async () => {
        setIsProcessing(true);
        try {
            await processNaturalInput(naturalInput);
            setNaturalInput('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleManualAdd = () => {
        const quantity = parseFloat(manualQuantity);
        const grams = isJewelryType ? parseFloat(manualGrams) : undefined;
        addItem(manualType, quantity, grams);
        setManualQuantity('1');
        setManualGrams('1');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-full">
            {/* Sol Sütun - Giriş Alanları (%40) */}
            <div className="lg:col-span-4 space-y-4">
                {/* Doğal Dil Girişi */}
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-lg">{t.naturalInputTitle}</CardTitle>
                        <CardDescription className="text-sm">{t.naturalInputDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                value={naturalInput}
                                onChange={(e) => setNaturalInput(e.target.value)}
                                placeholder={t.typeHere}
                                className="flex-1"
                                disabled={isProcessing}
                            />
                            <Button
                                onClick={handleNaturalInput}
                                disabled={isProcessing}
                                className="w-full sm:w-auto"
                            >
                                {isProcessing ? t.processing : t.add}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Manuel Giriş */}
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-lg">{t.manualEntryTitle}</CardTitle>
                        <CardDescription className="text-sm">{t.manualEntryDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="space-y-3">
                            <Select
                                value={manualType}
                                onValueChange={setManualType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t.selectGoldType}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(t.goldTypes).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={manualQuantity}
                                    onChange={(e) => setManualQuantity(e.target.value)}
                                    className="flex-1"
                                    placeholder={t.quantity}
                                />
                                {isJewelryType && (
                                    <Input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={manualGrams}
                                        onChange={(e) => setManualGrams(e.target.value)}
                                        className="flex-1"
                                        placeholder={t.grams}
                                    />
                                )}
                            </div>
                            <Button
                                onClick={handleManualAdd}
                                className="w-full"
                            >
                                {t.add}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sağ Sütun - Altın Listesi (%60) */}
            <div className="lg:col-span-6">
                <Card className="h-full flex flex-col">
                    <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg">{t.yourGoldItems}</CardTitle>
                                <CardDescription className="text-sm">
                                    {t.lastUpdated}: {lastUpdate}
                                </CardDescription>
                            </div>
                            {items.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={clearItems}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    {t.clearAll}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-auto flex-grow">
                        {items.length === 0 ? (
                            <div className="flex items-center justify-center h-[160px]">
                                <p className="text-center text-muted-foreground">
                                    {t.noItems}
                                </p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between bg-muted p-2 rounded"
                                    >
                                        <span>
                                          {item.quantity} x {t.goldTypes[item.type]}
                                            {item.grams && ` (${item.grams}g)`}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                    <CardFooter className="border-t p-4">
                        <div className="w-full">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-amber-600"/>
                                    <span className="font-semibold">{t.totalValue}:</span>
                                </div>
                                <Select
                                    value={selectedCurrency}
                                    onValueChange={(value) => setSelectedCurrency(value as Currency)}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Currency"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TRY">TRY</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-2xl font-bold text-right mt-2">
                                {totalValue.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US', {
                                    style: 'currency',
                                    currency: selectedCurrency,
                                })}
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
