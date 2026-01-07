/**
 * WooCommerce API Connection Test
 *
 * Tests the WooCommerce API connection with your credentials
 * Run: node scripts/test-woocommerce-connection.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function testConnection() {
  console.log('🔍 Testing WooCommerce API Connection...\n');

  // Check credentials
  console.log('Configuration:');
  console.log(`  WordPress URL: ${WORDPRESS_URL}`);
  console.log(`  Consumer Key: ${CONSUMER_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  Consumer Secret: ${CONSUMER_SECRET ? '✅ Set' : '❌ Missing'}\n`);

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('❌ ERROR: Missing credentials in .env.local\n');
    process.exit(1);
  }

  const testEndpoint = `${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=1`;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  console.log(`Testing endpoint: ${testEndpoint}\n`);

  try {
    const startTime = Date.now();

    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${responseTime}ms`);

    if (response.ok) {
      const data = await response.json();
      const totalProducts = response.headers.get('x-wp-total');

      console.log(`\n✅ SUCCESS! WooCommerce API is accessible`);
      console.log(`   Total Products: ${totalProducts}`);
      console.log(`   Products Returned: ${data.length}\n`);

      if (data.length > 0) {
        console.log('Sample Product:');
        console.log(`  - ID: ${data[0].id}`);
        console.log(`  - Name: ${data[0].name}`);
        console.log(`  - Price: ${data[0].price} SEK\n`);
      }

      return true;
    } else {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));

      console.log(`\n❌ FAILED: ${response.status} ${response.statusText}`);
      console.log(`Error Details:`, JSON.stringify(errorData, null, 2));
      console.log(`\n`);

      if (response.status === 401) {
        console.log('🔧 TROUBLESHOOTING 401 Unauthorized:');
        console.log('   1. Go to WordPress Admin → WooCommerce → Settings → Advanced → REST API');
        console.log('   2. Create a new API key with Read/Write permissions');
        console.log('   3. Update WORDPRESS_CONSUMER_KEY and WORDPRESS_CONSUMER_SECRET in .env.local');
        console.log('   4. Ensure the credentials are not expired\n');
      } else if (response.status === 403) {
        console.log('🔧 TROUBLESHOOTING 403 Forbidden:');
        console.log('   1. Check WordPress security plugins (Wordfence, etc.)');
        console.log('   2. Verify your IP is not blocked');
        console.log('   3. Check firewall settings\n');
      }

      return false;
    }
  } catch (error) {
    console.log(`\n❌ CONNECTION FAILED`);
    console.log(`Error: ${error.message}\n`);

    if (error.message.includes('ENOTFOUND')) {
      console.log('🔧 TROUBLESHOOTING DNS Error:');
      console.log('   - Check NEXT_PUBLIC_WORDPRESS_URL is correct');
      console.log('   - Verify the domain is accessible\n');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNRESET')) {
      console.log('🔧 TROUBLESHOOTING Timeout/Connection Reset:');
      console.log('   - WordPress server may be slow or down');
      console.log('   - Check server resources (CPU, memory)');
      console.log('   - Verify SSL certificate is valid');
      console.log('   - Check firewall/security settings\n');
    }

    return false;
  }
}

// Run test
testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
