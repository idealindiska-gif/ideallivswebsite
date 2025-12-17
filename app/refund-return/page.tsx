import { Metadata } from 'next';
import {
    StaticPageLayout,
} from '@/components/layout/static-page-layout';
import { brandProfile } from '@/config/brand-profile';
import { RotateCcw, Package, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Refund & Return Policy | Ideal Indiska LIVS',
    description: '14-day return policy for eligible items. Learn about our return process for customers in Sweden and Europe.',
};

export default function RefundReturnPage() {
    return (
        <StaticPageLayout
            title="Refund & Return Policy"
            description="Your satisfaction is our top priority"
            breadcrumbs={[{ label: 'Refund & Return', href: '/refund-return' }]}
        >
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">

                {/* Overview */}
                <section className="space-y-6">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                        <p className="text-muted-foreground mt-2">Last Updated: September 20, 2025</p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p>
                            At {brandProfile.name}, your satisfaction is our top priority. We are committed to providing high-quality, authentic Indian and Pakistani groceries to our customers across Sweden and Europe. This policy outlines the terms and conditions for returns and refunds to ensure a clear and fair process for everyone.
                        </p>
                    </div>
                </section>

                {/* 14-Day Policy */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Clock className="h-7 w-7 text-primary" />
                            Our 14-Day Return Policy
                        </h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p className="text-lg">
                            We offer a <strong className="text-foreground">14-day return window</strong> for eligible items. This means you have 14 days from the date you receive your order to request a return.
                        </p>
                    </div>
                </section>

                {/* Eligibility */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <CheckCircle2 className="h-7 w-7 text-green-600" />
                            Eligibility for a Return
                        </h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p>To be eligible for a return, the following conditions must be met:</p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>The item must be <strong className="text-foreground">non-perishable</strong>.</li>
                            <li>The item must be <strong className="text-foreground">unused, unopened</strong>, and in its original, sealed packaging.</li>
                            <li>The item must be in a <strong className="text-foreground">resalable condition</strong>.</li>
                            <li>You must provide a <strong className="text-foreground">proof of purchase</strong> (your order number or receipt).</li>
                        </ul>
                    </div>
                </section>

                {/* Non-Returnable */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <XCircle className="h-7 w-7 text-red-600" />
                            Non-Returnable Items
                        </h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p>For health, safety, and quality reasons, we <strong className="text-foreground">cannot accept returns</strong> on the following items:</p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Perishable Goods:</strong> Fresh produce (vegetables, fruits), dairy products (paneer, yogurt), and all frozen items.</li>
                            <li><strong>Opened or Used Products:</strong> Any item that has been opened or has a broken seal.</li>
                            <li><strong>Clearance Items:</strong> Products marked as "Final Sale" or on clearance.</li>
                        </ul>
                    </div>
                </section>

                {/* How to Return */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <RotateCcw className="h-7 w-7 text-primary" />
                            How to Initiate a Return
                        </h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>
                            We have a simple process for returns, whether you are our neighbour in Stockholm or a customer in Germany, Denmark, Finland, France, Norway, Spain, the Netherlands, or any other European country.
                        </p>

                        <div className="not-prose space-y-6">
                            <div className="bg-card border rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-4">For Customers in Sweden:</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">In-Store Return (Stockholm):</h4>
                                        <p className="text-sm text-muted-foreground">You are welcome to return eligible items directly to our physical store. Please bring your proof of purchase with you.</p>
                                        <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                                            <p className="font-medium">Our Address:</p>
                                            <p>{brandProfile.name}</p>
                                            <p>{brandProfile.address.street}, {brandProfile.address.postalCode}</p>
                                            <p>{brandProfile.address.area}, {brandProfile.address.city}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">Return by Post (Sweden-wide):</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Please contact us first via WhatsApp at {brandProfile.contact.phone} or email at {brandProfile.contact.email} to notify us of your return. Once confirmed, you can ship the item back to us. Please note that return shipping costs are the responsibility of the customer, unless the return is due to our error (e.g., wrong or defective item sent).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-4">For Customers in Europe (outside Sweden):</h3>

                                <p className="text-sm text-muted-foreground mb-3">
                                    To initiate a return from any European country, please contact us first via WhatsApp at {brandProfile.contact.phone} or email at {brandProfile.contact.email}.
                                </p>

                                <p className="text-sm text-muted-foreground mb-3">
                                    Our team will provide you with instructions and the return address.
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Return shipping costs for international orders are the responsibility of the customer, unless the return is due to an error on our part. We recommend using a trackable shipping service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Refunds */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Package className="h-7 w-7 text-primary" />
                            Refunds
                        </h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p>
                            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Processing Time:</strong> If approved, your refund will be processed automatically to your original method of payment within 5-10 business days.</li>
                            <li><strong>Please Note:</strong> It may take some additional time for your bank or credit card company to process and post the refund to your account.</li>
                        </ul>
                    </div>
                </section>

                {/* FAQ */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="border-b pb-4">
                        <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-foreground">Q: What happens if an item in my online order is out of stock?</h3>
                            <p>A: We operate a busy physical store in Stockholm, and occasionally an item may sell out before an online order can be processed. If this happens, we will contact you immediately to offer a full refund for that item or suggest a suitable alternative. Your satisfaction is our priority.</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-foreground">Q: I received a damaged or incorrect item. Who pays for the return shipping?</h3>
                            <p>A: If you receive a defective, damaged, or incorrect item, please contact us immediately. In such cases, {brandProfile.name} will cover the cost of return shipping. We may ask for a photo of the item to help us resolve the issue quickly.</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-foreground">Q: Can I return items I bought in the physical store via post?</h3>
                            <p>A: We recommend returning items bought in-store directly to the store. However, please contact us if you have special circumstances, and we will do our best to assist you.</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-foreground">Q: I am in France/Germany/Denmark. How long will my refund take?</h3>
                            <p>A: The refund is processed by us within 5-10 business days. The time it takes to appear in your account depends on your international bank's processing times, but the process is initiated from our end promptly upon approval.</p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="space-y-6 scroll-mt-32">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Contact Us for Any Questions</h2>
                        <p className="text-muted-foreground mb-6">
                            If you have any further questions about our return and refund policy, please do not hesitate to reach out to our friendly team.
                        </p>
                        <ul className="space-y-2">
                            <li><strong>Email:</strong> <a href={`mailto:${brandProfile.contact.email}`} className="text-primary hover:underline">{brandProfile.contact.email}</a></li>
                            <li><strong>Phone/WhatsApp:</strong> <a href={`tel:${brandProfile.contact.phone}`} className="text-primary hover:underline">{brandProfile.contact.phone}</a></li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-6">
                            {brandProfile.name} reserves the right to update or modify this policy at any time. Please check this page for the most current information.
                        </p>
                    </div>
                </section>

            </div>
        </StaticPageLayout>
    );
}
