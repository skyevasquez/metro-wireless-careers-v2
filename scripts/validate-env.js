#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates all required environment variables for the Metro Wireless Plus Career Portal
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Environment Configuration...\n');

// Required environment variables
const requiredVars = [
    'EMAIL_USER',
    'EMAIL_PASS'
];

// Optional but recommended variables
const recommendedVars = [
    'PORT',
    'NODE_ENV',
    'RECIPIENT_EMAIL',
    'EMAIL_SERVER',
    'EMAIL_PORT'
];

// Load environment variables
require('dotenv').config();

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('✅ Required Variables:');
requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
        console.log(`❌ ${varName}: MISSING (Required)`);
        hasErrors = true;
    } else {
        console.log(`✅ ${varName}: Configured`);
    }
});

console.log('\n📋 Recommended Variables:');
recommendedVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
        console.log(`⚠️  ${varName}: Not set (Recommended)`);
        hasWarnings = true;
    } else {
        console.log(`✅ ${varName}: ${varName === 'EMAIL_PASS' ? '***' : value}`);
    }
});

// Validate email configuration
console.log('\n📧 Email Configuration:');
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (emailUser && emailPass) {
    console.log('✅ Email credentials configured');
    
    // Test email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailUser)) {
        console.log('✅ Email format valid');
    } else {
        console.log('❌ Email format invalid');
        hasErrors = true;
    }
} else {
    console.log('❌ Email credentials missing');
    hasErrors = true;
}

// Check for .env file
console.log('\n📁 File Configuration:');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
} else {
    console.log('⚠️  .env file not found (using environment variables)');
    hasWarnings = true;
}

// Final status
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ VALIDATION FAILED: Please fix the errors above');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  VALIDATION PASSED WITH WARNINGS: Consider addressing warnings');
    process.exit(0);
} else {
    console.log('✅ VALIDATION PASSED: All configurations are optimal');
    process.exit(0);
}