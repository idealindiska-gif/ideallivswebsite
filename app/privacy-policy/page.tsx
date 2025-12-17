import { Metadata } from 'next';
import {
  StaticPageLayout,
} from '@/components/layout/static-page-layout';
import { brandProfile } from '@/config/brand-profile';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ideal Indiska LIVS',
  description: 'Our commitment to protecting your privacy and handling your personal data with transparency and care, in full GDPR compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      description="Your privacy and data protection are our priority"
      breadcrumbs={[{ label: 'Privacy Policy', href: '/privacy-policy' }]}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">

        {/* Introduction */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Privacy Policy</h2>
            <p className="text-muted-foreground mt-2">Last Updated: September 20, 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              At {brandProfile.name} (part of Sheikh Global Trading), we are deeply committed to protecting your privacy and handling your personal data with transparency and care. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our website, {brandProfile.website.url}, or interact with our services.
            </p>
            <p>
              We operate in full compliance with the General Data Protection Regulation (GDPR) (EU) 2016/679 and applicable Swedish data protection laws. Our goal is to ensure you feel secure and confident when you shop with us, whether you are in Stockholm, Sweden, or anywhere else in Europe.
            </p>
          </div>
        </section>

        {/* Data Collection */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-7 w-7 text-primary" />
              What Personal Data Do We Collect?
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>We collect information that is necessary to provide you with our services and to improve your shopping experience. This includes:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity & Contact Data:</strong> Your first name, last name, email address, phone number, and delivery address, which you provide when creating an account or placing an order.</li>
              <li><strong>Transactional Data:</strong> Details about products you have purchased from us and the payment method used. Please note, we do not store your full credit card details; these are processed securely by our trusted payment gateways like Stripe.</li>
              <li><strong>Technical Data:</strong> When you browse our website, we may automatically collect technical information such as your IP address, browser type, device information, and general location (country/city).</li>
              <li><strong>Communication Data:</strong> If you contact us via email, WhatsApp, or our contact form, we will collect the information you provide in that communication.</li>
            </ul>
          </div>
        </section>

        {/* Data Usage */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Eye className="h-7 w-7 text-primary" />
              How We Use Your Personal Data
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>We use your data for specific and legitimate purposes, including:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Order Fulfillment:</strong> To process your payments, pack your order, and arrange for delivery via our local service or DHL. This is the primary reason we collect your contact and address information.</li>
              <li><strong>Customer Service:</strong> To communicate with you about your order status, respond to your inquiries, and provide support.</li>
              <li><strong>Improving Our Website:</strong> To analyze how customers use our site, helping us to improve our layout, product selection, and overall user experience.</li>
              <li><strong>Marketing & Promotions (with Your Consent):</strong> If you have explicitly opted-in (e.g., by subscribing to our newsletter or WhatsApp group), we will send you information about new products, special offers, and recipes. You can withdraw this consent at any time.</li>
              <li><strong>Legal & Security Obligations:</strong> To prevent fraud, comply with legal requirements, and maintain the security of our website and business.</li>
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Use of Cookies</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>Like most websites, we use cookies to enhance your browsing experience. Cookies are small text files stored on your device.</p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function correctly, such as keeping items in your shopping cart.</li>
              <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website by collecting anonymous data (e.g., through Google Analytics).</li>
              <li><strong>Marketing Cookies:</strong> These are used to provide you with more relevant advertisements if you have consented to marketing.</li>
            </ul>

            <p>
              You have full control over your cookie preferences and can manage them through your web browser settings. We do not sell or share your personal data with third parties for their own marketing purposes.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Lock className="h-7 w-7 text-primary" />
              Data Security & Retention
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              We take the security of your personal data very seriously. We have implemented appropriate technical and organizational measures to prevent your data from being accidentally lost, used, or accessed in an unauthorized way.
            </p>
            <p>
              We will only retain your personal data for as long as it is necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </div>
        </section>

        {/* GDPR Rights */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              Your GDPR Rights
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>As a user within the European Economic Area (EEA), you have several rights under the GDPR:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>The Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
              <li><strong>The Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete information.</li>
              <li><strong>The Right to Erasure ("Right to be Forgotten"):</strong> You can ask us to delete your personal data where there is no compelling reason for us to keep it.</li>
              <li><strong>The Right to Restrict Processing:</strong> You can ask us to suspend the processing of your personal data in certain circumstances.</li>
              <li><strong>The Right to Data Portability:</strong> You can request that we transfer your data to you or another service provider.</li>
              <li><strong>The Right to Object:</strong> You can object to us processing your data for marketing purposes.</li>
              <li><strong>The Right to Withdraw Consent:</strong> Where we rely on your consent to process data (e.g., for marketing), you can withdraw that consent at any time.</li>
            </ul>

            <p>To exercise any of these rights, please contact us using the details below.</p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-6 scroll-mt-32">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Contact & Data Controller Information</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>The data controller responsible for your personal data is:</p>

            <div className="bg-muted/50 p-6 rounded-lg not-prose">
              <p className="font-semibold text-foreground mb-2">Sheikh Global Trading ({brandProfile.name})</p>
              <p className="text-sm">{brandProfile.address.street}</p>
              <p className="text-sm">{brandProfile.address.postalCode} {brandProfile.address.area}</p>
              <p className="text-sm">{brandProfile.address.city}, {brandProfile.address.country}</p>
            </div>

            <p>For any questions, concerns, or requests regarding your personal data and this privacy policy, please contact us at:</p>

            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> {brandProfile.contact.email}</li>
              <li><strong>Phone/WhatsApp:</strong> {brandProfile.contact.phone}</li>
            </ul>

            <p>
              You also have the right to lodge a complaint with the Swedish Authority for Privacy Protection (Integritetsskyddsmyndigheten - IMY) if you have concerns about how we are handling your data.
            </p>

            <p className="mt-6">
              We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes. This policy was last updated on the effective date listed at the top.
            </p>
          </div>
        </section>

      </div>
    </StaticPageLayout>
  );
}
