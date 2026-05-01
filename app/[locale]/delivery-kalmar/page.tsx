import { setRequestLocale } from 'next-intl/server';
import KalmarDeliveryPage from '@/app/delivery-kalmar/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Indian & Pakistani Grocery Delivery Kalmar | Ideal Indiska Livs",
    description:
        "Authentic Indian & Pakistani groceries delivered to Kalmar, Nybro, Torsås and all of Kalmar County via DHL. Home delivery & DHL Service Point pickup available. Order online from Ideal Indiska Livs Stockholm.",
    alternates: {
        canonical: "https://www.ideallivs.com/delivery-kalmar",
        languages: {
            'en': 'https://www.ideallivs.com/delivery-kalmar',
            'x-default': 'https://www.ideallivs.com/delivery-kalmar',
        },
    },
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <KalmarDeliveryPage />;
}
