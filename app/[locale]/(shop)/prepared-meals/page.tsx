/**
 * Prepared Meals Page - Weekend Biryani Pre-Orders
 * Fresh, authentic biryani available for weekend pickup/delivery
 */

import type { Metadata } from 'next';
import { BiryaniBookingForm } from '@/components/prepared-meals/biryani-booking-form';
import { BiryaniMenu } from '@/components/prepared-meals/biryani-menu';
import { Clock, Calendar, ChefHat, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { brandProfile } from '@/config/brand-profile';
import { SchemaScript } from "@/lib/schema/schema-script";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: `Best Chicken & Vegetable Biryani Stockholm | ${brandProfile.name}`,
  description: 'Authentic Chicken Biryani and Vegetable Biryani in Stockholm. Freshly prepared for weekend pickup/delivery. We also accept bulk orders for events and catering delivery any day of the week.',
  keywords: [
    'biryani stockholm',
    'chicken biryani stockholm',
    'vegetable biryani stockholm',
    'best biryani near me',
    'halal biryani stockholm',
    'indian catering stockholm',
    'bulk biryani order sweden',
    'weekend biryani stockholm',
  ].join(', '),
  alternates: {
    canonical: 'https://www.ideallivs.com/prepared-meals',
  },
};

export default function PreparedMealsPage() {
  const biryaniSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "Weekend Biryani Menu",
    "description": "Authentic Chicken and Vegetable Biryani available for weekend pickup and delivery in Stockholm.",
    "hasMenuItem": [
      {
        "@type": "MenuItem",
        "name": "Chicken Biryani",
        "description": "Tender chicken marinated in spices, layered with aromatic basmati rice.",
        "offers": {
          "@type": "Offer",
          "price": "119.00",
          "priceCurrency": "SEK"
        }
      },
      {
        "@type": "MenuItem",
        "name": "Vegetable Biryani",
        "description": "Seasonal vegetables layered with basmati rice and traditional spices.",
        "offers": {
          "@type": "Offer",
          "price": "119.00",
          "priceCurrency": "SEK"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950">
      <SchemaScript
        id="biryani-breadcrumb"
        schema={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Prepared Meals', url: '/prepared-meals' },
        ])}
      />
      <SchemaScript
        id="biryani-menu-schema"
        schema={biryaniSchema}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-12 md:py-16 border-b border-border/50 overflow-hidden">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            {/* Column 1: Heading & Pricing */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-6 text-[11px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                <ChefHat className="h-3.5 w-3.5" />
                <span>Chef&apos;s Special</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-[1.15] text-foreground tracking-tight mb-8">
                Authentic Biryani <br className="hidden md:block" /> in Stockholm
              </h1>

              <div className="flex items-center gap-4">
                <div className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xl shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span className="text-xs opacity-80 font-medium">Portion</span>
                  <span>119 kr</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground line-through text-xs">149 kr</span>
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Save 20%</span>
                </div>
              </div>
            </div>

            {/* Column 2: Description & Quick Tips */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed italic font-medium border-l-4 border-primary/30 pl-6">
                  &quot;Weekend family meals & any-day bulk orders for your special events. Handcrafted weekly by our gourmet chefs.&quot;
                </p>
                <p className="text-muted-foreground leading-relaxed pl-7">
                  Experience the true taste of the South Subcontinent. Our Biryani is slow-cooked with premium basmati rice and hand-milled spices, prepared fresh every Friday for your weekend enjoyment.
                </p>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow group">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Weekends</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Pickup/Delivery</p>
                </div>
                <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow group">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Bulk</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Available Daily</p>
                </div>
                <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow group">
                  <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Fresh</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Gourmet Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section: The Best Biryani in Stockholm */}
      <section className="bg-white dark:bg-gray-900 py-16 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-primary max-w-none dark:prose-invert">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Authentic Biryani Delivery in Stockholm
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-gray-600 dark:text-gray-300">
              <div className="space-y-4">
                <p>
                  Searching for the <strong>best biryani in Stockholm</strong>? Look no further. At Ideal Indiska LIVS, we bring the true flavors of South Asia to your table. Our biryani is slow-cooked to perfection, ensuring every grain of basmati rice absorbs the rich aroma of our hand-picked spices.
                </p>
                <p>
                  Whether you are craving a hearty <strong>Chicken Biryani</strong> or a fresh <strong>Vegetable Biryani</strong>, our weekend pre-order service is designed to bring a touch of tradition to your Saturday and Sunday family dinners.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  We don&apos;t just serve individuals; we are proud to offer <strong>bulk biryani orders in Stockholm</strong> for any occasion. Whether it&apos;s a birthday, corporate lunch, or a community gathering, we can deliver mass quantities of fresh, hot biryani any day of the week.
                </p>
                <p>
                  Our prices are consistent and transparent—just <strong>119 SEK per portion</strong>. Quality ingredients, authentic recipes, and local Stockholm service make us the preferred choice for biryani lovers across Sweden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <Alert className="max-w-4xl mx-auto bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">Weekend Order Deadline</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            For individual weekend meals, please book before <strong>Friday 6:00 PM</strong>.
            Bulk and catering orders can be scheduled for <strong>any day of the week</strong> with 48 hours notice.
          </AlertDescription>
        </Alert>
      </section>

      {/* Biryani Menu */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Signature Rice Bowls
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Handcrafted using traditional methods, layered with aromatic basmati rice,
              fresh herbs, and authentic spices from our own store.
            </p>
          </div>

          <BiryaniMenu />
        </div>
      </section>

      {/* Bulk Orders & Catering Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
              <ChefHat className="h-5 w-5 text-green-700 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Events & Catering</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bulk Orders & Catering
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Planning a party or corporate event? Get the best <strong>biryani catering in Stockholm</strong> delivered to your venue.
              Available 7 days a week for bulk orders (10+ portions).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Daily Availability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Any day of the week<br />For bulk orders
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <ChefHat className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Party Sizes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                From small gatherings<br />to large weddings
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Easy Scheduling</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Just 48 hours notice<br />for guaranteed delivery
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Stockholm Catering Packages:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Birthday & Dinner Parties
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Corporate Lunch Events
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Mosque & Community Gatherings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Family Get-togethers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Office Catering
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Custom Weekend Packages
              </li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded">
              <strong>Note:</strong> Bulk orders are available any day. Individual weekend orders must be booked by Friday.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="container mx-auto px-4 py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Order Biryani Online
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Quick booking for individuals and bulk events via form or WhatsApp.
            </p>
          </div>

          <BiryaniBookingForm />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Simple 4-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Selection</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Chicken or Vegetable options available
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Booking</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Pre-order before Friday (or 48h for bulk)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Preparation</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Cooked fresh by our specialty chef
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Enjoy</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Pickup at store or get it delivered
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Stockholm Biryani Guide & FAQ
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                How do I place a bulk order for a weekday?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                For 10 or more portions, we deliver any day of the week. Simply select the "Events or Catering" option in our form or message us directly on WhatsApp.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                What is included in the 119 SEK portion?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Each portion includes a generous serving of aromatic biryani rice, protein (chicken) or mixed vegetables, and is accompanied by our cool yogurt raita.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Do you offer biryani delivery across Stockholm?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer delivery within the Stockholm metropolitan area. Delivery charges depend on your location, but it is free for orders over 500 SEK in many areas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
