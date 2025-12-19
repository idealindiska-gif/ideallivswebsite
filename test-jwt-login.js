#!/usr/bin/env node

/**
 * Simple JWT Login Test Script
 *
 * This script tests the Simple JWT Login plugin configuration
 * Usage: node test-jwt-login.js <email> <password>
 */

const WORDPRESS_URL = 'https://crm.ideallivs.com';
const AUTH_KEY = 'IdealIndiskaStockholmAuthKey';

async function testJWTLogin(email, password) {
    const url = `${WORDPRESS_URL}/wp-json/simple-jwt-login/v1/auth`;

    console.log('\n🔍 Testing Simple JWT Login Plugin...\n');
    console.log('Endpoint:', url);
    console.log('Email:', email);
    console.log('AUTH_KEY:', AUTH_KEY);
    console.log('\n' + '='.repeat(60) + '\n');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                AUTH_KEY: AUTH_KEY,
            }),
        });

        console.log('Response Status:', response.status, response.statusText);
        console.log('\n' + '-'.repeat(60) + '\n');

        const data = await response.json();
        console.log('Response Body:', JSON.stringify(data, null, 2));
        console.log('\n' + '='.repeat(60) + '\n');

        if (response.ok) {
            console.log('✅ SUCCESS! JWT Token received.');
            console.log('\nToken:', data.data?.jwt || data.jwt);
            console.log('User Email:', data.data?.user?.user_email || data.user?.user_email);
            console.log('User Name:', data.data?.user?.user_display_name || data.user?.user_display_name);
        } else {
            console.log('❌ FAILED! Authentication unsuccessful.');
            console.log('\nPossible Issues:');
            console.log('1. Simple JWT Login plugin not activated in WordPress');
            console.log('2. AUTH_KEY mismatch in plugin settings');
            console.log('3. Email authentication not enabled in plugin');
            console.log('4. Invalid email or password');
            console.log('\n📖 Configuration Guide:');
            console.log('   WordPress Admin → Settings → Simple JWT Login → Settings');
            console.log('   - Authentication Tab: Enable "Allow Authentication"');
            console.log('   - Auth Key: ' + AUTH_KEY);
            console.log('   - Enable "Allow Authentication by email"');
            console.log('   - Login Tab: Enable "Allow Login", select "Email" parameter');
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\nPossible Issues:');
        console.log('1. WordPress site is not accessible');
        console.log('2. Simple JWT Login plugin not installed/activated');
        console.log('3. Network/CORS issues');
    }

    console.log('\n');
}

// Get credentials from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('\n❌ Usage: node test-jwt-login.js <email> <password>\n');
    console.log('Example:');
    console.log('  node test-jwt-login.js user@example.com mypassword\n');
    process.exit(1);
}

testJWTLogin(email, password);
