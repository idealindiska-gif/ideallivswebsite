'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Tag } from 'lucide-react';
import { validateCouponAction } from '@/app/actions/woocommerce-settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

interface CouponInputProps {
    onApply: (coupon: any) => void;
    disabled?: boolean;
}

export function CouponInput({ onApply, disabled }: CouponInputProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const t = useTranslations('coupon');

    const handleApply = async () => {
        if (!code.trim()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await validateCouponAction(code);

            if (!result.success || !result.data) {
                setError(result.error || t('error'));
                return;
            }

            onApply(result.data);
            setSuccess(t('success', { code: result.data.code }));
            setCode('');
        } catch (err) {
            setError(t('failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('placeholder')}
                        className="pl-9"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={loading || disabled}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApply();
                            }
                        }}
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleApply}
                    disabled={loading || disabled || !code.trim()}
                    variant="secondary"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('apply')}
                </Button>
            </div>

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {success && (
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            )}
        </div>
    );
}
