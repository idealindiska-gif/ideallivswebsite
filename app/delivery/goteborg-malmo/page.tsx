import { Metadata } from "next";
import { PageTemplate } from "@/components/templates";

export const metadata: Metadata = {
    title: "Grocery Delivery in Göteborg & Malmö - Indian & Pakistani Food",
    description: "Get authentic Indian and Pakistani groceries delivered in Göteborg and Malmö. Scheduled delivery to all areas including Mölndal, Lund, Helsingborg, and more.",
};

export default function GoteborgMalmoDeliveryPage() {
    const content = `
    <p class="lead">Serving South Sweden with authentic Indian and Pakistani groceries</p>

    <h2>Göteborg Delivery Coverage</h2>
    
    <h3>Central Göteborg</h3>
    <ul>
      <li>Centrum, Inom Vallgraven</li>
      <li>Linné, Majorna-Linné</li>
      <li>Örgryte-Härlanda</li>
    </ul>

    <h3>Greater Göteborg Areas</h3>
    <ul>
      <li><strong>Mölndal</strong> - Complete municipality coverage</li>
      <li><strong>Partille</strong> - All residential areas</li>
      <li><strong>Lerum</strong> - Town center and suburbs</li>
      <li><strong>Kungsbacka</strong> - Central areas</li>
      <li><strong>Kungälv</strong> - Main residential zones</li>
    </ul>

    <h2>Göteborg Delivery Details</h2>
    <ul>
      <li><strong>Delivery Days:</strong> Tuesday, Thursday, Saturday</li>
      <li><strong>Order Deadline:</strong> Day before delivery by 6 PM</li>
      <li><strong>Delivery Time:</strong> 2-6 PM on delivery days</li>
      <li><strong>Minimum Order:</strong> No minimum order required</li>
    </ul>

    <h3>Why Göteborg Families Choose Us</h3>
    <ul>
      <li>✓ Scheduled delivery - plan your weekly shopping</li>
      <li>✓ Fresh quality guaranteed</li>
      <li>✓ Competitive pricing for Göteborg market</li>
      <li>✓ Large orders welcome - perfect for families</li>
    </ul>

    <h3>Popular Products for Göteborg Customers</h3>
    <ul>
      <li>Fresh Indian vegetables and herbs</li>
      <li>Halal meat selection</li>
      <li>Pakistani rice varieties (Basmati, Sella)</li>
      <li>Frozen parathas and naan</li>
      <li>Regional spice blends</li>
      <li>Indian and Pakistani sweets</li>
    </ul>

    <hr />

    <h2>Malmö City Districts</h2>
    <ul>
      <li>Malmö Centrum, Västra Hamnen</li>
      <li>Rosengård, Södra Innerstaden</li>
      <li>Limhamn-Bunkeflo, Husie</li>
    </ul>

    <h3>Surrounding Skåne Areas</h3>
    <ul>
      <li><strong>Lund</strong> - University area and city center</li>
      <li><strong>Helsingborg</strong> - Central and residential areas</li>
      <li><strong>Trelleborg</strong> - Town center delivery</li>
      <li><strong>Ystad</strong> - Main areas covered</li>
      <li><strong>Landskrona</strong> - City-wide delivery</li>
    </ul>

    <h2>Malmö Delivery Schedule</h2>
    <ul>
      <li><strong>Delivery Days:</strong> Wednesday and Saturday</li>
      <li><strong>Order Deadline:</strong> 24 hours before delivery</li>
      <li><strong>Time Slots:</strong> Morning (9-12) or Afternoon (2-6)</li>
      <li><strong>Minimum Order:</strong> No minimum order amount required</li>
    </ul>

    <h3>Malmö's Favorite Indian & Pakistani Products</h3>
    <ul>
      <li>Fresh curry leaves and coriander</li>
      <li>South Indian specialties (dosa mix, sambhar powder)</li>
      <li>Pakistani basmati rice</li>
      <li>Halal meat and chicken</li>
      <li>Indian pickles and chutneys</li>
      <li>Regional snacks and sweets</li>
    </ul>

    <hr />

    <h2>How to Place Your Order</h2>
    <ul>
      <li><strong>Advance Booking:</strong> Required 24-48 hours</li>
      <li><strong>Delivery Fee:</strong> Delivered by DHL, prices shown at checkout</li>
      <li><strong>Contact:</strong> WhatsApp <a href="https://wa.me/46728494801">+46 728 494 801</a></li>
    </ul>

    <p><strong>Note:</strong> All delivery times are approximate. We will confirm your exact delivery window after you place your order.</p>
  `;

    return (
        <PageTemplate
            title="Indian & Pakistani Grocery Delivery in Göteborg & Malmö"
            content={content}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Delivery', href: '/pages/delivery-information' },
                { label: 'Göteborg & Malmö' }
            ]}
            layout="two-column"
            showHero={true}
        />
    );
}
