/**
 * URL Status Checker
 *
 * Checks if a URL returns redirect, 404, 403, or 200
 * Useful for debugging Google Search Console issues
 *
 * Usage: node scripts/check-url-status.js <url>
 * Example: node scripts/check-url-status.js https://www.ideallivs.com/product/basmati-rice
 */

const https = require('https');
const http = require('http');

async function checkURL(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
      // Don't follow redirects automatically
      followRedirects: false,
    };

    const req = lib.get(url, options, (res) => {
      let redirectLocation = res.headers.location || null;

      console.log('\n🔍 URL Status Check');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);

      if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log(`Type: ⚠️  REDIRECT (${res.statusCode})`);
        console.log(`Redirect to: ${redirectLocation || 'Not specified'}`);
      } else if (res.statusCode === 200) {
        console.log(`Type: ✅ OK`);
      } else if (res.statusCode === 404) {
        console.log(`Type: ❌ NOT FOUND`);
      } else if (res.statusCode === 403) {
        console.log(`Type: 🚫 FORBIDDEN`);
      } else if (res.statusCode >= 500) {
        console.log(`Type: 💥 SERVER ERROR`);
      }

      console.log('\nResponse Headers:');
      console.log('  Content-Type:', res.headers['content-type'] || 'Not set');
      console.log('  Cache-Control:', res.headers['cache-control'] || 'Not set');

      if (res.headers['x-robots-tag']) {
        console.log('  X-Robots-Tag:', res.headers['x-robots-tag']);
      }

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // If it's a redirect, follow it
      if (redirectLocation && (res.statusCode === 301 || res.statusCode === 302)) {
        console.log('Following redirect...\n');

        // Make redirect location absolute if relative
        const absoluteRedirect = redirectLocation.startsWith('http')
          ? redirectLocation
          : new URL(redirectLocation, url).href;

        checkURL(absoluteRedirect).then(resolve);
      } else {
        resolve({
          url,
          statusCode: res.statusCode,
          redirectLocation,
        });
      }
    });

    req.on('error', (error) => {
      console.error('\n❌ Error checking URL:', error.message, '\n');
      resolve({ url, error: error.message });
    });

    req.end();
  });
}

// Get URL from command line
const url = process.argv[2];

if (!url) {
  console.log('\n❌ Usage: node scripts/check-url-status.js <url>\n');
  console.log('Example:');
  console.log('  node scripts/check-url-status.js https://www.ideallivs.com/product/basmati-rice\n');
  process.exit(1);
}

// Validate URL
try {
  new URL(url);
} catch (error) {
  console.error('\n❌ Invalid URL:', url, '\n');
  process.exit(1);
}

checkURL(url);
