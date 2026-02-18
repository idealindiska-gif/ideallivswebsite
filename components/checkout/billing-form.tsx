'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCountries } from '@/hooks/use-countries';
import { useTranslations } from 'next-intl';

const billingSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address_1: z.string().min(1, 'Address is required'),
    address_2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postcode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone number is required'),
});

export type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
    onSubmit: (data: BillingFormData) => void;
    defaultValues?: Partial<BillingFormData>;
    className?: string;
}

export function BillingForm({ onSubmit, defaultValues, className }: BillingFormProps) {
    const { countries } = useCountries();
    const t = useTranslations('billingForm');
    const tShipping = useTranslations('shippingForm');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<BillingFormData>({
        resolver: zodResolver(billingSchema),
        defaultValues: defaultValues || {
            country: 'SE',
        },
    });

    const selectedCountry = watch('country');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
            <div className="space-y-4">
                <h2 className="font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
                    {t('title')}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="billing_first_name">
                            {tShipping('firstName')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="billing_first_name"
                            {...register('first_name')}
                            className={errors.first_name ? 'border-destructive' : ''}
                        />
                        {errors.first_name && (
                            <p className="text-sm text-destructive">{errors.first_name.message}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="billing_last_name">
                            {tShipping('lastName')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="billing_last_name"
                            {...register('last_name')}
                            className={errors.last_name ? 'border-destructive' : ''}
                        />
                        {errors.last_name && (
                            <p className="text-sm text-destructive">{errors.last_name.message}</p>
                        )}
                    </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                    <Label htmlFor="billing_company">{tShipping('company')}</Label>
                    <Input id="billing_company" {...register('company')} />
                </div>

                {/* Country */}
                <div className="space-y-2">
                    <Label htmlFor="billing_country">
                        {tShipping('country')} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={selectedCountry}
                        onValueChange={(value) => setValue('country', value)}
                    >
                        <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                            <SelectValue placeholder={tShipping('selectCountry')} />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.country && (
                        <p className="text-sm text-destructive">{errors.country.message}</p>
                    )}
                </div>

                {/* Address 1 */}
                <div className="space-y-2">
                    <Label htmlFor="billing_address_1">
                        {tShipping('streetAddress')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="billing_address_1"
                        placeholder={tShipping('addressPlaceholder')}
                        {...register('address_1')}
                        className={errors.address_1 ? 'border-destructive' : ''}
                    />
                    {errors.address_1 && (
                        <p className="text-sm text-destructive">{errors.address_1.message}</p>
                    )}
                </div>

                {/* Address 2 */}
                <div className="space-y-2">
                    <Label htmlFor="billing_address_2">{tShipping('apartment')}</Label>
                    <Input id="billing_address_2" {...register('address_2')} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {/* City */}
                    <div className="space-y-2">
                        <Label htmlFor="billing_city">
                            {tShipping('city')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="billing_city"
                            {...register('city')}
                            className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && (
                            <p className="text-sm text-destructive">{errors.city.message}</p>
                        )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                        <Label htmlFor="billing_state">
                            {tShipping('state')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="billing_state"
                            {...register('state')}
                            className={errors.state ? 'border-destructive' : ''}
                        />
                        {errors.state && (
                            <p className="text-sm text-destructive">{errors.state.message}</p>
                        )}
                    </div>

                    {/* Postcode */}
                    <div className="space-y-2">
                        <Label htmlFor="billing_postcode">
                            {tShipping('postalCode')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="billing_postcode"
                            {...register('postcode')}
                            className={errors.postcode ? 'border-destructive' : ''}
                        />
                        {errors.postcode && (
                            <p className="text-sm text-destructive">{errors.postcode.message}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="billing_email">
                        {tShipping('email')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="billing_email"
                        type="email"
                        {...register('email')}
                        className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="billing_phone">
                        {tShipping('phone')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="billing_phone"
                        type="tel"
                        {...register('phone')}
                        className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
