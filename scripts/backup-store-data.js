#!/usr/bin/env node

/**
 * Store Data Backup Script
 * Creates a backup of the store data configuration
 */

const fs = require('fs');
const path = require('path');

console.log('💾 Metro Wireless Plus - Store Data Backup\n');

// Store data (same as in server.js)
const storeData = {
    'North': {
        manager: 'north.dm@metrowirelessplus.com',
        stores: [
            { id: 'north-001', name: 'Downtown Metro Store', address: '123 Main St, Metro City' },
            { id: 'north-002', name: 'Northside Plaza', address: '456 North Ave, Metro City' }
        ]
    },
    'South': {
        manager: 'south.dm@metrowirelessplus.com',
        stores: [
            { id: 'south-001', name: 'Southgate Mall', address: '789 South Blvd, Metro City' },
            { id: 'south-002', name: 'Metro South Center', address: '321 Southern Way, Metro City' }
        ]
    },
    'East': {
        manager: 'east.dm@metrowirelessplus.com',
        stores: [
            { id: 'east-001', name: 'Eastside Shopping Center', address: '654 East St, Metro City' },
            { id: 'east-002', name: 'Metro East Plaza', address: '987 Eastern Ave, Metro City' }
        ]
    },
    'West': {
        manager: 'west.dm@metrowirelessplus.com',
        stores: [
            { id: 'west-001', name: 'Westfield Metro', address: '147 West End Rd, Metro City' },
            { id: 'west-002', name: 'Metro West Gate', address: '258 Western Blvd, Metro City' }
        ]
    },
    'Central': {
        manager: 'central.dm@metrowirelessplus.com',
        stores: [
            { id: 'central-001', name: 'Metro Central Hub', address: '369 Central Ave, Metro City' },
            { id: 'central-002', name: 'City Center Metro', address: '741 Center St, Metro City' }
        ]
    },
    'Northeast': {
        manager: 'northeast.dm@metrowirelessplus.com',
        stores: [
            { id: 'ne-001', name: 'Northeast Metro Plaza', address: '852 NE Boulevard, Metro City' },
            { id: 'ne-002', name: 'Metro Northeast Center', address: '963 Northeast Way, Metro City' }
        ]
    },
    'Southwest': {
        manager: 'southwest.dm@metrowirelessplus.com',
        stores: [
            { id: 'sw-001', name: 'Southwest Metro Mall', address: '159 SW Avenue, Metro City' },
            { id: 'sw-002', name: 'Metro Southwest Plaza', address: '357 Southwest Dr, Metro City' }
        ]
    }
};

// Create backup
function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFile = path.join(backupDir, `store-data-backup-${timestamp}.json`);
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log('📁 Created backups directory');
    }
    
    // Create backup data with metadata
    const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        description: 'Metro Wireless Plus store data backup',
        data: storeData,
        statistics: {
            totalRegions: Object.keys(storeData).length,
            totalStores: Object.values(storeData).reduce((total, region) => total + region.stores.length, 0),
            regions: Object.keys(storeData)
        }
    };
    
    try {
        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
        console.log('✅ Backup created successfully');
        console.log('📄 File:', backupFile);
        console.log('📊 Statistics:');
        console.log(`   - Regions: ${backupData.statistics.totalRegions}`);
        console.log(`   - Stores: ${backupData.statistics.totalStores}`);
        console.log(`   - Timestamp: ${backupData.timestamp}`);
        
        return backupFile;
    } catch (error) {
        console.log('❌ Failed to create backup:', error.message);
        return null;
    }
}

// Validate store data
function validateStoreData() {
    console.log('🔍 Validating store data...');
    
    let isValid = true;
    const regions = Object.keys(storeData);
    
    regions.forEach(region => {
        const regionData = storeData[region];
        
        // Check manager email
        if (!regionData.manager || !regionData.manager.includes('@')) {
            console.log(`❌ Invalid manager email for ${region}: ${regionData.manager}`);
            isValid = false;
        }
        
        // Check stores
        if (!regionData.stores || !Array.isArray(regionData.stores)) {
            console.log(`❌ Invalid stores data for ${region}`);
            isValid = false;
        } else {
            regionData.stores.forEach((store, index) => {
                if (!store.id || !store.name || !store.address) {
                    console.log(`❌ Invalid store data for ${region}[${index}]:`, store);
                    isValid = false;
                }
            });
        }
    });
    
    if (isValid) {
        console.log('✅ Store data validation passed');
    } else {
        console.log('❌ Store data validation failed');
    }
    
    return isValid;
}

// Main function
function main() {
    console.log('Starting store data backup process...\n');
    
    // Validate data first
    const isValid = validateStoreData();
    console.log('');
    
    if (!isValid) {
        console.log('❌ Cannot create backup due to validation errors');
        process.exit(1);
    }
    
    // Create backup
    const backupFile = createBackup();
    console.log('');
    
    if (backupFile) {
        console.log('🎉 Store data backup completed successfully!');
        process.exit(0);
    } else {
        console.log('❌ Backup process failed');
        process.exit(1);
    }
}

// Run the backup
main();