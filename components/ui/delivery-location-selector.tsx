'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useCurrencyStore, DELIVERY_COUNTRIES, CURRENCIES, type DeliveryCountry } from '@/store/currency-store';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DeliveryLocationSelectorProps {
    variant?: 'default' | 'compact' | 'header';
    className?: string;
}

export function DeliveryLocationSelector({ variant = 'default', className }: DeliveryLocationSelectorProps) {
    const {
        selectedCountry,
        selectedCurrency,
        setCountry,
        updateExchangeRates,
        lastUpdated,
        isLoading
    } = useCurrencyStore();

    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const t = useTranslations('deliverySelector');

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update rates on mount and every hour
    useEffect(() => {
        if (mounted) {
            updateExchangeRates();
            const interval = setInterval(() => {
                updateExchangeRates();
            }, 3600000); // 1 hour

            return () => clearInterval(interval);
        }
    }, [mounted, updateExchangeRates]);

    const handleCountryChange = (country: DeliveryCountry) => {
        setCountry(country.code);
        setOpen(false);
    };

    const handleRefreshRates = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateExchangeRates();
    };

    // Group countries by region
    const scandinavianCountries = DELIVERY_COUNTRIES.filter(c =>
        c.shippingZone === 'sweden' || c.shippingZone === 'scandinavia'
    );
    const europeanCountries = DELIVERY_COUNTRIES.filter(c =>
        c.shippingZone === 'europe'
    );

    const currentCurrency = CURRENCIES[selectedCurrency];

    // Only render after mount to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className={cn("flex flex-col items-start text-sm", className)}>
                <span className="flex items-center gap-1 font-medium text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary/80"></span> {t('deliverTo')}
                </span>
                <span className="text-xs text-muted-foreground">{t('loading')}</span>
            </div>
        );
    }

    // Header variant (matches the original "Deliver to" design)
    if (variant === 'header') {
        return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex flex-col items-start text-sm hover:opacity-80 transition-opacity cursor-pointer focus:outline-none",
                            className
                        )}
                    >
                        <span className="flex items-center gap-1 font-medium text-foreground">
                            <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse"></span>
                            {t('deliverTo')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.name}</span>
                            <span className="text-[10px] opacity-70">({currentCurrency.code})</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto">
                    <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs font-semibold text-foreground">{t('selectCountry')}</p>
                        <p className="text-[10px] text-muted-foreground">{t('currencyUpdate')}</p>
                    </div>

                    {/* Scandinavia Section */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-3 py-1.5 bg-muted/30">
                        🌍 {t('scandinavia')}
                    </DropdownMenuLabel>
                    {scandinavianCountries.map((country) => (
                        <DropdownMenuItem
                            key={country.code}
                            onClick={() => handleCountryChange(country)}
                            className="cursor-pointer px-3 py-1.5 focus:bg-accent focus:text-accent-foreground"
                        >
                            <div className="flex items-center w-full gap-2">
                                <span className="text-base leading-none">{country.flag}</span>
                                <span className="text-sm font-semibold">{country.code}</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-medium min-w-[20px] text-right">
                                        {CURRENCIES[country.currency].symbol}
                                    </span>
                                    {selectedCountry.code === country.code && (
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                    )}
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Europe Section */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-3 py-1.5 bg-muted/30">
                        🇪🇺 {t('europe')}
                    </DropdownMenuLabel>
                    {europeanCountries.map((country) => (
                        <DropdownMenuItem
                            key={country.code}
                            onClick={() => handleCountryChange(country)}
                            className="cursor-pointer px-3 py-1.5 focus:bg-accent focus:text-accent-foreground"
                        >
                            <div className="flex items-center w-full gap-2">
                                <span className="text-base leading-none">{country.flag}</span>
                                <span className="text-sm font-semibold">{country.code}</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-medium min-w-[20px] text-right">
                                        {CURRENCIES[country.currency].symbol}
                                    </span>
                                    {selectedCountry.code === country.code && (
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                    )}
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Footer with rate info */}
                    <div className="px-3 py-2 flex items-center justify-between bg-muted/20">
                        <div className="text-[10px] text-muted-foreground">
                            {lastUpdated ? t('rates', { date: lastUpdated }) : t('loadingRates')}
                        </div>
                        <button
                            onClick={handleRefreshRates}
                            disabled={isLoading}
                            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
                            title={t('refreshRates')}
                        >
                            <RefreshCw className={cn('h-3 w-3 text-muted-foreground', isLoading && 'animate-spin')} />
                        </button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-9 gap-1.5 px-2.5", className)}
                    >
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span className="font-medium text-sm">{selectedCurrency}</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] max-h-[350px] overflow-y-auto">
                    <DropdownMenuLabel className="text-xs">{t('scandinavia')}</DropdownMenuLabel>
                    {scandinavianCountries.map((country) => (
                        <DropdownMenuItem
                            key={country.code}
                            onClick={() => handleCountryChange(country)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{country.flag}</span>
                                    <span className="font-medium text-sm">{country.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-muted-foreground">{country.currency}</span>
                                    {selectedCountry.code === country.code && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">{t('europe')}</DropdownMenuLabel>
                    {europeanCountries.map((country) => (
                        <DropdownMenuItem
                            key={country.code}
                            onClick={() => handleCountryChange(country)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{country.flag}</span>
                                    <span className="font-medium text-sm">{country.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-muted-foreground">{country.currency}</span>
                                    {selectedCountry.code === country.code && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Default variant (full display)
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("h-10 gap-2", className)}
                >
                    <MapPin className="h-4 w-4" />
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="font-medium">{selectedCountry.name}</span>
                    <span className="text-muted-foreground">({currentCurrency.symbol})</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center justify-between">
                    <span>{t('selectCountry')}</span>
                    <button
                        onClick={handleRefreshRates}
                        disabled={isLoading}
                        className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
                        title={t('refreshRates')}
                    >
                        <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
                    </button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">{t('scandinavia')}</DropdownMenuLabel>
                {scandinavianCountries.map((country) => (
                    <DropdownMenuItem
                        key={country.code}
                        onClick={() => handleCountryChange(country)}
                        className="cursor-pointer py-2.5"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{country.flag}</span>
                                <div>
                                    <p className="font-medium">{country.name}</p>
                                    <p className="text-xs text-muted-foreground">{CURRENCIES[country.currency].name}</p>
                                </div>
                            </div>
                            {selectedCountry.code === country.code && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">{t('europe')}</DropdownMenuLabel>
                {europeanCountries.map((country) => (
                    <DropdownMenuItem
                        key={country.code}
                        onClick={() => handleCountryChange(country)}
                        className="cursor-pointer py-2.5"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{country.flag}</span>
                                <div>
                                    <p className="font-medium">{country.name}</p>
                                    <p className="text-xs text-muted-foreground">{CURRENCIES[country.currency].name}</p>
                                </div>
                            </div>
                            {selectedCountry.code === country.code && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}
                {lastUpdated && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-[10px] text-muted-foreground text-center">
                            {t('ratesUpdated', { date: lastUpdated })}
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
