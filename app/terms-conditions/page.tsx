import { Metadata } from 'next';
import {
  StaticPageLayout,
} from '@/components/layout/static-page-layout';
import { brandProfile } from '@/config/brand-profile';
import { FileText, ShoppingCart, CreditCard, Truck, Scale, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Ideal Indiska LIVS',
  description: 'Terms and conditions for using ideallivs.com. Learn about our policies on orders, payments, delivery, and more.',
};

export default function TermsConditionsPage() {
  return (
    <StaticPageLayout
      title="Terms & Conditions"
      description="Please read these terms carefully before using our services"
      breadcrumbs={[{ label: 'Terms & Conditions', href: '/terms-conditions' }]}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">

        {/* Introduction */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Terms & Conditions</h2>
            <p className="text-muted-foreground mt-2">Last Updated: May 29, 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              Welcome to {brandProfile.name}. By accessing or using our website <a href={brandProfile.website.url} className="text-primary hover:underline">{brandProfile.website.url}</a>, you agree to be bound by the following terms and conditions:
            </p>
          </div>
        </section>

        {/* General Use */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              1. General Use
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>All content, images, and product listings are for informational purposes and may be updated without prior notice.</li>
              <li>Product availability may vary and is subject to stock levels both online and in our physical store.</li>
            </ul>
          </div>
        </section>

        {/* Orders */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              2. Orders
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders placed through our website are considered confirmed only upon receipt of payment.</li>
              <li>We reserve the right to cancel any order due to unforeseen stock issues, payment issues, or incorrect pricing.</li>
              <li>You will receive an order confirmation email once your payment has been successfully processed.</li>
            </ul>
          </div>
        </section>

        {/* Pricing and Payment */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              3. Pricing and Payment
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are listed in SEK (Swedish Krona) and include applicable VAT unless stated otherwise.</li>
              <li>Payments can be made via Swish, credit/debit cards, or other methods displayed at checkout.</li>
              <li>We use secure payment gateways including Stripe to process all transactions.</li>
              <li>Swish payments must be confirmed via WhatsApp or email for verification.</li>
            </ul>
          </div>
        </section>

        {/* Delivery */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              4. Delivery
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>Free delivery is available within designated areas in Stockholm on orders meeting the minimum spend requirement (500 SEK).</li>
              <li>For European deliveries, shipping costs are calculated automatically based on weight and destination.</li>
              <li>Delivery schedules may vary. Customers will be informed of any delays.</li>
              <li>Fresh and frozen items are only available for local Stockholm delivery.</li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              5. Intellectual Property
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>All content on the site, including but not limited to text, graphics, logos, images, and software, is the property of {brandProfile.name} or its content suppliers.</li>
              <li>Content may not be copied, reproduced, republished, uploaded, posted, transmitted, or distributed without our prior written permission.</li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              6. Limitation of Liability
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>We are not liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</li>
              <li>We do not warrant that the website will be uninterrupted, timely, secure, or error-free.</li>
              <li>Our total liability to you for any claim arising from or relating to these terms shall not exceed the amount you paid for the product(s) in question.</li>
            </ul>
          </div>
        </section>

        {/* Governing Law */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">7. Governing Law</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>These terms are governed by and construed in accordance with the laws of Sweden.</li>
              <li>Any disputes arising from these terms will be resolved in Swedish courts.</li>
              <li>We comply with all applicable Swedish and EU regulations, including GDPR.</li>
            </ul>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">8. Changes to Terms</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              We reserve the right to modify or replace these terms at any time. Any changes will be effective immediately upon posting on this page. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-6 scroll-mt-32">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these terms and conditions, please contact us at:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> <a href={`mailto:${brandProfile.contact.email}`} className="text-primary hover:underline">{brandProfile.contact.email}</a></li>
              <li><strong>Phone/WhatsApp:</strong> <a href={`tel:${brandProfile.contact.phone}`} className="text-primary hover:underline">{brandProfile.contact.phone}</a></li>
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Sheikh Global Trading</strong><br />
                {brandProfile.address.street}<br />
                {brandProfile.address.postalCode} {brandProfile.address.area}<br />
                {brandProfile.address.city}, {brandProfile.address.country}
              </p>
            </div>
          </div>
        </section>

      </div>
    </StaticPageLayout>
  );
}
